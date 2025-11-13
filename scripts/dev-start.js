#!/usr/bin/env node

console.log('🚀 Running Portfolio in Development Mode\n');

// For local development, we'll use JSON data since database isn't set up locally
process.env.NODE_ENV = 'development';

console.log('📋 Development Setup:');
console.log('   ✅ Backend: Running locally on port 3000');
console.log('   ✅ Frontend: Serving static files');
console.log('   ✅ Data: Using JSON files (no database required)');
console.log('   ✅ Email: Using environment variables\n');

console.log('🌐 Your portfolio will be available at:');
console.log('   http://localhost:3000\n');

console.log('🔧 For Production:');
console.log('   • Backend: Deploy to Railway');
console.log('   • Frontend: Deploy to Vercel');
console.log('   • Database: Railway MySQL\n');

// Start the server
console.log('⏳ Starting server...\n');
require('../server.js');