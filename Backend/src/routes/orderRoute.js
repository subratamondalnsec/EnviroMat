// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const User = require("../models/User");
const { createOrder, requestOrder,getAllItems, addToCard,cancelFromAddToCard, cancelRequestOfOrder,createmultiplkeOrder, getAllOrdersByUser, getAllAddToCardsByUser } = require("../controllers/OrderController");

// Create new order
router.post("/create",createOrder);

// Request an order
router.post("/request-order",requestOrder);

// Get all orders for a user
router.get("/get-all-orders/user/:userId",getAllOrdersByUser)

// Get all addToCards for a user
router.get("/get-all-addtocards/user/:userId",getAllAddToCardsByUser)

// Add to cart
router.post("/add-to-card",addToCard)

// Cancel order request
router.post('/cancel-order',cancelRequestOfOrder)

// Cancel from add to card
router.post('/cancel-from-addtocard',cancelFromAddToCard)

// get all items listed items to show in shop
router.get("/get-items",getAllItems);

module.exports = router;
