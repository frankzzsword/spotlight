# MongoDB Atlas Setup Guide

This guide will help you set up a MongoDB Atlas cluster for the survey application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account

## Step 2: Create a Cluster

1. After signing in, click "Build a Database"
2. Choose the "FREE" tier
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to your users
5. Click "Create Cluster" (this may take a few minutes)

## Step 3: Set Up Database Access

1. In the left sidebar, click "Database Access" under "Security"
2. Click "Add New Database User"
3. Create a username and password (make sure to save these)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

## Step 4: Set Up Network Access

1. In the left sidebar, click "Network Access" under "Security"
2. Click "Add IP Address"
3. To allow access from anywhere (for development), click "Allow Access from Anywhere"
4. Click "Confirm"

## Step 5: Get Your Connection String

1. In the left sidebar, click "Database" under "Deployments"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user's password
6. Replace `<dbname>` with `survey-app`

## Step 6: Update Environment Variables

1. Update the `.env` file with your connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/survey-app?retryWrites=true&w=majority
```

2. For Vercel deployment, add the `MONGODB_URI` environment variable in the Vercel dashboard:
   - Go to your project in the Vercel dashboard
   - Click on "Settings"
   - Click on "Environment Variables"
   - Add a new variable with the name `MONGODB_URI` and the value as your connection string

## Testing the Connection

To test if your MongoDB connection is working:

1. Start the server: `npm run server`
2. Check the console for "Connected to MongoDB" message

If you see any errors, double-check your connection string and make sure your IP address is allowed in the Network Access settings.

## Troubleshooting

- If you get a connection error, make sure your IP address is allowed in the Network Access settings
- If you get an authentication error, check your username and password
- If you get a timeout error, check your network connection 