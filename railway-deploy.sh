#!/bin/bash
# Railway deployment script to setup database tables

echo "🚀 Starting Railway deployment setup..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database tables
echo "🗄️ Setting up database tables..."
node scripts/create-database-tables.js

# Start the application
echo "🌟 Starting the application..."
npm start