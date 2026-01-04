const express = require('express');
const router = express.Router();

console.log('=== Debugging authRoutes ===');

// Try to import
try {
  const authController = require('../controllers/authController');
  console.log('✅ Controller imported successfully');
  console.log('Controller keys:', Object.keys(authController));
  console.log('Type of signup:', typeof authController.signup);
  
  if (typeof authController.signup === 'function') {
    console.log('✅ signup is a function - OK to use');
    router.post('/signup', authController.signup);
  } else {
    console.log('❌ signup is NOT a function');
    console.log('It is:', authController.signup);
  }
  
} catch (error) {
  console.log('❌ Error importing controller:', error.message);
}

module.exports = router;