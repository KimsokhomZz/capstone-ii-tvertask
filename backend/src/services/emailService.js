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
}

module.exports = new EmailService();
