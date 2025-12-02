const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Always require email configuration for real verification
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD ||
      process.env.EMAIL_USER === "your-real-email@gmail.com" ||
      process.env.EMAIL_PASSWORD === "your-gmail-app-password"
    ) {
      throw new Error(
        "Email credentials must be configured in .env file. Please set EMAIL_USER and EMAIL_PASSWORD with your real Gmail credentials."
      );
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to, verificationToken, username) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Verify Your Email - Questify",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9c27b0, #673ab7); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #F9C80E; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 14px; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 Questify</div>
              <div class="tagline">YOUR GOALS. YOUR GAME</div>
            </div>
            <div class="content">
              <h2>Welcome to Questify, ${username}!</h2>
              <p>Thank you for signing up! To complete your registration and start your productivity journey, please verify your email address.</p>
              
              <p>Click the button below to verify your email:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with Questify, please ignore this email.</p>
              
              <p>Best regards,<br>The Questify Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${to}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Questify, ${username}!
        
        Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This verification link will expire in 24 hours.
        
        If you didn't create an account with Questify, please ignore this email.
        
        Best regards,
        The Questify Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully to:", to);
      return { success: true };
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendWelcomeEmail(to, username) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Welcome to Questify! 🎯",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9c27b0, #673ab7); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #F9C80E; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 14px; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 Questify</div>
              <div class="tagline">YOUR GOALS. YOUR GAME</div>
            </div>
            <div class="content">
              <h2>Welcome to Questify, ${username}! 🎉</h2>
              <p>Your email has been successfully verified and your account is now active!</p>
              
              <p>You're all set to start your productivity journey with Questify. Here's what you can do:</p>
              
              <ul>
                <li>📝 Create and manage your tasks</li>
                <li>🍅 Use Pomodoro sessions for focused work</li>
                <li>🎯 Track your progress and achievements</li>
                <li>🏆 Gamify your productivity</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
              </div>
              
              <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
              
              <p>Happy questing!<br>The Questify Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully to:", to);
      return { success: true };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error here as it's not critical
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(to, resetToken, username) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Password Reset Request - Questify",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9c27b0, #673ab7); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #F9C80E; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 14px; opacity: 0.9; }
            .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 Questify</div>
              <div class="tagline">YOUR GOALS. YOUR GAME</div>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${username},</p>
              
              <p>We received a request to reset your password for your Questify account. If you didn't make this request, you can safely ignore this email.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This reset link will expire in 10 minutes for security reasons</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Best regards,<br>The Questify Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${to}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Questify
        
        Hello ${username},
        
        We received a request to reset your password for your Questify account. If you didn't make this request, you can safely ignore this email.
        
        To reset your password, click the link below:
        ${resetUrl}
        
        IMPORTANT:
        - This reset link will expire in 10 minutes for security reasons
        - If you didn't request this reset, please ignore this email
        - Never share this link with anyone
        
        If you continue to have problems, please contact our support team.
        
        Best regards,
        The Questify Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Password reset email sent successfully to:", to);
      return { success: true };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  async sendPasswordResetConfirmationEmail(to, username) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Password Reset Successful - Questify",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9c27b0, #673ab7); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #F9C80E; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 14px; opacity: 0.9; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 Questify</div>
              <div class="tagline">YOUR GOALS. YOUR GAME</div>
            </div>
            <div class="content">
              <h2>Password Reset Successful! ✅</h2>
              <p>Hello ${username},</p>
              
              <div class="success">
                <strong>🎉 Great news!</strong> Your password has been successfully reset.
              </div>
              
              <p>You can now log in to your Questify account using your new password.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Questify</a>
              </div>
              
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Make sure your password is strong and unique</li>
                <li>Don't share your password with anyone</li>
                <li>Consider using a password manager</li>
                <li>If you notice any suspicious activity, contact us immediately</li>
              </ul>
              
              <p>If you didn't make this change or have any concerns about your account security, please contact our support team immediately.</p>
              
              <p>Happy questing!<br>The Questify Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Successful - Questify
        
        Hello ${username},
        
        Great news! Your password has been successfully reset.
        
        You can now log in to your Questify account using your new password.
        
        Login here: ${process.env.FRONTEND_URL}/login
        
        Security Tips:
        - Make sure your password is strong and unique
        - Don't share your password with anyone
        - Consider using a password manager
        - If you notice any suspicious activity, contact us immediately
        
        If you didn't make this change or have any concerns about your account security, please contact our support team immediately.
        
        Happy questing!
        The Questify Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        "Password reset confirmation email sent successfully to:",
        to
      );
      return { success: true };
    } catch (error) {
      console.error("Error sending password reset confirmation email:", error);
      // Don't throw error here as it's not critical
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
