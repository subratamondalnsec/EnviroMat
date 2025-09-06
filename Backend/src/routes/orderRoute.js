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

// Get all orders for a user
router.get("/get-all-orders/user/:userId",getAllOrdersByUser)

// Get all addToCards for a user
router.post("/get-all-addtocards/user",getAllAddToCardsByUser)

// Add to cart
router.post("/add-to-card",addToCard)

// Cancel order request
router.post('/cancel-order',cancelRequestOfOrder)

// Cancel from add to card
router.post('/cancel-from-addtocard',cancelFromAddToCard)

// get all items listed items to show in shop
router.get("/get-items",getAllItems);

module.exports = router;
