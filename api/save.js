// API endpoint to save survey data
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB Connection URI - use environment variable
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'survey-app';
const COLLECTION_NAME = 'responses';

// Implement connection pooling for serverless
let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB with connection pooling
async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection, create a new one
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  // Connection options optimized for serverless
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    minPoolSize: 1,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 30000,
  };

  try {
    // Connect to the MongoDB server
    const client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    // Get reference to the database
    const db = client.db(DB_NAME);
    
    // Verify connection
    await client.db("admin").command({ ping: 1 });
    
    // Cache the client and db connection
    cachedClient = client;
    cachedDb = db;
    
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Validate request body
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        error: 'Request body is empty or invalid'
      });
    }

    // Add timestamp
    const surveyData = {
      ...data,
      timestamp: new Date()
    };

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Save to MongoDB
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne(surveyData);
    
    res.status(200).json({
      success: true,
      message: 'Survey data saved successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Save survey data error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 