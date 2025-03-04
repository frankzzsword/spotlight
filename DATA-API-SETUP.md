# MongoDB Data API Setup Instructions

This application now uses MongoDB Data API to connect directly from the frontend to MongoDB Atlas, bypassing the need for a Node.js backend.

## Setting Up MongoDB Data API

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com/)
2. Navigate to your cluster
3. Click on the "Data API" tab in the left sidebar
4. Enable the Data API if it's not already enabled
5. Create a new API Key:
   - Click "Create API Key"
   - Give it a descriptive name like "Survey App API Key"
   - Set appropriate permissions (read/write to your database)
   - Copy the generated API Key (you won't be able to see it again)

## Local Development Setup

1. Create a `.env.local` file in the root of the project (if not already created)
2. Add the following environment variables:
   ```
   REACT_APP_MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/data-api/endpoint/data/v1
   REACT_APP_MONGODB_DATA_API_KEY=YOUR_API_KEY_HERE
   REACT_APP_MONGODB_DATASOURCE=mongodb-atlas
   REACT_APP_MONGODB_DATABASE=survey-app
   REACT_APP_MONGODB_COLLECTION=surveys
   ```
3. Replace `YOUR_API_KEY_HERE` with the API key you generated in MongoDB Atlas
4. Start the development server with `npm start`

## Vercel Deployment

When deploying to Vercel, you need to set up the environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following environment variables:
   - `REACT_APP_MONGODB_DATA_API_URL`: https://data.mongodb-api.com/app/data-api/endpoint/data/v1
   - `REACT_APP_MONGODB_DATA_API_KEY`: Your MongoDB Data API Key
   - `REACT_APP_MONGODB_DATASOURCE`: mongodb-atlas (or your custom data source name)
   - `REACT_APP_MONGODB_DATABASE`: survey-app (or your database name)
   - `REACT_APP_MONGODB_COLLECTION`: surveys (or your collection name)
4. Redeploy your application

## Security Considerations

The MongoDB Data API key has access to your database directly from the client side. To enhance security:

1. Set IP restrictions on your MongoDB Data API key if possible
2. Consider implementing authentication for sensitive operations
3. Use MongoDB Atlas Rules to limit what operations can be performed with the API key
4. For a production application, consider implementing proper authentication and role-based access control

## Troubleshooting

If you're encountering issues:

1. Check the browser console for any error messages
2. Verify that your API key is correct and has the necessary permissions
3. Ensure that your MongoDB Atlas cluster is running and accessible
4. Check that your database and collection names match what's in the environment variables
5. Try the connection status indicator on the Admin Dashboard to verify connectivity 