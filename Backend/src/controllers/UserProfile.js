const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user by ID
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error("GET_USER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { 
      firstName, 
      lastName, 
      email, 
      contactNumber, 
      address 
    } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;

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
        user.image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("IMAGE_UPLOAD_ERROR:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
        });
      }
    }

    // Save updated user
    const updatedUser = await user.save();
    
    // Remove password from response
    updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE_USER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
