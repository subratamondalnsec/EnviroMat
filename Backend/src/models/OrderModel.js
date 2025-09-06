const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerDetails: [
    {
      buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      address: { // fixed spelling
        type: String,
        required:true
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      deliveryStatus: {
        type: String,
        enum: [ "requested", "delivered"], // fixed enum
        default: "requested",
      },
      deliveredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picker",
        default: null,
      },
      deliveredAt: {
        type: Date,
      },
    },
  ],
  product: {
    title:{
      type:String,
      required:true,
      minlength: 5,
      maxlength: 20
    },
    description:{
      type:String,
      required:true,
      minlength: 25,
      maxlength: 50
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      enum: [
        "Plastic Products",
        "Paper Products",
        "Glass Products",
        "Metal Products",
        "Textile & Fabric Products",
        "Wood Products",
        "Rubber Products",
        "E-Waste Products",
        "Organic Waste Products",
        "Mixed Products"
      ],
      required: true,
    },
    price:{
      type: Number,
      required: true,
      min: 50
    },
    totalSold:{
      type: Number,
      default:0
    }
  },
  address: {
    type: String,
  },
  image: {
    type: String,
    required: true
  },
  orderedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Order", orderSchema);