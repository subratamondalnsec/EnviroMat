const express = require('express');
const router = express.Router();
const{uploadWaste}=require('../controllers/PickupRequestController');
const { auth } = require("../middleware/auth")


// POST /api/waste/upload -> for uploading Waste
router.post( '/upload', auth, uploadWaste );

module.exports = router;