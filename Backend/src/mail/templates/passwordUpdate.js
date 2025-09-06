exports.passwordUpdated = (email, name) => {
	return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Password Update Confirmation - Enviromat</title>
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

        .security-badge {
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

        .success-container {
            background: linear-gradient(135deg, #f8fff8 0%, #f0f9f0 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 3px 10px rgba(106, 179, 148, 0.1);
            border-left: 5px solid #28a745;
            position: relative;
            overflow: hidden;
        }

        .success-container::before {
            content: '✅';
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 20px;
            opacity: 0.3;
        }

        .success-message {
            font-size: 18px;
            font-weight: 600;
            color: #28a745;
            margin-bottom: 10px;
        }

        .warning-box {
            background: linear-gradient(90deg, transparent 0%, rgba(244, 208, 63, 0.1) 50%, transparent 100%);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #f39c12;
            text-align: left;
            font-size: 14px;
            color: #2c5f41;
            position: relative;
        }

        .warning-box::before {
            content: '⚠️ ';
            font-size: 16px;
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

        .highlight {
            font-weight: 600;
            color: #2c5f41;
            background: linear-gradient(120deg, transparent 0%, rgba(106, 179, 148, 0.1) 0%, rgba(106, 179, 148, 0.1) 100%, transparent 100%);
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
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
            right: 15px;
            font-size: 12px;
            opacity: 0.3;
            z-index: 0;
        }

        .security-tip {
            background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #d4edda;
            font-size: 14px;
            color: #2c5f41;
            text-align: left;
        }

        .security-tip::before {
            content: '💡 ';
            font-size: 16px;
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
        
        <div class="security-badge">🔐 Security Update</div>
        <div class="message">🌱 Password Update Confirmation</div>
        
        <div class="success-container">
            <div class="success-message">Password Successfully Updated!</div>
            <p>Your account is now more secure</p>
        </div>
        
        <div class="body">
            <p>Hey ${name},</p>
            <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.
            </p>
            
            <div class="warning-box">
                If you did not request this password change, please contact us immediately to secure your account.
            </div>
            
            <div class="security-tip">
                <strong>Security Tip:</strong> Keep your account safe by using a strong, unique password and enabling two-factor authentication when available.
            </div>
        </div>
        
        <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
            at
            <a href="mailto:info@enviromat.com">info@enviromat.com</a>. We are here to help keep your <span class="eco-accent">sustainable journey</span> secure!
        </div>
    </div>
</body>

</html>
`;
};
