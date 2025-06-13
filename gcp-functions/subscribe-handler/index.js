const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore
const firestore = new Firestore();

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

    // Check if email already exists
    const existingDoc = await firestore.collection('subscribers').doc(email).get();
    
    if (existingDoc.exists) {
      res.status(400).json({ error: 'Email already subscribed' });
      return;
    }

    const timestamp = new Date().toISOString();

    // Prepare document for Firestore
    const subscriberData = {
      email,
      created_at: timestamp
    };

    // Save to Firestore
    await firestore.collection('subscribers').doc(email).set(subscriberData);

    // Return success response
    res.status(200).json({
      message: 'Subscription successful',
      email
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};