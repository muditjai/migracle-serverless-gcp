# Data Migration Guide: SQLite to DynamoDB

This guide provides instructions for migrating data from the existing SQLite database to AWS DynamoDB as part of the serverless migration.

## Prerequisites

- AWS CLI installed and configured
- Node.js and npm installed
- Access to the existing SQLite database file (`contacts.db`)
- AWS account with appropriate permissions

## Migration Process Overview

1. Export data from SQLite
2. Transform data to DynamoDB format
3. Import data into DynamoDB
4. Verify the migration

## Step 1: Create a Migration Script

Create a file named `migrate-data.js` in the root of the project:

```javascript
const sqlite3 = require('sqlite3').verbose();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
AWS.config.update({
  region: 'us-west-2' // Change to your region
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Connect to SQLite database
const db = new sqlite3.Database('./contacts.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Migrate contacts
async function migrateContacts() {
  return new Promise((resolve, reject) => {
    const contacts = [];
    
    db.each('SELECT * FROM contacts', (err, row) => {
      if (err) {
        console.error('Error reading contacts:', err.message);
        return reject(err);
      }
      
      // Transform SQLite row to DynamoDB item
      contacts.push({
        id: uuidv4(), // Generate a new UUID for each contact
        name: row.name,
        email: row.email,
        message: row.message,
        created_at: row.created_at || new Date().toISOString()
      });
    }, async (err, count) => {
      if (err) {
        return reject(err);
      }
      
      console.log(`Found ${count} contacts to migrate`);
      
      // Batch write to DynamoDB
      try {
        for (let i = 0; i < contacts.length; i += 25) {
          const batch = contacts.slice(i, i + 25);
          
          const params = {
            RequestItems: {
              'migracle-contacts': batch.map(item => ({
                PutRequest: {
                  Item: item
                }
              }))
            }
          };
          
          await dynamoDB.batchWrite(params).promise();
          console.log(`Migrated batch ${i/25 + 1} of contacts`);
        }
        
        console.log(`Successfully migrated ${count} contacts`);
        resolve(count);
      } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        reject(error);
      }
    });
  });
}

// Migrate subscribers
async function migrateSubscribers() {
  return new Promise((resolve, reject) => {
    const subscribers = [];
    
    db.each('SELECT * FROM subscribers', (err, row) => {
      if (err) {
        console.error('Error reading subscribers:', err.message);
        return reject(err);
      }
      
      // Transform SQLite row to DynamoDB item
      subscribers.push({
        email: row.email,
        created_at: row.created_at || new Date().toISOString()
      });
    }, async (err, count) => {
      if (err) {
        return reject(err);
      }
      
      console.log(`Found ${count} subscribers to migrate`);
      
      // Batch write to DynamoDB
      try {
        for (let i = 0; i < subscribers.length; i += 25) {
          const batch = subscribers.slice(i, i + 25);
          
          const params = {
            RequestItems: {
              'migracle-subscribers': batch.map(item => ({
                PutRequest: {
                  Item: item
                }
              }))
            }
          };
          
          await dynamoDB.batchWrite(params).promise();
          console.log(`Migrated batch ${i/25 + 1} of subscribers`);
        }
        
        console.log(`Successfully migrated ${count} subscribers`);
        resolve(count);
      } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        reject(error);
      }
    });
  });
}

// Run migration
async function runMigration() {
  try {
    const contactsCount = await migrateContacts();
    const subscribersCount = await migrateSubscribers();
    
    console.log('Migration completed successfully:');
    console.log(`- ${contactsCount} contacts migrated`);
    console.log(`- ${subscribersCount} subscribers migrated`);
    
    // Close SQLite connection
    db.close((err) => {
      if (err) {
        console.error('Error closing SQLite database:', err.message);
      } else {
        console.log('SQLite database connection closed');
      }
    });
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Start migration
runMigration();
```

## Step 2: Install Dependencies

Create a `package.json` file for the migration script:

```json
{
  "name": "sqlite-to-dynamodb-migration",
  "version": "1.0.0",
  "description": "Migration script for SQLite to DynamoDB",
  "main": "migrate-data.js",
  "scripts": {
    "migrate": "node migrate-data.js"
  },
  "dependencies": {
    "aws-sdk": "^2.1490.0",
    "sqlite3": "^5.1.7",
    "uuid": "^9.0.1"
  }
}
```

Install the dependencies:

```bash
npm install
```

## Step 3: Run the Migration

1. Make sure your AWS credentials are configured correctly
2. Copy the SQLite database file (`contacts.db`) to the same directory as the migration script
3. Run the migration:

```bash
npm run migrate
```

4. The script will output progress information and completion status

## Step 4: Verify the Migration

### Verify in AWS Console

1. Sign in to the AWS Management Console
2. Navigate to DynamoDB
3. Select the "Tables" section
4. Check the "migracle-contacts" and "migracle-subscribers" tables
5. Use the "Items" tab to view the migrated data

### Verify with AWS CLI

Check the number of items in each table:

```bash
# Count contacts
aws dynamodb scan --table-name migracle-contacts --select COUNT --region us-west-2

# Count subscribers
aws dynamodb scan --table-name migracle-subscribers --select COUNT --region us-west-2
```

## Troubleshooting

### Common Issues

1. **AWS Credentials Error**:
   - Ensure your AWS credentials are properly configured
   - Run `aws configure` to set up your credentials

2. **SQLite Database Access Error**:
   - Verify the path to the SQLite database file
   - Ensure you have read permissions for the file

3. **DynamoDB Throughput Exceeded**:
   - If you have a large amount of data, you might exceed the provisioned throughput
   - Modify the script to add delays between batches or reduce batch size

4. **Data Transformation Errors**:
   - Check the console output for specific errors
   - Verify that the SQLite schema matches what the script expects

### Rollback Procedure

If you need to roll back the migration:

1. Delete the items from DynamoDB tables:

```bash
# Delete all items from contacts table
aws dynamodb scan --table-name migracle-contacts --attributes-to-get "id" --region us-west-2 | \
jq -r '.Items[] | {id: .id.S}' | \
jq -s '{migracle-contacts: [{DeleteRequest: {Key: .}}]}' | \
aws dynamodb batch-write-item --request-items file:///dev/stdin --region us-west-2

# Delete all items from subscribers table
aws dynamodb scan --table-name migracle-subscribers --attributes-to-get "email" --region us-west-2 | \
jq -r '.Items[] | {email: .email.S}' | \
jq -s '{migracle-subscribers: [{DeleteRequest: {Key: .}}]}' | \
aws dynamodb batch-write-item --request-items file:///dev/stdin --region us-west-2
```

2. Continue using the SQLite database until you're ready to try again

## Post-Migration Steps

1. Update your application to use DynamoDB instead of SQLite
2. Monitor the application to ensure it's working correctly with DynamoDB
3. Consider setting up a backup strategy for your DynamoDB tables
4. Keep the SQLite database as a backup until you're confident in the migration

## Additional Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
