const nodemailer = require('nodemailer');
const { getConnection } = require('../lib/database');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;

      // Save message to database (PlanetScale)
      try {
        const db = await getConnection();
        await db.execute(
          'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
          [name, email, subject, message]
        );
        console.log('✅ Message saved to database');
      } catch (dbError) {
        console.error('⚠️ Database save failed:', dbError.message);
        // Continue with email sending even if database fails
      }

      // Create transporter
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Send email to admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });

      // Send thank you email to sender
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting me!',
        html: `
          <h2>Thank You for Your Message!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Anita Boke</p>
        `
      });

      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email sending failed:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}