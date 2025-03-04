// Test MongoDB connection with new admin credentials
const { MongoClient, ServerApiVersion } = require('mongodb');

// New admin credentials
const username = 'varunmishra';
const password = 'UHuqWWz5HqSFb0IU';

// Connection string with the new credentials
const uri = `mongodb+srv://${username}:${password}@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard`;

console.log('Testing connection with new admin credentials...');
console.log(`Username: ${username}`);
console.log(`Password: ${'*'.repeat(password.length)}`);

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
    console.log("\n✅ SUCCESS: Connected to MongoDB Atlas!");
    
    // List available databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("\nAvailable databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Try to access the survey-app database
    const db = client.db("survey-app");
    const collections = await db.listCollections().toArray();
    console.log("\nCollections in survey-app database:");
    if (collections.length === 0) {
      console.log(" (No collections found)");
    } else {
      collections.forEach(collection => console.log(` - ${collection.name}`));
    }
    
    // Update the .env file recommendation
    console.log("\n✅ Connection test successful! Update your .env file with these credentials:");
    console.log(`MONGODB_URI=mongodb+srv://${username}:${password}@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard`);
    
    return true;
  } catch (err) {
    console.error('\n❌ ERROR: Failed to connect to MongoDB:', err);
    console.log('\nPossible solutions:');
    console.log('1. Double-check the username and password');
    console.log('2. Verify that your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Ensure the MongoDB Atlas cluster is running');
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('\nConnection closed');
  }
}

run().catch(console.dir); 