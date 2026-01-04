const { sendOTP } = require('../utils/sendOTP');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP
    const otpResult = await sendOTP(email, otp);
    
    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: otpResult.message || 'Failed to send OTP'
      });
    }
    
    // Create user (temporarily without verification)
    const user = new User({
      name,
      email,
      phone,
      password, // Make sure to hash this!
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'OTP sent to email.'
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

