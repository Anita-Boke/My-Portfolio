#!/usr/bin/env node

console.log('🚂 Final Railway Configuration\n');

console.log('✅ Vercel frontend redeployed successfully!');
console.log('🔗 New URL: https://anita-boke-portfolio-8m4axvl6g-anita-bokes-projects.vercel.app\n');

console.log('📋 **Final Steps to Complete:**\n');

console.log('1️⃣ **Add Environment Variables to Railway**');
console.log('   Go to Railway dashboard → Your project → Variables tab');
console.log('   Add these variables:');
console.log('   ');
console.log('   EMAIL_USER=wintahboke@gmail.com');
console.log('   EMAIL_PASS=suoj rfnf lvhp basn');
console.log('   ADMIN_EMAIL=wintahboke@gmail.com');
console.log('   NODE_ENV=production\n');

console.log('2️⃣ **Add MySQL Database (if not done)**');
console.log('   In Railway dashboard:');
console.log('   • Click "New" → "Database" → "MySQL"');
console.log('   • Wait for DATABASE_URL to be generated');
console.log('   • Railway will automatically restart your app\n');

console.log('3️⃣ **Initialize Database Tables**');
console.log('   Once MySQL is added, run:');
console.log('   railway run npm run setup-db\n');

console.log('4️⃣ **Test Your Live Portfolio**');
console.log('   Visit: https://anita-boke-portfolio-8m4axvl6g-anita-bokes-projects.vercel.app');
console.log('   • Check if projects display correctly');
console.log('   • Test contact form (should send emails)');
console.log('   • Verify all sections work properly\n');

console.log('🎯 **What You\'ll Have After This:**');
console.log('   ✅ Live portfolio with professional design');
console.log('   ✅ Working contact form with email notifications');
console.log('   ✅ Database-driven project management');
console.log('   ✅ Fast global delivery via Vercel CDN');
console.log('   ✅ Reliable backend infrastructure on Railway\n');

console.log('🚀 **You\'re almost done! Just add those Railway variables and test!**');

// Open Railway dashboard and new portfolio
console.log('🌐 Opening Railway dashboard and your new portfolio...');
const { execSync } = require('child_process');
try {
  execSync('start https://railway.app/dashboard', { stdio: 'ignore' });
  setTimeout(() => {
    execSync('start https://anita-boke-portfolio-8m4axvl6g-anita-bokes-projects.vercel.app', { stdio: 'ignore' });
  }, 2000);
} catch (error) {
  console.log('   Railway: https://railway.app/dashboard');
  console.log('   Portfolio: https://anita-boke-portfolio-8m4axvl6g-anita-bokes-projects.vercel.app');
}