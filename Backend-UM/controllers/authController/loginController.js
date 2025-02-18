const { body, validationResult } = require('express-validator');
const { loginService } = require("../../services/authService/loginService");

// Login Controller with Validation
const login = [
  // Validation middleware
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),

  // The main controller logic
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send only the first error message
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password, deviceId, userAgent, ipAddress } = req.body;
    console.log(ipAddress);

    try {
      // Call the service to handle the login logic
      const { accessToken, refreshToken, device,roleName } = await loginService(email, password, deviceId, userAgent, ipAddress);

      // Send the tokens and device info to the client
      console.log("Entered>>>>>>>>>>>>>>",roleName)
      res.status(200).json({ accessToken, refreshToken, device,roleName });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
];

module.exports = { login };
