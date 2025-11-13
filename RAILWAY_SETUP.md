# 🚂 Railway Deployment Guide

## **Recommended Architecture**

```
Frontend (React/Next.js) → Vercel (Static hosting)
Backend API + Database   → Railway (Node.js + MySQL)
Email Service           → Railway backend (SMTP/API)
```

## 🚀 **Railway Setup Steps**

### **Step 1: Deploy Backend to Railway**

1. **Create Railway Account**
   - Go to [https://railway.app](https://railway.app)
   - Sign up with GitHub
   - Connect your repository

2. **Deploy Your Backend**
   - Click "Deploy from GitHub repo"
   - Select your `My-Portfolio` repository
   - Railway will auto-detect Node.js

3. **Add MySQL Database**
   - In your Railway project
   - Click "New" → "Database" → "MySQL"
   - Railway will provide `DATABASE_URL` automatically

### **Step 2: Configure Environment Variables**

Railway will auto-populate database variables. Add these manually:

```bash
# Email Configuration
EMAIL_USER=wintahboke@gmail.com
EMAIL_PASS=suoj rfnf lvhp basn
ADMIN_EMAIL=wintahboke@gmail.com

# PORT (auto-set by Railway)
PORT=3000
```

### **Step 3: Frontend (Vercel) → Backend (Railway)**

Update your frontend API calls to point to Railway:

```javascript
// In your frontend code, use Railway backend URL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.railway.app/api'
  : 'http://localhost:3000/api';
```

## 🔧 **Configuration Files**

### **railway.json** (for Railway deployment)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Updated server.js** (for Railway)
- Built-in MySQL support
- Environment variable configuration
- CORS setup for Vercel frontend

## 🎯 **Benefits of Railway**

✅ **Simple MySQL Database** - Built-in, managed database  
✅ **Environment Variables** - Auto-configured DATABASE_URL  
✅ **SMTP Support** - No blocking issues  
✅ **Auto-deployments** - Connected to GitHub  
✅ **Generous Free Tier** - $5/month credit  
✅ **Easy Scaling** - Automatic resource management  

## 🚀 **Next Steps**

1. **Deploy to Railway**: Follow Step 1-2 above
2. **Get Railway URL**: Copy your app URL from Railway dashboard
3. **Update Vercel**: Add Railway URL as environment variable
4. **Test Integration**: Verify frontend → backend communication

Your portfolio will have:
- ⚡ **Fast frontend** on Vercel
- 🗄️ **Reliable backend** on Railway  
- 📧 **Working email** system
- 📊 **MySQL database** for projects and messages