// Import the Mongoose library
const mongoose = require("mongoose");

const pickerSchema = new mongoose.Schema(
  {
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
      enum: ["Picker"],
      default: "Picker",
      required: true,
    },
    image: {
      type: String,
    },
    contactNumber: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
      pinCode: {
        type: String,
        trim: true,
        default: "",
      },
    },
    vehicleDetails: {
      vehicleType: {
        type: String,
        enum: ["Bicycle", "Motorcycle", "Car", "Van", "Truck"],
        default: "Bicycle",
      },
      vehicleNumber: {
        type: String,
        trim: true,
        uppercase: true,
        default: "",
      },
    },
    serviceAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedPickups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupRequest", // Waste pickups
      },
    ],
    emergencyPickups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupRequest", // Waste pickups
      },
    ],
    assignedDeliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Online store deliveries
      },
    ],
    timeSlots: [
      {
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    creditPoints: {
      type: Number,
      default: 0, // initial points
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
// Note: email index is automatically created by unique: true
pickerSchema.index({ serviceAreas: 1 });
pickerSchema.index({ isActive: 1 });

module.exports = mongoose.model("Picker", pickerSchema);