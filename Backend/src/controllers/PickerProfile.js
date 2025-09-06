const Picker = require("../models/Picker");
const PickupRequest = require("../models/PickupRequestModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get picker profile
exports.getPickerProfile = async (req, res) => {
  try {
    const pickerId = req.params.id;
    
    // Find picker by ID
    const picker = await Picker.findById(pickerId).select("-password");
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Picker profile fetched successfully",
      picker: picker,
    });
  } catch (error) {
    console.error("GET_PICKER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update picker profile
exports.updatePickerProfile = async (req, res) => {
  try {
    const pickerId = req.params.id;
    const { 
      firstName, 
      lastName, 
      email, 
      contactNumber, 
      address,
      vehicleDetails,
      serviceAreas,
      isActive 
    } = req.body;

    // Find picker by ID
    const picker = await Picker.findById(pickerId);
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }
    console.log("PICKER_TO_UPDATE:", picker);
    // Update picker fields
    if (firstName !== undefined) picker.firstName = firstName;
    if (lastName !== undefined) picker.lastName = lastName;
    if (email !== undefined) picker.email = email;
    if (contactNumber !== undefined) picker.contactNumber = contactNumber;
    if (address !== undefined) picker.address = address;
    if (vehicleDetails !== undefined) picker.vehicleDetails = vehicleDetails;
    if (serviceAreas !== undefined) picker.serviceAreas = serviceAreas;
    if (isActive !== undefined) picker.isActive = isActive;

    // Handle image upload if provided
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage;
      
      try {
        const uploadedImage = await uploadImageToCloudinary(
          image,
          process.env.FOLDER_NAME,
          1000,
          90
        );
        picker.image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("IMAGE_UPLOAD_ERROR:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
        });
      }
    }

    // Save updated picker
    const updatedPicker = await picker.save();
    
    // Remove password from response
    updatedPicker.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Picker profile updated successfully",
      picker: updatedPicker,
    });
  } catch (error) {
    console.error("UPDATE_PICKER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get assigned pickups for picker
exports.getAssignedPickups = async (req, res) => {
  try {
    const pickerId = req.params.id;
    
    // Find picker and populate assigned pickups
    const picker = await Picker.findById(pickerId)
      .populate({
        path: 'assignedPickups',
        populate: {
          path: 'userId',
          select: 'firstName lastName email contactNumber'
        }
      });
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned pickups fetched successfully",
      pickups: picker.assignedPickups,
    });
  } catch (error) {
    console.error("GET_ASSIGNED_PICKUPS_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get emergency pickups for picker
exports.getEmergencyPickups = async (req, res) => {
  try {
    const pickerId = req.params.id;
    
    // Find picker and populate emergency pickups
    const picker = await Picker.findById(pickerId)
      .populate({
        path: 'emergencyPickups',
        populate: {
          path: 'userId',
          select: 'firstName lastName email contactNumber'
        }
      });
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency pickups fetched successfully",
      pickups: picker.emergencyPickups,
    });
  } catch (error) {
    console.error("GET_EMERGENCY_PICKUPS_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get dashboard statistics for picker
exports.getDashboardStats = async (req, res) => {
  try {
    const pickerId = req.params.id;
    
    // Find picker
    const picker = await Picker.findById(pickerId);
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }

    // Get counts
    const totalAssignedPickups = picker.assignedPickups.length;
    const totalEmergencyPickups = picker.emergencyPickups.length;
    const totalPickups = totalAssignedPickups + totalEmergencyPickups;

    // Get completed pickups count
    const completedPickups = await PickupRequest.countDocuments({
      pickupBy: pickerId,
      pickupStatus: "delivered"
    });

    // Get pending pickups count
    const pendingPickups = await PickupRequest.countDocuments({
      pickupBy: pickerId,
      pickupStatus: { $in: ["processing", "assigned"] }
    });

    // Get recent pickups for monthly data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPickups = await PickupRequest.find({
      pickupBy: pickerId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Generate monthly data
    const monthlyData = generateMonthlyData(recentPickups);

    const stats = {
      totalPickups,
      completedPickups,
      pendingPickups,
      totalEarnings: picker.creditPoints || 0,
      monthlyData
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      stats,
    });
  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper function to generate monthly data
function generateMonthlyData(pickups) {
  const days = [];
  const pickupCounts = [];
  const wasteTypeCounts = {
    plastic: 0,
    paper: 0,
    metal: 0,
    organic: 0,
    others: 0
  };

  // Generate last 8 days data
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    days.push(dayStr);

    // Count pickups for this day
    const dayPickups = pickups.filter(pickup => {
      const pickupDate = new Date(pickup.date);
      return pickupDate.toDateString() === date.toDateString();
    });

    pickupCounts.push(dayPickups.length);
  }

  // Count waste types
  pickups.forEach(pickup => {
    const wasteType = pickup.wasteType;
    if (wasteTypeCounts.hasOwnProperty(wasteType)) {
      wasteTypeCounts[wasteType]++;
    } else {
      wasteTypeCounts.others++;
    }
  });

  return {
    days,
    pickups: pickupCounts,
    wasteTypes: [
      wasteTypeCounts.plastic,
      wasteTypeCounts.paper,
      wasteTypeCounts.metal,
      wasteTypeCounts.organic + wasteTypeCounts.others
    ]
  };
}
