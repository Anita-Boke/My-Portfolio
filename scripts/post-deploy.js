#!/usr/bin/env node

console.log('🚂 Railway Post-Deployment Setup\n');

console.log('✅ Great! Your app is deployed to Railway. Now let\'s complete the setup:\n');

console.log('📋 **STEP 1: Get Your Railway URLs**');
console.log('   1. Go to your Railway dashboard');
console.log('   2. Click on your deployed project');
console.log('   3. Copy your app URL (looks like: https://your-app.railway.app)');
console.log('   4. Note your database connection details\n');

console.log('📋 **STEP 2: Add Environment Variables to Railway**');
console.log('   In Railway dashboard → Variables tab, add:');
console.log('   EMAIL_USER=wintahboke@gmail.com');
console.log('   EMAIL_PASS=suoj rfnf lvhp basn');
console.log('   ADMIN_EMAIL=wintahboke@gmail.com');
console.log('   NODE_ENV=production\n');

console.log('📋 **STEP 3: Add MySQL Database**');
console.log('   1. In Railway dashboard → Add service');
console.log('   2. Select "MySQL"');
console.log('   3. Railway will auto-generate DATABASE_URL');
console.log('   4. Wait for database to be ready\n');

console.log('📋 **STEP 4: Initialize Database Tables**');
console.log('   Run this once your DATABASE_URL is ready:');
console.log('   railway run npm run setup-db\n');

console.log('📋 **STEP 5: Update Vercel Frontend**');
console.log('   Connect your frontend to Railway backend:');
console.log('   vercel env add RAILWAY_URL production');
console.log('   # Enter your Railway app URL');
console.log('   vercel --prod\n');

console.log('🎉 **Your Portfolio Will Have:**');
console.log('   ✅ Fast frontend on Vercel');
console.log('   ✅ Reliable backend on Railway');
console.log('   ✅ MySQL database with your projects');
console.log('   ✅ Working email contact form');
console.log('   ✅ Professional GitHub projects display\n');

console.log('🔧 **Need the Railway URL?**');
console.log('   Option 1: Railway dashboard (easiest)');
console.log('   Option 2: railway status (CLI command)');
console.log('   Option 3: railway domain (CLI command)\n');

// Open Railway dashboard
console.log('🌐 Opening Railway dashboard...');
const { execSync } = require('child_process');
try {
  execSync('start https://railway.app/dashboard', { stdio: 'ignore' });
} catch (error) {
  console.log('   Please visit: https://railway.app/dashboard');
}