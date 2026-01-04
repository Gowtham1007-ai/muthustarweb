const nodemailer = require('nodemailer');

// Store OTP send attempts to prevent abuse
const otpAttempts = new Map();

module.exports = {
  sendOTP: async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'MuthuStar Graphics - Your OTP Code',
        text: `
✨ Welcome 💐 to 🎉 MUTHU STAR Graphics 🎊

Your OTP is: ${otp}

Thank you 🙏 for joining with us ❤️

---
MUTHU STAR Graphics
Beyond Imagination
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #4A5BA6 0%, #5a6fc0 100%); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
              <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                ✨ MUTHU STAR Graphics ✨
              </h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; font-style: italic;">Beyond Imagination</p>
            </div>
            
            <div style="background: white; padding: 40px; text-align: center; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #4A5BA6; margin-bottom: 20px;">
                💐 Welcome to MUTHU STAR Graphics! 🎉
              </h2>
              
              <p style="font-size: 16px; color: #666; margin-bottom: 30px;">
                Your One-Time Password (OTP) for verification is:
              </p>
              
              <div style="background: linear-gradient(135deg, #EC4899 0%, #DC2626 100%); color: white; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);">
                ${otp}
              </div>
              
              <p style="font-size: 14px; color: #999; margin-top: 20px;">
                This OTP will expire in 10 minutes
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 16px; color: #4A5BA6; font-weight: bold;">
                🙏 Thank you for joining with us! ❤️
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you didn't request this OTP, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} MUTHU STAR Graphics. All rights reserved.</p>
            </div>
          </div>
        `
      });
      
      console.log(`✅ OTP sent to ${email}`);
      return { success: true, message: 'OTP sent successfully' };
      
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return { 
        success: false, 
        message: 'Failed to send OTP email' 
      };
    }
  },

  // Check if user can resend OTP (rate limiting)
  canResendOTP: (email) => {
    const now = Date.now();
    const userAttempts = otpAttempts.get(email) || [];
    
    // Remove attempts older than 1 hour
    const recentAttempts = userAttempts.filter(time => now - time < 60 * 60 * 1000);
    
    // Max 5 attempts per hour
    if (recentAttempts.length >= 5) {
      return {
        canResend: false,
        message: 'Too many attempts. Please try again later.',
        nextAttempt: new Date(recentAttempts[0] + 60 * 60 * 1000).toLocaleTimeString()
      };
    }
    
    // Minimum 60 seconds between resends
    if (recentAttempts.length > 0) {
      const lastAttempt = recentAttempts[recentAttempts.length - 1];
      const timeSinceLastAttempt = now - lastAttempt;
      
      if (timeSinceLastAttempt < 60 * 1000) { // 60 seconds
        const waitTime = Math.ceil((60 * 1000 - timeSinceLastAttempt) / 1000);
        return {
          canResend: false,
          message: `Please wait ${waitTime} seconds before requesting new OTP`,
          waitSeconds: waitTime
        };
      }
    }
    
    // Track this attempt
    recentAttempts.push(now);
    otpAttempts.set(email, recentAttempts);
    
    return {
      canResend: true,
      message: 'OTP can be resent',
      attemptsRemaining: 5 - recentAttempts.length
    };
  },

  // Clear attempts for testing/reset
  clearAttempts: (email) => {
    otpAttempts.delete(email);
  }
};