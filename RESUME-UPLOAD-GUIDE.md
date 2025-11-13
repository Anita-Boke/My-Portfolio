# 📄 How to Upload Your Resume from Your Laptop

## 🎯 **Step-by-Step Process:**

### **Method 1: Via Your Live Portfolio (Recommended)**

1. **Visit your portfolio:**
   ```
   https://anita-boke-portfolio.vercel.app
   ```

2. **Scroll down to the Resume section** (in the About/Contact area)

3. **Click "📎 Upload New Resume"**

4. **Select your PDF resume from your laptop**
   - Only PDF files are accepted
   - Maximum file size: 10MB
   - File should be named something like: `Anita-Boke-Resume.pdf`

5. **Wait for upload confirmation** ✅
   - You'll see: "Resume uploaded successfully!"
   - The file will be available at: `https://my-portfolio-production-2f89.up.railway.app/uploads/resume-[timestamp].pdf`

### **Method 2: Test Locally First**

1. **Start your local server:**
   ```bash
   npm start
   ```

2. **Open:** `http://localhost:3000`

3. **Upload your resume** using the same process

---

## 📋 **What Happens When You Upload:**

### **File Processing:**
```
Your Laptop Resume.pdf
    ↓
Upload to Railway Server
    ↓
Saved as: uploads/resume-1699876543210.pdf
    ↓
Database Record Created:
├── filename: "resume-1699876543210.pdf"
├── original_name: "Your Original Name.pdf"  
├── file_path: "uploads/resume-1699876543210.pdf"
├── file_url: "https://my-portfolio-production-2f89.up.railway.app/uploads/resume-1699876543210.pdf"
├── is_current: TRUE
└── uploaded_at: "2024-11-13 15:30:45"
```

### **Resume Management:**
- ✅ **Only ONE resume is "current" at any time**
- ✅ **Old resumes are kept but marked as not current**
- ✅ **Anyone can view/download via the public URL**
- ✅ **You can upload new versions anytime**

---

## 🔧 **Available Actions:**

### **After Upload:**
1. **👁️ View Resume** - Opens PDF in new tab
2. **📥 Download Resume** - Downloads file to visitor's computer
3. **📎 Upload New Resume** - Replace with newer version

### **For Visitors:**
- Can view your resume online
- Can download PDF directly
- Always get the most current version

---

## 🎯 **Resume File Requirements:**

### **✅ Supported:**
- **Format:** PDF only
- **Size:** Up to 10MB
- **Name:** Any name (will be preserved as original_name)

### **❌ Not Supported:**
- Word documents (.doc, .docx)
- Images (.jpg, .png)
- Text files (.txt)

---

## 🚀 **Your Resume URLs:**

### **Once uploaded, your resume will be available at:**
```
Direct URL: https://my-portfolio-production-2f89.up.railway.app/uploads/resume-[timestamp].pdf

API Endpoint: https://my-portfolio-production-2f89.up.railway.app/api/resume/current
```

### **Example URLs:**
- View: `https://my-portfolio-production-2f89.up.railway.app/uploads/resume-1699876543210.pdf`
- API: `https://my-portfolio-production-2f89.up.railway.app/api/resume/current`

---

## ⚡ **Quick Start:**

1. **Go to:** https://anita-boke-portfolio.vercel.app
2. **Find the Resume section**
3. **Click "Upload New Resume"**
4. **Choose your PDF from laptop**
5. **Done!** ✅ Your resume is now live on the cloud

**Your resume will be stored on Railway cloud servers and accessible worldwide!** 🌍