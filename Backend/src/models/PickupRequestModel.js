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
    userQuantity: {   // ✅ Quantity entered by user
        type: Number,
        required: true
    },
    verifiedQuantity: {  // ✅ Quantity verified by picker
        type: Number,
        default: null
    },
    qualityRating: {   // ✅ Picker’s quality verification
        type: String,
        enum: ["low", "medium", "high"],
        default: null
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
    creditPoints:{
        type:Number,
        default:null
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
        enum: ["processing", "assigned", "in_progress", "completed", "cancelled"],
        default: "processing",
    },
    isEmergency: {
        type: Boolean,
        default: false,
    },
    pickupDate:{
        type:Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);
