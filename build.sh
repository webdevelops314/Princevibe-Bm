#!/bin/bash

# Install dependencies
npm install

# Install client dependencies
cd client
npm install

# Build the React app
npm run build

# Move build files to root for Vercel
cd ..
mv client/build/* ./

echo "Build completed successfully!"
