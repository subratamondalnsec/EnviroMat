const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  sendotp,
  changePassword,
  logout,
} = require("../controllers/PickerAuth")

const {
  getPickerProfile,
  updatePickerProfile,
  getAssignedPickups,
  getEmergencyPickups,
  getDashboardStats,
} = require("../controllers/PickerProfile")

const {
  doneDeliverOrPickup,
} = require("../controllers/PickupConroller")

const { auth } = require("../middleware/auth")

// Routes for Picker Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Picker route working!" })
})

// Route for picker login
router.post("/login", login)

// Route for picker signup
router.post("/signup", signup)

// Route for sending OTP to the picker's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// Route for picker logout
router.post("/logout", logout)

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Route for getting picker profile
router.get("/profile/:id", auth, getPickerProfile)

// Route for updating picker profile
router.put("/profile/:id", auth, updatePickerProfile)

// Route for getting assigned pickups
router.get("/assigned-pickups/:id", auth, getAssignedPickups)

// Route for getting emergency pickups
router.get("/emergency-pickups/:id", auth, getEmergencyPickups)

// Route for getting dashboard statistics
router.get("/dashboard-stats/:id", auth, getDashboardStats)

// Route for marking pickup/delivery as completed
router.post("/complete-task", auth, doneDeliverOrPickup)

module.exports = router
