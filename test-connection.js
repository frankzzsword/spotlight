// Interactive MongoDB connection test script
const readline = require('readline');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to test MongoDB connection
async function testConnection(username, password) {
  // Create connection string with provided credentials
  const uri = `mongodb+srv://${username}:${password}@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard`;
  
  console.log(`\nTesting connection with username: ${username} and password: ${'*'.repeat(password.length)}`);
  
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    // Connect the client to the server
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("\n✅ SUCCESS: Connected to MongoDB Atlas!");
    
    // List available databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("\nAvailable databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // If survey-app database exists, list its collections
    if (databasesList.databases.some(db => db.name === 'survey-app')) {
      const db = client.db("survey-app");
      const collections = await db.listCollections().toArray();
      console.log("\nCollections in survey-app database:");
      if (collections.length === 0) {
        console.log(" (No collections found)");
      } else {
        collections.forEach(collection => console.log(` - ${collection.name}`));
      }
    }
    
    console.log("\n✅ Connection test successful! Update your .env file with these credentials.");
    console.log(`MONGODB_URI=mongodb+srv://${username}:${password}@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard`);
    
    return true;
  } catch (err) {
    console.error('\n❌ ERROR: Failed to connect to MongoDB:', err.message);
    console.log('\nPossible solutions:');
    console.log('1. Check if the username and password are correct');
    console.log('2. Verify that your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Ensure the MongoDB Atlas cluster is running');
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('\nConnection closed');
  }
}

// Main function to prompt for credentials and test connection
async function main() {
  console.log('=== MongoDB Atlas Connection Tester ===');
  console.log('This script will help you test your MongoDB Atlas connection with custom credentials.\n');
  
  rl.question('Enter MongoDB username (default: varun): ', (username) => {
    username = username || 'varun';
    
    rl.question('Enter MongoDB password: ', async (password) => {
      if (!password) {
        console.log('❌ Password cannot be empty. Please run the script again.');
        rl.close();
        return;
      }
      
      try {
        await testConnection(username, password);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        rl.close();
      }
    });
  });
}

// Start the script
main(); 