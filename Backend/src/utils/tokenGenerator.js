const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
}

// Helper function for token generation, user object transformation, and cookie response
function handleAuthSuccess(user, res, message) {
    const token = generateToken(user);
    let userObj = user.toObject();
    userObj.password = undefined; // remove password from user object
    userObj.token = token; // add token to user object
    const Option = {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 days
    };
    return res.cookie("token", token, Option).status(200).json({
        success: true,
        token,
        user: userObj,
        message,
    });
}

module.exports = {
  generateToken,
  handleAuthSuccess,
};
