const { Firestore } = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');

// Initialize Firestore
const firestore = new Firestore();

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

    // Validate input
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    // Generate unique ID and timestamp
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Prepare document for Firestore
    const contactData = {
      id,
      name,
      email,
      message,
      created_at: timestamp
    };

    // Save to Firestore
    await firestore.collection('contacts').doc(id).set(contactData);

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