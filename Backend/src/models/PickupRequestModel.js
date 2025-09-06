const mongoose = require('mongoose');

const PickupRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wasteType: {
        type: String,
        enum: [
            'plastic',
            'metal',
            'organic',
            'e_waste',
            'glass',
            'paper',
            'textile',
            'hazardous',
            'mixed',
            'others'
        ],
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
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
    pickupBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picker", // who picked up this waste
        default: null,
    },
    pickupStatus: {
        type: String,
        enum: ["processing", "assigned", "delivered", "cancelled"],
        default: "processing",
    },
    date: {
        type: Date,
        default: Date.now
    },
    isEmergency: {
        type: Boolean,
        default: false,
    },
    pickupDate:{
        type:Date,
    }
});

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);