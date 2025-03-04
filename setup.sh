#!/bin/bash

# Install dependencies
npm install express cors body-parser concurrently

# Create server directory if it doesn't exist
mkdir -p server

# Create an empty JSON file for storing survey data
echo "[]" > server/surveyData.json

echo "Setup complete! You can now run 'npm run dev' to start both the React app and the API server." 