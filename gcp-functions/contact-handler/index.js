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
    subject: `New Lead: ${leadData.name || 'Subscriber'} - ${leadData.source}`,
    html: `
      <h2>New Lead from Migracle Website</h2>
      <p><strong>Source:</strong> ${leadData.source}</p>
      <p><strong>Email:</strong> ${leadData.email}</p>
      ${leadData.name ? `<p><strong>Name:</strong> ${leadData.name}</p>` : ''}
      ${leadData.message ? `<p><strong>Message:</strong> ${leadData.message}</p>` : ''}
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
 * HTTP Cloud Function to handle contact form submissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.contactHandler = async (req, res) => {
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
    const { name, email, message } = req.body;

    // Validate input - name and email required, message optional
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    // Generate unique ID and timestamp
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Prepare document for Firestore
    const leadData = {
      id,
      name,
      email,
      source: 'contact_form',
      created_at: timestamp
    };

    // Add message only if provided
    if (message) {
      leadData.message = message;
    }

    // Save to Firestore leads collection
    await firestore.collection('leads').doc(id).set(leadData);

    // Send email notification
    await sendEmailNotification(leadData);

    // Return success response
    res.status(200).json({
      message: 'Contact form submitted successfully',
      id
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
