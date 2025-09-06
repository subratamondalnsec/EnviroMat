// Import the Mongoose library
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
      minLength: 2,
      maxLength: 20,
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      minLength: 2,
      maxLength: 20,
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "User", "Picker"],
      default: "User",
      required: true,
    },
    creditPoint: {
      type: Number,
      min:100,
      default:500
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
    },
    pickupRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupRequest", // Waste pickups
      },
    ],
    orderRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Online store deliveries
      },
    ],
    sellingOrders: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    addToCards: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    blogs: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    
}, { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)