const AWS = require('aws-sdk');

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
    const { email } = body;

    // Validate input
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Check if email already exists
    const checkParams = {
      TableName: 'migracle-subscribers',
      Key: { email }
    };

    const existingItem = await dynamoDB.get(checkParams).promise();
    
    if (existingItem.Item) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email already subscribed' })
      };
    }

    const timestamp = new Date().toISOString();

    // Prepare item for DynamoDB
    const item = {
      email,
      created_at: timestamp
    };

    // Save to DynamoDB
    await dynamoDB.put({
      TableName: 'migracle-subscribers',
      Item: item
    }).promise();

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Subscription successful',
        email
      })
    };
  } catch (error) {
    console.error('Error processing subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
