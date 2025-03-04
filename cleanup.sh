#!/bin/bash

# Cleanup script for unnecessary files after switching to MongoDB Data API

echo "Cleaning up unnecessary files..."

# Test and connection files
rm -f test-mongodb.js
rm -f test-connection.js
rm -f test-new-user.js
rm -f check-ip.js
rm -f simple-test.js
rm -f create-test-collection.js

# Server-related files (no longer needed with direct MongoDB Data API)
# Note: We'll keep server.js in case you want to switch back later
# but we'll rename it to indicate it's obsolete
mv server.js server.js.obsolete

echo "Cleanup complete!"
echo ""
echo "IMPORTANT: Make sure to set up your MongoDB Data API keys in the Vercel dashboard."
echo "See DATA-API-SETUP.md for detailed instructions." 