// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
  logout,
} = require("../controllers/Auth")


const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/UserProfile")

const { auth } = require("../middleware/auth")


// Define the routes for user authentication
router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendotp)
router.post("/changepassword", auth, changePassword)
router.post("/logout", logout)
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// ********************************************************************************************************
//                                      Profile routes (TODO: Implement controllers)
// ********************************************************************************************************

// Route for getting user profile
router.get("/profile/:id", auth, getUserProfile)

// Route for updating user profile
router.put("/profile/:id", auth, updateUserProfile)

// Export the router for use in the main application
module.exports = router