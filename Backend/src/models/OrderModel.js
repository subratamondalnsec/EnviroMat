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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      enum: [
        "Recycled Plastic Products",
        "Recycled Paper Products",
        "Recycled Glass Products",
        "Recycled Metal Products",
        "Recycled Textile & Fabric Products",
        "Recycled Wood Products",
        "Recycled Rubber Products",
        "E-Waste Recycled Products",
        "Organic Waste Recycled Products",
        "Mixed Recycled Products"
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
      required: true,
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
