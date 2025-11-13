#!/usr/bin/env node

console.log('🎯 Simplified PlanetScale Setup (No CLI Required)\n');

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupPlanetScale() {
  console.log('Let\'s set up your PlanetScale database step by step:\n');

  // Step 1: Web setup
  console.log('📋 Step 1: Create Database (Web Interface)');
  console.log('   1. Go to: https://planetscale.com');
  console.log('   2. Sign up/Login');
  console.log('   3. Click "Create database"');
  console.log('   4. Name: portfolio');
  console.log('   5. Select your region\n');

  await askQuestion('Press Enter when you\'ve created the database...');

  // Step 2: Get connection details
  console.log('\n📋 Step 2: Get Connection Details');
  console.log('   1. In your PlanetScale dashboard');
  console.log('   2. Go to your "portfolio" database');
  console.log('   3. Click "Connect"');
  console.log('   4. Select "Node.js"');
  console.log('   5. Copy the connection details\n');

  const host = await askQuestion('Enter PLANETSCALE_HOST (e.g., aws.connect.psdb.cloud): ');
  const username = await askQuestion('Enter PLANETSCALE_USERNAME: ');
  const password = await askQuestion('Enter PLANETSCALE_PASSWORD: ');
  const database = await askQuestion('Enter PLANETSCALE_DATABASE (default: portfolio): ') || 'portfolio';

  // Step 3: Update .env file
  console.log('\n📋 Step 3: Updating .env file...');
  
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('Creating new .env file...');
  }

  // Update or add PlanetScale variables
  const planetScaleVars = `
# PlanetScale Database Configuration
PLANETSCALE_HOST=${host}
PLANETSCALE_USERNAME=${username}
PLANETSCALE_PASSWORD=${password}
PLANETSCALE_DATABASE=${database}
`;

  if (envContent.includes('PLANETSCALE_HOST')) {
    // Replace existing values
    envContent = envContent.replace(/PLANETSCALE_HOST=.*/g, `PLANETSCALE_HOST=${host}`);
    envContent = envContent.replace(/PLANETSCALE_USERNAME=.*/g, `PLANETSCALE_USERNAME=${username}`);
    envContent = envContent.replace(/PLANETSCALE_PASSWORD=.*/g, `PLANETSCALE_PASSWORD=${password}`);
    envContent = envContent.replace(/PLANETSCALE_DATABASE=.*/g, `PLANETSCALE_DATABASE=${database}`);
  } else {
    // Add new variables
    envContent += planetScaleVars;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file updated with PlanetScale credentials');

  // Step 4: Initialize database
  console.log('\n📋 Step 4: Initializing database tables...');
  
  const { execSync } = require('child_process');
  try {
    execSync('npm run setup-db', { stdio: 'inherit' });
    console.log('✅ Database tables created and seeded!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('You can run "npm run setup-db" manually later.');
  }

  // Step 5: Vercel setup
  console.log('\n📋 Step 5: Add to Vercel');
  console.log('Run these commands to add environment variables to Vercel:\n');
  console.log(`vercel env add PLANETSCALE_HOST production`);
  console.log(`# Enter: ${host}`);
  console.log(`\nvercel env add PLANETSCALE_USERNAME production`);
  console.log(`# Enter: ${username}`);
  console.log(`\nvercel env add PLANETSCALE_PASSWORD production`);
  console.log(`# Enter: ${password}`);
  console.log(`\nvercel env add PLANETSCALE_DATABASE production`);
  console.log(`# Enter: ${database}`);
  
  console.log('\n🚀 Then deploy: vercel --prod');
  console.log('\n🎉 Your portfolio will now have PlanetScale database integration!');

  rl.close();
}

setupPlanetScale().catch(console.error);