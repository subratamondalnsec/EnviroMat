const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>OTP Verification Email - Enviromat</title>
    <style>
        body {
            background: linear-gradient(135deg, #a8d5ba 0%, #7bc3a3 50%, #6ab394 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #2c5f41;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 35px;
            text-align: center;
            background: #fff;
            border-radius: 25px;
            box-shadow: 0 8px 25px rgba(44, 95, 65, 0.15);
            border-top: 6px solid #6ab394;
            position: relative;
            overflow: hidden;
        }

        .container::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 120px;
            height: 120px;
            background: linear-gradient(45deg, #f4d03f, #f39c12);
            border-radius: 50%;
            opacity: 0.1;
            z-index: 0;
        }

        .container::after {
            content: '';
            position: absolute;
            bottom: -30px;
            left: -30px;
            width: 80px;
            height: 80px;
            background: #7bc3a3;
            border-radius: 50%;
            opacity: 0.1;
            z-index: 0;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 25px;
            border-radius: 10px;
            position: relative;
            z-index: 1;
        }

        .verification-badge {
            display: inline-block;
            background: linear-gradient(135deg, #6ab394, #7bc3a3);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(106, 179, 148, 0.3);
        }

        .message {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 25px;
            color: #2c5f41;
            text-shadow: 0 2px 4px rgba(44, 95, 65, 0.1);
            position: relative;
            z-index: 1;
        }

        .body {
            font-size: 16px;
            margin-bottom: 25px;
            text-align: left;
            position: relative;
            z-index: 1;
        }

        .body p {
            margin: 15px 0;
            line-height: 1.7;
        }

        .otp-container {
            background: linear-gradient(135deg, #f8fff8 0%, #f0f9f0 100%);
            padding: 25px;
            border-radius: 20px;
            margin: 25px 0;
            text-align: center;
            box-shadow: 0 5px 15px rgba(106, 179, 148, 0.15);
            border: 2px solid #6ab394;
            position: relative;
            overflow: hidden;
        }

        .otp-container::before {
            content: '🔐';
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 20px;
            opacity: 0.3;
        }

        .otp-label {
            font-size: 14px;
            color: #6ab394;
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .highlight {
            font-weight: 700;
            color: #2c5f41;
            font-size: 32px;
            background: linear-gradient(135deg, #6ab394, #7bc3a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 3px;
            text-shadow: 0 2px 4px rgba(44, 95, 65, 0.1);
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }

        .validity-info {
            background: linear-gradient(90deg, transparent 0%, rgba(244, 208, 63, 0.1) 50%, transparent 100%);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #f4d03f;
            text-align: left;
            font-size: 14px;
            color: #2c5f41;
        }

        .validity-info::before {
            content: '⏰ ';
            font-size: 16px;
        }

        .cta {
            display: inline-block;
            padding: 12px 25px;
            background: linear-gradient(135deg, #f4d03f, #f39c12);
            color: #2c5f41;
            text-decoration: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            margin-top: 25px;
            box-shadow: 0 4px 15px rgba(244, 208, 63, 0.3);
            transition: transform 0.2s ease;
            position: relative;
            z-index: 1;
        }

        .cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(244, 208, 63, 0.4);
        }

        .support {
            font-size: 14px;
            color: #7bc3a3;
            margin-top: 30px;
            background: linear-gradient(90deg, transparent 0%, rgba(232, 245, 232, 0.5) 50%, transparent 100%);
            border-radius: 10px;
            padding: 20px;
            border-top: 2px solid #e8f5e8;
            position: relative;
            z-index: 1;
        }

        .support a {
            color: #2c5f41;
            font-weight: 600;
            text-decoration: none;
        }

        .support a:hover {
            text-decoration: underline;
        }

        .eco-accent {
            color: #2c5f41;
            font-weight: 600;
            background: linear-gradient(120deg, #6ab394, #7bc3a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nature-elements {
            position: absolute;
            bottom: 10px;
            left: 15px;
            font-size: 12px;
            opacity: 0.3;
            z-index: 0;
        }

        @media (max-width: 600px) {
            .container {
                padding: 25px;
                margin: 20px;
                border-radius: 20px;
            }
            .message {
                font-size: 22px;
            }
            .highlight {
                font-size: 28px;
                letter-spacing: 2px;
            }
            .container::before,
            .container::after {
                display: none;
            }
        }
    </style>

</head>

<body>
    <div class="container">
        <div class="nature-elements">🌿 🔐 🍃</div>
        
        <div class="verification-badge">🔐 Account Verification</div>
        <div class="message">🌱 OTP Verification Email</div>
        <div class="body">
            <p>Dear User,</p>
            <p>Thank you for registering with <span class="eco-accent">Enviromat</span>. To complete your registration, please use the following OTP
                (One-Time Password) to verify your account:</p>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="highlight">${otp}</div>
            </div>
            
            <div class="validity-info">
                This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
                Once your account is verified, you will have access to our platform and its features.
            </div>
        </div>
        <a href="#" class="cta">🌍 Complete Registration</a>
        <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                href="mailto:info@enviromat.com">info@enviromat.com</a>. We are here to help you join our <span class="eco-accent">sustainable community</span>!</div>
    </div>
</body>

</html>`;
};
module.exports = otpTemplate;
