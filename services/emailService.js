const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

async function initialize() {
  try {
    // Create transporter
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      port: 465
    });

    // Verify connection
    await transporter.verify();
    console.log('Email service initialized successfully');
    return true;
  } catch (error) {
    console.error('Email service initialization failed:', error.message);
    throw error;
  }
}

async function sendAdminNotification({ name, email, message }) {
  if (!transporter) {
    console.log('Email service not initialized. Skipping admin notification.');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 New Portfolio Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">
              📬 New Portfolio Contact Message
            </h2>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">👤 Contact Details:</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
            </div>
            
            <div style="background: #fff8f0; padding: 20px; border-radius: 8px; border-left: 4px solid #ffa726;">
              <h3 style="color: #f57c00; margin-top: 0;">💬 Message:</h3>
              <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                📅 Received on ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification:', error.message);
    throw error;
  }
}

async function sendThankYouEmail(recipientEmail, recipientName) {
  if (!transporter) {
    console.log('Email service not initialized. Skipping thank you email.');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `✨ Thank you for reaching out, ${recipientName}!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); border-radius: 15px;">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3436; margin: 0; font-size: 28px; font-weight: 300;">
                ✨ Thank You, ${recipientName}!
              </h1>
            </div>
            
            <div style="background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <p style="color: white; font-size: 18px; margin: 0; font-weight: 500;">
                🎯 Your message has been received successfully!
              </p>
            </div>
            
            <div style="padding: 20px 0;">
              <p style="color: #636e72; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
                I appreciate you taking the time to reach out through my portfolio. Your message is important to me, and I'm excited to connect with you.
              </p>
              
              <div style="background: #f1f2f6; padding: 20px; border-radius: 8px; border-left: 4px solid #74b9ff; margin: 20px 0;">
                <h3 style="color: #2d3436; margin-top: 0; margin-bottom: 15px;">📋 What happens next?</h3>
                <ul style="color: #636e72; line-height: 1.6; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">📖 I'll carefully review your message</li>
                  <li style="margin-bottom: 8px;">⚡ You can expect a personal response within 24-48 hours</li>
                  <li style="margin-bottom: 8px;">🤝 If it's project-related, I'll include relevant details and next steps</li>
                </ul>
              </div>
              
              <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <p style="color: white; margin: 0; font-size: 16px;">
                  <strong>🚀 In the meantime, feel free to explore my other projects and connect with me on social media!</strong>
                </p>
              </div>
              
              <p style="color: #636e72; line-height: 1.6; font-size: 16px;">
                Thank you for your interest in my work. I'm looking forward to our conversation!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 2px solid #ddd;">
              <p style="color: #74b9ff; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
              <p style="color: #2d3436; font-size: 18px; font-weight: 500; margin: 0;">Anita</p>
              <p style="color: #636e72; font-size: 14px; margin-top: 10px;">
                Software Developer | Portfolio Website
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #b2bec3; font-size: 12px; margin: 0;">
                📧 This is an automated response. Please don't reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Thank you email sent successfully to:', recipientEmail);
  } catch (error) {
    console.error('Failed to send thank you email:', error.message);
    throw error;
  }
}

module.exports = {
  initialize,
  sendAdminNotification,
  sendThankYouEmail
};
