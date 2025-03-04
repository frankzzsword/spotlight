// Script to check your current IP address for MongoDB Atlas whitelisting
const https = require('https');

console.log('Checking your current public IP address...');

// Use a public API to get the current IP address
https.get('https://api.ipify.org', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== MongoDB Atlas IP Whitelist Information ===');
    console.log(`Your current public IP address is: ${data}`);
    console.log('\nTo add this IP to MongoDB Atlas whitelist:');
    console.log('1. Log in to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Navigate to your project');
    console.log('3. Click on "Network Access" in the left sidebar under Security');
    console.log('4. Click the "+ ADD IP ADDRESS" button');
    console.log('5. Enter your IP address or click "ADD CURRENT IP ADDRESS"');
    console.log('6. Add a comment like "Development Machine" and click "Confirm"');
    console.log('\nAlternatively, you can allow access from anywhere (not recommended for production):');
    console.log('1. Click "+ ADD IP ADDRESS"');
    console.log('2. Click "ALLOW ACCESS FROM ANYWHERE"');
    console.log('3. Click "Confirm"');
    console.log('\nNote: IP whitelist changes may take a few minutes to propagate.');
  });
}).on('error', (err) => {
  console.error('Error checking IP address:', err.message);
}); 