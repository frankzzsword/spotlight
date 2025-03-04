// Test MongoDB connection
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Log the MongoDB URI (with password masked)
const uriWithMaskedPassword = process.env.MONGODB_URI 
  ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@')
  : 'MONGODB_URI is not defined';

console.log('MongoDB URI from .env:', uriWithMaskedPassword);

// Use the exact connection string format from MongoDB Atlas
const password = 'WB3pqePR6PdHPhA4';
const uri = `mongodb+srv://varun:${password}@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard`;

console.log('Using connection string format from MongoDB Atlas dashboard');
console.log('Connection string (with masked password):', uri.replace(password, '****'));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // List available databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Try to access the survey-app database
    const db = client.db("survey-app");
    const collections = await db.listCollections().toArray();
    console.log("Collections in survey-app database:");
    collections.forEach(collection => console.log(` - ${collection.name}`));
    
    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.dir); 