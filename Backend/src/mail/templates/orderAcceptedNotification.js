exports.orderAcceptedNotification = (
  firstname,
  lastname,
  productName,
  quantity,
  totalCost,
  orderAt
) => {
  const formattedDate = new Date(orderAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Order Confirmed - Enviromat</title>
<style>
    body {
        background: linear-gradient(135deg, #a8d5ba 0%, #7bc3a3 50%, #6ab394 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c5f41;
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }
    .container {
        max-width: 650px;
        margin: 40px auto;
        background: #fff;
        padding: 35px;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(44, 95, 65, 0.15);
        border-top: 6px solid #6ab394;
        position: relative;
        overflow: hidden;
    }
    .header {
        text-align: center;
        margin-bottom: 35px;
    }
    .title {
        font-size: 24px;
        font-weight: 600;
        color: #2c5f41;
        margin-bottom: 8px;
    }
    .subtitle {
        font-size: 14px;
        color: #6ab394;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .highlight {
        font-weight: 600;
        color: #2c5f41;
        background: rgba(106, 179, 148, 0.1);
        padding: 2px 8px;
        border-radius: 6px;
        display: inline-block;
    }
    .message-box {
        background: linear-gradient(135deg, #f8fff8 0%, #f0f9f0 100%);
        padding: 20px;
        border-left: 5px solid #6ab394;
        border-radius: 15px;
        margin: 20px 0;
        font-style: italic;
        white-space: pre-line;
        box-shadow: 0 3px 10px rgba(106, 179, 148, 0.1);
    }
    .footer {
        font-size: 14px;
        color: #7bc3a3;
        text-align: center;
        margin-top: 35px;
        border-top: 2px solid #e8f5e8;
        padding-top: 25px;
    }
    .eco-accent {
        font-weight: 600;
        background: linear-gradient(120deg, #6ab394, #7bc3a3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .badge {
        display: inline-block;
        background: linear-gradient(135deg, #6ab394, #7bc3a3);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 15px;
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="badge">📦 Order Confirmed</div>
        <div class="title">Your Order Has Been Confirmed!</div>
        <div class="subtitle">Thank you for shopping with Enviromat</div>
    </div>
    <div>
        <p>Dear <span class="highlight">${firstname} ${lastname}</span>,</p>
        <p>We’re happy to let you know that your purchase has been <strong>successfully processed</strong>.</p>
        <p><span class="highlight">Product:</span> ${productName}</p>
        <p><span class="highlight">Quantity:</span> ${quantity}</p>
        <p><span class="highlight">Total Cost (in credit points):</span> ${totalCost}</p>
        <p><span class="highlight">Order Date:</span> ${formattedDate}</p>
        <div class="message-box">
            Your order is now being prepared for shipment.  
            Thank you for contributing to a sustainable future!
        </div>
    </div>
    <div class="footer">
        This is an automated message from <span class="eco-accent">Enviromat</span>.  
        Please do not reply directly to this email.  
        <br><small>🌍 Together, we transform waste into valuable resources.</small>
    </div>
</div>
</body>
</html>`;
};
