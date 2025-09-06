const express = require('express');
const router = express.Router();
const{uploadWaste,cancelPickupRequest,startPickup,completePickup}=require('../controllers/PickupRequestController');
const { auth, isPicker } = require("../middleware/auth")


// POST /api/waste/upload -> for uploading Waste
router.post( '/upload', auth,uploadWaste );

router.post('/cancel-pickup-request',auth,cancelPickupRequest);

router.post('/in_progress-pickup',auth,isPicker,startPickup);

router.post('/complete-pickup',auth,isPicker,completePickup)

module.exports = router;