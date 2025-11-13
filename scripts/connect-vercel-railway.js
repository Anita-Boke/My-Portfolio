#!/usr/bin/env node

console.log('🔗 Connecting Vercel Frontend to Railway Backend\n');

console.log('📋 **Step-by-Step Connection Process:**\n');

console.log('1️⃣ **Get Your Railway Backend URL**');
console.log('   • Go to Railway dashboard: https://railway.app/dashboard');
console.log('   • Click on your deployed project');
console.log('   • In Settings → Domains, copy your app URL');
console.log('   • Should look like: https://my-portfolio-production-xxxx.up.railway.app\n');

console.log('2️⃣ **Update Vercel Environment Variables**');
console.log('   Run these commands to connect frontend to backend:');
console.log('   ');
console.log('   vercel env add NEXT_PUBLIC_API_URL production');
console.log('   # When prompted, enter your Railway URL');
console.log('   ');
console.log('   vercel env add RAILWAY_BACKEND_URL production');
console.log('   # Enter the same Railway URL');
console.log('   ');

console.log('3️⃣ **Update Frontend API Calls**');
console.log('   Your frontend will automatically use Railway backend in production\n');

console.log('4️⃣ **Redeploy Frontend**');
console.log('   vercel --prod');
console.log('   # This will redeploy with new environment variables\n');

console.log('5️⃣ **Test the Connection**');
console.log('   • Visit your Vercel portfolio URL');
console.log('   • Check if projects load from Railway database');
console.log('   • Test contact form (should save to Railway database)\n');

console.log('🎯 **What This Achieves:**');
console.log('   ✅ Frontend (Vercel) → API calls → Backend (Railway)');
console.log('   ✅ Contact form submissions → Railway database');
console.log('   ✅ Project data → Railway database');
console.log('   ✅ Email sending → Railway backend\n');

console.log('⚡ **Quick Commands to Run:**');
console.log('   1. Get Railway URL from dashboard');
console.log('   2. vercel env add NEXT_PUBLIC_API_URL production');
console.log('   3. vercel --prod');
console.log('   4. Test your live portfolio\n');

// Open both dashboards
console.log('🌐 Opening dashboards...');
const { execSync } = require('child_process');
try {
  execSync('start https://railway.app/dashboard', { stdio: 'ignore' });
  setTimeout(() => {
    execSync('start https://vercel.com/dashboard', { stdio: 'ignore' });
  }, 2000);
} catch (error) {
  console.log('   Railway: https://railway.app/dashboard');
  console.log('   Vercel: https://vercel.com/dashboard');
}