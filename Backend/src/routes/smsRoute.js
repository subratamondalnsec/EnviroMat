const express = require('express');
const router = express.Router();
const axios = require("axios");
const sendWastePickupSMS=require('../utils/smsSender')


router.post('/check-sms-send', async (req, res) => {
  const { to, pickupId, wasteType, quantity, address, customerName } = req.body;
  try {
    const response=await sendWastePickupSMS(to, pickupId, wasteType, quantity, address, customerName);
    console.log(response);
    res.json({success:true});
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send SMS via sendWastePickupSMS', details: err.message });
  }
});


module.exports = router;
