// API endpoint to save suggestion questions
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB Connection URI - use environment variable
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'survey-app';
const COLLECTION_NAME = 'suggestions';

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
    if (!data || !data.question || typeof data.question !== 'string') {
      return res.status(400).json({
        error: 'Invalid suggestion format. Must include a question field as string.'
      });
    }

    // Trim question and check length
    const question = data.question.trim();
    if (question.length < 3) {
      return res.status(400).json({
        error: 'Question is too short. Must be at least 3 characters.'
      });
    }

    // Add timestamp and format suggestion
    const suggestionData = {
      question: question,
      status: 'new',  // new, approved, rejected
      timestamp: new Date(),
      meta: {
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
      }
    };

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Save to MongoDB
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne(suggestionData);
    
    res.status(200).json({
      success: true,
      message: 'Suggestion saved successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Save suggestion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 