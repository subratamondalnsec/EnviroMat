const PickupRequest = require('../models/PickupRequestModel');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Picker =require("../models/Picker");
const{findNearestPicker}=require("../utils/fatchusingAI");
const calculateCredits=require('../utils/calculateCreditPoint.js')
const User =require('../models/User.js');
const sendWastePickupSMS=require('../utils/smsSender.js')

exports.uploadWaste = async (req, res) => {
  try {
    const { wasteType, quantity, address, lat, lng, userQuantity, isEmergency = false } = req.body;
    
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // Parse address if it's a string
    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      console.log("Address parsing error:", e);
      parsedAddress = address;
    }
    console.log("Parsed address:", parsedAddress);

    // If using file upload, uncomment and integrate
    const file = req.files?.image;
    const result = file ? await uploadImageToCloudinary(file, process.env.CLOUDINARY_FOLDER) : null;
    console.log("Cloudinary upload result:", result);
    
    // Prepare waste data
    const wasteData = {
      userId: req.user.id,
      wasteType,
      imageURL: result?.secure_url, // Fixed: use result from cloudinary upload
      userQuantity: userQuantity || quantity, // Use userQuantity if available, fallback to quantity
      location: { 
        lat: parseFloat(lat), 
        lng: parseFloat(lng) 
      },
      address: parsedAddress,
      isEmergency: isEmergency === 'true' || isEmergency === true // Handle string boolean
    };
    
    console.log("Waste data to save:", wasteData);
    
    // Create the PickupRequest object
    const waste = new PickupRequest(wasteData);
    
    // Validate before saving
    try {
      await waste.validate();
      console.log("Validation successful");
    } catch (validationError) {
      console.log("Validation error:", validationError);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validationError.message,
        fields: Object.keys(validationError.errors || {})
      });
    }

    // Save the waste request to database
    await waste.save();
    console.log("Waste request saved to database:", waste._id);

    console.log("New waste request data:", waste);
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

    const msg_data = await sendWastePickupSMS(
      nearestPicker.contactNumber, 
      waste._id, 
      wasteType, 
      quantity, 
      address, 
      req.user.name
    );

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
    if (request.pickupStatus === "completed"  || request.pickupStatus === "in_progress") {
      return res.status(400).json({ error: "Completed / In Progress pickups cannot be cancelled." });
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


exports.startPickup = async (req, res) => {
  try {
    const { requestId } = req.body;
    const pickerId = req.user.id; // picker logged in

    const request = await PickupRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.pickupBy.toString() !== pickerId.toString()) {
      return res.status(403).json({ error: "Not assigned to this picker" });
    }

    if (request.pickupStatus !== "assigned") {
      return res.status(400).json({ error: "Pickup cannot be started now" });
    }

    request.pickupStatus = "in_progress";
    await request.save();

    res.json({ message: "Pickup started", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.completePickup = async (req, res) => {
  try {
    const { requestId, verifiedQuantity, qualityRating } = req.body;
    const pickerId = req.user.id;

    // 1️⃣ Find the request
    const request = await PickupRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Pickup request not found" });
    }

    // 2️⃣ Ensure the request belongs to the picker
    if (request.pickupBy.toString() !== pickerId.toString()) {
      return res.status(403).json({ error: "Not authorized to complete this request" });
    }

    // 3️⃣ Ensure pickup is in progress
    if (request.pickupStatus !== "in_progress") {
      return res.status(400).json({ error: "Pickup is not in progress or already completed" });
    }

    // 4️⃣ Update request as completed
    request.pickupStatus = "completed";
    request.verifiedQuantity = verifiedQuantity;
    request.qualityRating = qualityRating;
    request.pickupDate = new Date();

    // Calculate earned points
    const earnedPoints = calculateCredits(request.wasteType, verifiedQuantity, qualityRating);
    request.creditPoints = earnedPoints; // save in request

    await request.save();

    // 5️⃣ Update user credits
    await User.findByIdAndUpdate(request.userId, {
      $inc: { creditPoints: earnedPoints },
    });

    // 6️⃣ Update picker credits (fixed + bonus)
    const pickerPoints = 10 + Math.floor(verifiedQuantity / 5);
    await Picker.findByIdAndUpdate(pickerId, {
      $inc: { creditPoints: pickerPoints },
    });

    res.status(200).json({
      message: "Pickup completed successfully",
      userPoints: earnedPoints,
      pickerPoints,
      request,
    });
  } catch (err) {
    console.error("Error completing pickup:", err);
    res.status(500).json({ error: "Server error" });
  }
};
