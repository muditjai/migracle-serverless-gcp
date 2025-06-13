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
