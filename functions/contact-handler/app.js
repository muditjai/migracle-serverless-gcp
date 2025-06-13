const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const dynamoDBOptions = {
  region: process.env.REGION || 'us-west-2'
};

// Use local DynamoDB endpoint if specified
if (process.env.DYNAMODB_ENDPOINT) {
  dynamoDBOptions.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(dynamoDBOptions);

// Main Lambda handler
exports.handler = async (event) => {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight request successful' })
      };
    }

    // Parse request body
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, email, and message are required' })
      };
    }

    // Generate unique ID
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Prepare item for DynamoDB
    const item = {
      id,
      name,
      email,
      message,
      created_at: timestamp
    };

    // Save to DynamoDB
    await dynamoDB.put({
      TableName: 'migracle-contacts',
      Item: item
    }).promise();

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Contact form submitted successfully',
        id
      })
    };
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
