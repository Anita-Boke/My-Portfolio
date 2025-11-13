# 🚀 Complete Railway & Vercel Deployment Guide

## Step 1: Set Up Railway MySQL Database

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login and open your project: `my-portfolio-production-2f89`

2. **Add MySQL Database**
   - Click "New Service" → "Database" → "MySQL"
   - Railway will automatically create DATABASE_URL

3. **Set Environment Variables**
   Copy these to Railway → Variables tab:
   ```
   EMAIL_USER=wintahboke@gmail.com
   EMAIL_PASS=suoj rfnf lvhp basn
   ADMIN_EMAIL=wintahboke@gmail.com
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=uploads
   RESUME_DIR=uploads/resumes
   VERCEL_URL=https://anita-boke-portfolio.vercel.app
   FRONTEND_URL=https://anita-boke-portfolio.vercel.app
   ```

## Step 2: Run Database Setup (After Railway MySQL is ready)

```bash
# In your project directory
node scripts/setup-railway-database.js
```

## Step 3: Migrate XAMPP Data (If you have existing data)

```bash
# Make sure XAMPP is running first
node scripts/migrate-xampp-to-railway.js
```

## Step 4: Deploy to Railway

```bash
# Commit and push changes
git add .
git commit -m "Setup Railway database and file uploads"
git push origin main
```

## Step 5: Deploy to Vercel

Vercel automatically deploys when you push to GitHub main branch.

## Step 6: Test Everything

1. **Visit your live portfolio:**
   - https://anita-boke-portfolio.vercel.app

2. **Test contact form:**
   - Go to Contact section
   - Send a test message
   - Check wintahboke@gmail.com for the email

3. **Test resume upload:**
   - Upload a PDF resume
   - File will be stored at: https://my-portfolio-production-2f89.up.railway.app/uploads/resume-[timestamp].pdf

## File Storage URLs

Your uploaded files will be accessible at:
- **Resumes:** `https://my-portfolio-production-2f89.up.railway.app/uploads/resume-[timestamp].pdf`
- **Project Images:** `https://my-portfolio-production-2f89.up.railway.app/uploads/project-[timestamp].jpg`

## Troubleshooting

### If Railway deployment fails:
```bash
# Check Railway logs
railway logs

# Redeploy manually
railway up
```

### If emails don't work:
- Verify Gmail app password: `suoj rfnf lvhp basn`
- Check Railway environment variables
- Test locally first

### If file uploads fail:
- Check uploads/ directory exists
- Verify Railway storage permissions
- Check file size limits (10MB max)

## Database Schema

Your Railway database will have these tables:

1. **projects** - Project portfolio items
2. **messages** - Contact form submissions  
3. **resumes** - Uploaded resume files with URLs

Resume file URLs are stored in database and files served from Railway.