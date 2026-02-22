const { Firestore } = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// Initialize Firestore
const firestore = new Firestore();

// Email configuration - Zoho SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email notification for new lead
 */
async function sendEmailNotification(leadData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mudit@migracle.com',
    subject: `New Subscriber: ${leadData.email}`,
    html: `
      <h2>New Subscriber from Migracle Website</h2>
      <p><strong>Source:</strong> ${leadData.source}</p>
      <p><strong>Email:</strong> ${leadData.email}</p>
      <p><strong>Timestamp:</strong> ${leadData.created_at}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * HTTP Cloud Function to handle subscription form submissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.subscribeHandler = async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'CORS preflight request successful' });
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Generate unique ID and timestamp
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Prepare document for Firestore
    const leadData = {
      id,
      email,
      source: 'subscription_form',
      created_at: timestamp
    };

    // Save to Firestore leads collection
    await firestore.collection('leads').doc(id).set(leadData);

    // Return success response immediately
    res.status(200).json({
      message: 'Subscription successful',
      email
    });

    // Send email notification asynchronously (don't await)
    sendEmailNotification(leadData).catch(err => {
      console.error('Error sending async email notification:', err);
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
