# PlanetScale Database Setup Guide

## 🚀 Setting up PlanetScale for Your Portfolio

### Step 1: Create PlanetScale Account
1. Go to [https://planetscale.com](https://planetscale.com)
2. Sign up for a free account
3. Click "Create database"
4. Name your database: `portfolio`
5. Select region closest to your users

### Step 2: Get Connection Details
1. In your PlanetScale dashboard, go to your `portfolio` database
2. Click on "Connect" button
3. Select "Connect with: Node.js"
4. Copy the connection details

### Step 3: Update Environment Variables

#### For Local Development (.env file):
```
PLANETSCALE_HOST=aws.connect.psdb.cloud
PLANETSCALE_USERNAME=your-username-here
PLANETSCALE_PASSWORD=pscale_pw_your-password-here
PLANETSCALE_DATABASE=portfolio
```

#### For Vercel Production:
Run these commands in your terminal:

```bash
vercel env add PLANETSCALE_HOST
# Enter: aws.connect.psdb.cloud

vercel env add PLANETSCALE_USERNAME  
# Enter: your-username-here

vercel env add PLANETSCALE_PASSWORD
# Enter: pscale_pw_your-password-here

vercel env add PLANETSCALE_DATABASE
# Enter: portfolio
```

### Step 4: Initialize Database Tables
The database tables will be automatically created when you first deploy:
- `projects` - Store your portfolio projects
- `messages` - Store contact form submissions  
- `resumes` - Store resume information

### Step 5: Deploy
```bash
git add .
git commit -m "Add PlanetScale database integration"
git push
vercel --prod
```

## 🎯 Benefits of PlanetScale:
- ✅ Serverless MySQL database
- ✅ Automatic scaling
- ✅ Built-in branching for database schema changes
- ✅ Free tier: 1 database, 1GB storage, 1 billion row reads/month
- ✅ Perfect for portfolio sites
- ✅ Works seamlessly with Vercel

## 🔄 Migration from Local Database:
Once PlanetScale is set up, your portfolio will:
1. Try to connect to PlanetScale first
2. Fall back to JSON files if database is unavailable
3. Store all new data (projects, messages) in PlanetScale
4. Enable full CRUD operations for your projects

## 📊 What Gets Stored:
- **Projects**: All your GitHub projects with descriptions
- **Contact Messages**: Form submissions from visitors
- **Resume Info**: Metadata about uploaded resumes