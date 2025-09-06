const picker=require("../models/Picker")
const { auth } = require("../middleware/auth");
const Order = require("../models/OrderModel");
const PickupRequest = require("../models/PickupRequestModel");
const Picker = require("../models/Picker");

// 2. Remove from runner's bag
exports.removeOrderOrPickupFromBag = async (req, res) => {
  const { type, itemId } = req.body;
  const runnerId = req.user.id;

  // Input validation
  if (!type || !itemId) {
    return res.status(400).json({ error: "Type and itemId are required" });
  }

  if (!['order', 'pickup'].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be 'order' or 'pickup'" });
  }

  try {
    const runner = await picker.findById(runnerId);
    if (!runner) return res.status(404).json({ error: "Picker not found" });

    if (type === "order") {
      // Check if the order is actually assigned to this picker
      if (!runner.assignedDeliveries.includes(itemId)) {
        return res.status(400).json({ error: "Order not in your bag" });
      }

      await Order.findByIdAndUpdate(itemId, {
        deliveredBy: null,
        deliveryStatus: "processing",
      });

      runner.assignedDeliveries = runner.assignedDeliveries.filter(
        (id) => id.toString() !== itemId
      );
    } else if (type === "pickup") {
      // Check if the pickup is actually assigned to this picker
      if (!runner.assignedPickups.includes(itemId)) {
        return res.status(400).json({ error: "Pickup not in your bag" });
      }

      await PickupRequest.findByIdAndUpdate(itemId, {
        pickupBy: null,
        pickupStatus: "processing",
      });

      runner.assignedPickups = runner.assignedPickups.filter(
        (id) => id.toString() !== itemId
      );
    }

    await runner.save();
    res.status(200).json({ 
      success: true,
      message: `${type} removed from runner's bag.`,
      data: {
        type,
        itemId
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Mark delivery/pickup as done kajalagei che
exports.doneDeliverOrPickup = async (req, res) => {
  const { type, itemId } = req.body;
  const runnerId = req.user.id;

  // Input validation
  if (!type || !itemId) {
    return res.status(400).json({ error: "Type and itemId are required" });
  }

  if (!['order', 'pickup'].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be 'order' or 'pickup'" });
  }

  try {
    const runner = await picker.findById(runnerId);
    if (!runner) return res.status(404).json({ error: "Picker not found" });

    let pointsEarned = 0;

    if (type === "order") {
      const order = await Order.findById(itemId);
      if (!order || order.deliveredBy?.toString() !== runnerId)
        return res.status(403).json({ error: "Unauthorized or not assigned" });

      if (order.deliveryStatus !== "assigned") {
        return res.status(400).json({ error: "Order is not ready for completion" });
      }

      order.deliveryStatus = "delivered";
      order.deliveredAt = new Date();
      await order.save();

      runner.assignedDeliveries = runner.assignedDeliveries.filter(
        (id) => id.toString() !== itemId
      );

      pointsEarned = 5;
      runner.creditPoints += pointsEarned;
    } else if (type === "pickup") {
      const pickup = await PickupRequest.findById(itemId);
      if (!pickup || pickup.pickupBy?.toString() !== runnerId)
        return res.status(403).json({ error: "Unauthorized or not assigned" });

      if (pickup.pickupStatus !== "assigned") {
        return res.status(400).json({ error: "Pickup is not ready for completion" });
      }

      pickup.pickupStatus = "delivered";
      pickup.pickupDate = new Date();
      await pickup.save();

      // Remove from both assigned and emergency pickups arrays
      runner.assignedPickups = runner.assignedPickups.filter(
        (id) => id.toString() !== itemId
      );
      runner.emergencyPickups = runner.emergencyPickups.filter(
        (id) => id.toString() !== itemId
      );

      // Give more points for emergency pickups
      pointsEarned = pickup.isEmergency ? 15 : 10;
      runner.creditPoints += pointsEarned;
    }

    await runner.save();
    res.status(200).json({ 
      success: true,
      message: `${type} marked as completed.`,
      data: {
        type,
        itemId,
        pointsEarned,
        totalCreditPoints: runner.creditPoints
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. Get all available pickup requests (not yet assigned)
exports.getAvailablePickups = async (req, res) => {
  try {
    const availablePickups = await PickupRequest.find({
      pickupStatus: "processing"
    }).populate('userId', 'firstName lastName contactNumber');

    res.status(200).json({
      success: true,
      data: availablePickups
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 5. Get picker's current assignments
exports.getPickerAssignments = async (req, res) => {
  const pickerId = req.user.id;

  try {
    const pickerData = await picker.findById(pickerId)
      .populate({
        path: 'assignedPickups',
        populate: {
          path: 'userId',
          select: 'firstName lastName contactNumber'
        }
      })
      .populate({
        path: 'assignedDeliveries',
        populate: {
          path: 'userId',
          select: 'firstName lastName contactNumber'
        }
      });

    if (!pickerData) {
      return res.status(404).json({ error: "Picker not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        assignedPickups: pickerData.assignedPickups,
        assignedDeliveries: pickerData.assignedDeliveries,
        creditPoints: pickerData.creditPoints
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 6. Get pickup request details
exports.getPickupDetails = async (req, res) => {
  const { pickupId } = req.params;

  try {
    const pickup = await PickupRequest.findById(pickupId)
      .populate('userId', 'firstName lastName contactNumber address')
      .populate('pickupBy', 'firstName lastName contactNumber');

    if (!pickup) {
      return res.status(404).json({ error: "Pickup request not found" });
    }

    res.status(200).json({
      success: true,
      data: pickup
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};