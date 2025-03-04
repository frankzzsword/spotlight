// Simple MongoDB connection test
const { MongoClient } = require('mongodb');

// Connection string with a placeholder for the password
const uri = "mongodb+srv://varun:WB3pqePR6PdHPhA4@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority";

console.log('Attempting to connect with simplified approach...');

// Create a new MongoClient
const client = new MongoClient(uri);

// Connect to the MongoDB server
client.connect()
  .then(() => {
    console.log('Connected successfully to MongoDB!');
    return client.db().admin().listDatabases();
  })
  .then(result => {
    console.log('Available databases:');
    result.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  })
  .finally(() => {
    client.close();
    console.log('Connection closed');
  }); 