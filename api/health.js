// API health check endpoint
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB Connection URI - use environment variable
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'survey-app';

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
  
  try {
    // Check MongoDB connection
    let mongoStatus = 'Not connected';
    let error = null;
    
    try {
      const { client } = await connectToDatabase();
      await client.db("admin").command({ ping: 1 });
      mongoStatus = 'Connected';
    } catch (e) {
      mongoStatus = 'Error';
      error = e.message;
    }
    
    res.status(200).json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      mongodb: mongoStatus,
      error: error,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      vercelRegion: process.env.VERCEL_REGION || 'unknown'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}; 