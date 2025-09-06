const express = require('express');
const router = express.Router();
const{uploadWaste,cancelPickupRequest}=require('../controllers/PickupRequestController');
const { auth } = require("../middleware/auth")


// POST /api/waste/upload -> for uploading Waste
router.post( '/upload', auth, uploadWaste );

router.post('/cancel-pickup-request',auth,cancelPickupRequest);

module.exports = router;