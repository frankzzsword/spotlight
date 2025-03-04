# MongoDB Connection Troubleshooting Guide

## Current Issue

We're experiencing authentication issues with the MongoDB Atlas connection. The error message `bad auth : authentication failed` indicates that either:

1. The password for the MongoDB user is incorrect
2. The user doesn't have the proper permissions
3. The connection string format is incorrect
4. Your IP address is not whitelisted in MongoDB Atlas

## Troubleshooting Tools

We've created several tools to help you diagnose and fix the MongoDB connection issues:

1. **check-ip.js** - Shows your current IP address for whitelisting in MongoDB Atlas
2. **test-connection.js** - Interactive script to test MongoDB connection with custom credentials
3. **test-mongodb.js** - Tests connection using the credentials in your .env file
4. **README-mongodb.md** - Detailed instructions for fixing MongoDB connection issues

## Step-by-Step Resolution

### 1. Check Your IP Address

Run the following command to check your current IP address:

```
node check-ip.js
```

Make sure this IP address is whitelisted in MongoDB Atlas:
- Log in to MongoDB Atlas
- Go to Network Access in the Security section
- Add your IP address or allow access from anywhere (for testing only)

### 2. Verify/Reset MongoDB User Credentials

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your project
3. Click on "Database Access" in the left sidebar under Security
4. Find the user "varun" in the list of database users
5. Click the "Edit" button (pencil icon)
6. Click "Edit Password"
7. Enter a new password (use a simple password without special characters for testing)
8. Save the changes

### 3. Test Connection with New Credentials

Run the interactive test script:

```
node test-connection.js
```

Follow the prompts to enter your username and new password.

### 4. Update Your .env File

If the test is successful, update your `.env` file with the working connection string:

```
MONGODB_URI=mongodb+srv://username:password@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard
```

Replace `username` and `password` with your actual credentials.

### 5. Verify the Updated Connection

Run the following command to test the connection with your updated .env file:

```
node test-mongodb.js
```

## Common MongoDB Atlas Issues and Solutions

### Authentication Failed

**Symptoms:**
- Error message: `bad auth : authentication failed`
- Code: 8000, CodeName: AtlasError

**Solutions:**
1. Reset the database user password in MongoDB Atlas
2. Create a new database user with a simple password
3. Check if the user has the appropriate roles (at least readWrite on the database)

### Connection Timeout

**Symptoms:**
- Error message: `connection timed out`
- Application hangs when trying to connect

**Solutions:**
1. Check if your IP address is whitelisted in MongoDB Atlas
2. Verify that the MongoDB Atlas cluster is running
3. Check for network issues or firewall restrictions

### Database Not Found

**Symptoms:**
- Error message: `database not found` or similar

**Solutions:**
1. Make sure you're using the correct database name in your connection string
2. Check if the database exists in MongoDB Atlas
3. Create the database if it doesn't exist

## MongoDB Connection Best Practices

1. **Use Environment Variables**: Store connection strings in .env files, never hardcode them
2. **Include Connection Options**: Use the recommended options for better reliability:
   ```javascript
   const client = new MongoClient(uri, {
     serverApi: {
       version: '1',
       strict: true,
       deprecationErrors: true,
     },
     connectTimeoutMS: 30000,
     socketTimeoutMS: 45000
   });
   ```
3. **Implement Connection Pooling**: For production applications
4. **Handle Connection Errors**: Implement proper error handling and reconnection logic
5. **Secure Your Connection**: Use TLS/SSL and strong passwords

## Need Further Help?

If you continue to experience issues after trying these solutions:

1. Check the MongoDB Atlas logs for more detailed error information
2. Verify that your MongoDB Atlas cluster is active and running
3. Contact MongoDB Atlas support if the issue persists 