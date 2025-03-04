// Script to create a test collection in MongoDB
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'survey-app';
const COLLECTION_NAME = 'test-collection';

console.log('Creating test collection in MongoDB...');
console.log(`Database: ${DB_NAME}`);
console.log(`Collection: ${COLLECTION_NAME}`);

// Create a MongoClient with the recommended options
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000
});

async function run() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection verified successfully");
    
    // Get the database and collection
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Create a test document
    const testDocument = {
      name: 'Test Document',
      createdAt: new Date(),
      testData: {
        number: 42,
        text: 'Hello MongoDB!',
        boolean: true
      }
    };
    
    // Insert the test document
    console.log('Inserting test document...');
    const result = await collection.insertOne(testDocument);
    console.log(`Document inserted with ID: ${result.insertedId}`);
    
    // Retrieve the document to verify
    console.log('Retrieving the document...');
    const retrievedDoc = await collection.findOne({ _id: result.insertedId });
    console.log('Retrieved document:');
    console.log(JSON.stringify(retrievedDoc, null, 2));
    
    // List all collections in the database
    console.log('\nListing all collections in the database:');
    const collections = await db.listCollections().toArray();
    collections.forEach(coll => {
      console.log(` - ${coll.name}`);
    });
    
    console.log('\nMongoDB connection and operations successful!');
    console.log('The MongoDB connection is working correctly with the new credentials.');
    
    return true;
  } catch (err) {
    console.error('Error:', err);
    return false;
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.error); 