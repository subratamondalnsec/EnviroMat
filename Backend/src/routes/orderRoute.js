// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const User = require("../models/User");
const { createOrder, requestOrder,getAllItems, addToCard,cancelFromAddToCard, cancelRequestOfOrder,createmultiplkeOrder, getAllOrdersByUser, getAllAddToCardsByUser } = require("../controllers/OrderController");
const { auth } = require("../middleware/auth");

// Create new order (requires authentication)
router.post("/create", auth, createOrder);

// Request an order (requires authentication)
router.post("/request-order", auth, requestOrder);

// Get all orders for a user (requires authentication)
router.get("/get-all-orders/user/:userId", auth, getAllOrdersByUser)

// Get all addToCards for a user (requires authentication)
router.post("/get-all-addtocards/user", auth, getAllAddToCardsByUser)

// Add to cart (requires authentication)
router.post("/add-to-card", auth, addToCard)

// Cancel order request (requires authentication)
router.post('/cancel-order', auth, cancelRequestOfOrder)

// Cancel from add to card (requires authentication)
router.post('/cancel-from-addtocard', auth, cancelFromAddToCard)

// get all items listed items to show in shop (public route)
router.get("/get-items",getAllItems);

module.exports = router;
