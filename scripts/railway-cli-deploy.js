#!/usr/bin/env node

console.log('🛠️ Railway CLI Deployment (Alternative Method)\n');

const { execSync } = require('child_process');

async function deployWithCLI() {
  try {
    console.log('📦 Installing Railway CLI...');
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    
    console.log('\n🔐 Login to Railway...');
    console.log('This will open your browser for authentication.');
    execSync('railway login', { stdio: 'inherit' });
    
    console.log('\n🔗 Linking project...');
    execSync('railway link', { stdio: 'inherit' });
    
    console.log('\n🗄️ Adding MySQL database...');
    execSync('railway add mysql', { stdio: 'inherit' });
    
    console.log('\n🔧 Setting environment variables...');
    execSync('railway variables set EMAIL_USER=wintahboke@gmail.com', { stdio: 'inherit' });
    execSync('railway variables set ADMIN_EMAIL=wintahboke@gmail.com', { stdio: 'inherit' });
    
    console.log('\n⚠️ You need to manually add EMAIL_PASS for security:');
    console.log('   railway variables set EMAIL_PASS="suoj rfnf lvhp basn"');
    
    console.log('\n🚀 Deploying...');
    execSync('railway up', { stdio: 'inherit' });
    
    console.log('\n✅ Deployment complete!');
    console.log('🌐 Check your Railway dashboard for the live URL');
    
  } catch (error) {
    console.error('\n❌ CLI deployment failed:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. Go to https://railway.app/new');
    console.log('2. Enter repository URL: https://github.com/Anita-Boke/My-Portfolio');
    console.log('3. Click "Deploy from GitHub repo"');
    console.log('4. Add MySQL database');
    console.log('5. Set environment variables in dashboard');
  }
}

// Check if user wants to try CLI method
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Try Railway CLI deployment? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    deployWithCLI();
  } else {
    console.log('\n📋 Manual Deployment Steps:');
    console.log('1. Go to https://railway.app/new');
    console.log('2. Try pasting repository URL: https://github.com/Anita-Boke/My-Portfolio');
    console.log('3. Or check GitHub permissions in Railway settings');
    console.log('4. Deploy and add MySQL database');
  }
  rl.close();
});