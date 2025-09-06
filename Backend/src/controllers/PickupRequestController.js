const PickupRequest = require('../models/PickupRequestModel');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Picker =require("../models/Picker");
const{findNearestPicker}=require("../utils/fatchusingAI");
const User =require('../models/User.js');

exports.uploadWaste = async (req, res) => {
  try {
    const { wasteType, quantity, address, lat, lng, image,creditPoints, isEmergency = false } = req.body;

    // If using file upload, uncomment and integrate
    // const file = req.files?.image;
    // const result = file ? await uploadImageToCloudinary(file, process.env.CLOUDINARY_FOLDER) : null;

    const waste = new PickupRequest({
      userId: req.user.id,
      wasteType,
      imageURL: image, // or result?.secure_url
      quantity,
      location: { lat, lng },
      address,
      creditPoints,
      isEmergency // Add isEmergency field
    });

    // 1️⃣ Get up to 10 pickers based on city or state
    let pickers = await Picker.find({ "address.city": address.city }).limit(10);

    if (pickers.length === 0) {
      pickers = await Picker.find({ "address.state": address.state }).limit(10);
    }

    // No pickers found at all → just save request
    if (pickers.length === 0) {
      await waste.save();
      console.log("No pickers found. Request saved without assignment.");
      return res.status(201).json({ pickerAssign: false, message: "Waste uploaded successfully.", waste });
    }

    console.log("Pickers found:", pickers.map(p => ({
      id: p._id,
      name: `${p.firstName} ${p.lastName}`,
      city: p.address.city,
      state: p.address.state
    })));

     // 2️⃣ Find nearest picker using Gemini
    const nearestPicker = await findNearestPicker(pickers, {
      lat,
      lng,
      address
    });
    console.log(" nearest picker - ",nearestPicker)

    // If Gemini couldn't decide → save without assigning
    if (!nearestPicker) {
      await waste.save();
      console.log("Gemini couldn't determine nearest picker. Request saved without assignment.");
      return res.status(201).json({ 
        pickerAssign: false, 
        message: "Waste uploaded successfully.", 
        waste,
        debug: {
          pickersFound: pickers.length,
          aiResponse: "AI returned null"
        }
      });
    }

    // 3️⃣ Assign the nearest picker
    waste.pickupBy = nearestPicker._id;
    waste.pickupStatus = "assigned";

    const saveWaste = await waste.save();

    // Update picker based on pickup type (emergency or regular)
    const updateField = isEmergency ? 'emergencyPickups' : 'assignedPickups';
    
    await Picker.findByIdAndUpdate(
      nearestPicker._id,
      { $push: { [updateField]: saveWaste._id } },
      { new: true }
    );

    console.log(saveWaste);

    res.status(201).json({
      pickerAssign: true,
      message: `Waste uploaded successfully. Picker assigned for ${isEmergency ? 'emergency' : 'regular'} pickup.`,
      waste,
      nearestPicker
    });

  } catch (err) {
    console.log("Error in waste upload", err);
    res.status(500).json({ error: "Server error." });
  }
};


exports.cancelPickupRequest = async (req, res) => {
  try {
    const { requestId } = req.body; 
    const userId = req.user.id;       

    // 1️⃣ Find the pickup request
    const request = await PickupRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Pickup request not found." });
    }

    // 2️⃣ Ensure user owns the request
    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to cancel this request." });
    }

    // 3️⃣ Prevent duplicate or invalid cancel
    if (request.pickupStatus === "cancelled") {
      return res.status(400).json({ error: "Pickup request already cancelled." });
    }
    if (request.pickupStatus === "completed"  || request.pickupStatus === "processing") {
      return res.status(400).json({ error: "Completed / Processing pickups cannot be cancelled." });
    }

    // 4️⃣ Update request status
    request.pickupStatus = "cancelled";
    await request.save();

    // 5️⃣ Remove from picker's list if assigned
    if (request.pickupBy) {
      const updateField = request.isEmergency ? "emergencyPickups" : "assignedPickups";

      const picker = await Picker.findByIdAndUpdate(
        request.pickupBy,
        {
          $pull: { [updateField]: request._id },   // remove request from array
          $inc: { creditPoints: 5 }                // add 5 points to picker
        },
        { new: true }
      );
    }

    // 6️⃣ (Optional) Deduct penalty from user’s credit points if needed
    await User.findByIdAndUpdate(userId, { $inc: { creditPoints: -5 } });

    console.log(request);

    res.status(200).json({
      message: "Pickup request cancelled successfully. Penalty from user’s credit points -5",
      request,
      penaltyApplied: true,
      penaltyPoints: -5,
    });

  } catch (err) {
    console.error("Error cancelling pickup request", err);
    res.status(500).json({ error: "Server error." });
  }
};