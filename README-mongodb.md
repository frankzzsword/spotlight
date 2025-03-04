# MongoDB Connection Troubleshooting

We're experiencing authentication issues with the MongoDB Atlas connection. The error message `bad auth : authentication failed` indicates that either:

1. The password for the MongoDB user is incorrect
2. The user doesn't have the proper permissions
3. The connection string format is incorrect

## Steps to Fix MongoDB Connection Issues

### 1. Reset the Database User Password

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com/)
2. Navigate to your project
3. Click on "Database Access" in the left sidebar under Security
4. Find the user "varun" in the list of database users
5. Click the "Edit" button (pencil icon)
6. Click "Edit Password"
7. Enter a new password (use a simple password without special characters for testing)
8. Save the changes

### 2. Update the Connection String in Your .env File

After resetting the password, update the `.env` file with the new connection string:

```
MONGODB_URI=mongodb+srv://varun:YOUR_NEW_PASSWORD@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority
```

Replace `YOUR_NEW_PASSWORD` with the new password you created.

### 3. Test the Connection

Run the test script to verify the connection:

```
node test-mongodb.js
```

### 4. Alternative Connection Methods

If you're still having issues, try these alternatives:

1. Create a new database user with a simple username and password
2. Use the connection string format provided in the MongoDB Atlas dashboard
3. Check if your IP address is whitelisted in MongoDB Atlas (Security → Network Access)
4. Try connecting using MongoDB Compass to verify credentials

## MongoDB Atlas Connection String Format

The recommended connection string format from MongoDB Atlas is:

```
mongodb+srv://username:password@spotlightcard.bdu1t.mongodb.net/?retryWrites=true&w=majority&appName=spotlightcard
```

Make sure to replace `username` and `password` with your actual credentials.

## Need Further Help?

If you continue to experience issues, please:

1. Check the MongoDB Atlas logs for more detailed error information
2. Verify that your MongoDB Atlas cluster is active and running
3. Contact MongoDB Atlas support if the issue persists 