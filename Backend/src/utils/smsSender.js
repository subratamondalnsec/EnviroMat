const twilio = require('twilio');
require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWastePickupSMS = async (to, pickupId, wasteType, quantity, address, customerName) => {
  try {
    const message = await twilioClient.messages.create({
      body: 
        `♻️ New Waste Pickup Request!
        Pickup ID: ${pickupId}
        Customer: ${customerName}
        Waste Type: ${wasteType}
        Quantity: ${quantity}
        Address: ${address}

        Reply 1 = Accept
        Reply 2 = Decline`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log('Waste Pickup SMS sent:', message.sid);
    return message.sid;
  } catch (err) {
    console.error('Error sending Waste Pickup SMS:', err);
    throw err;
  }
};


module.exports = sendWastePickupSMS;
