const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const emailService = require('./services/emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
};

let db;

async function initializeDatabase() {
  try {
    // Create connection without database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Now connect to the database
    db = await mysql.createConnection(dbConfig);
    
    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        github_url VARCHAR(255),
        live_url VARCHAR(255),
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, 'resume-' + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === 'projectImage') {
      cb(null, 'project-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for resume!'), false);
      }
    } else if (file.fieldname === 'projectImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', upload.single('projectImage'), async (req, res) => {
  try {
    const { title, description, github_url, live_url, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.execute(
      'INSERT INTO projects (title, description, image, github_url, live_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, github_url, live_url, tags]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', upload.single('projectImage'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, github_url, live_url, tags } = req.body;
    
    // Get current project data
    const [currentProject] = await db.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (currentProject.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Use new image if uploaded, otherwise keep existing
    const image = req.file ? `/uploads/${req.file.filename}` : currentProject[0].image;

    const [result] = await db.execute(
      'UPDATE projects SET title = ?, description = ?, image = ?, github_url = ?, live_url = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, image, github_url, live_url, tags, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to database
    await db.execute(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    // Send email notifications
    await emailService.sendAdminNotification({ name, email, message });
    await emailService.sendThankYouEmail(email, name);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/resume/current', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM resumes ORDER BY uploaded_at DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No resume found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching current resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

app.get('/api/resume/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    // Get original filename from database
    const [rows] = await db.execute(
      'SELECT original_name FROM resumes WHERE filename = ?',
      [filename]
    );

    const originalName = rows.length > 0 ? rows[0].original_name : filename;

    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

app.get('/api/resume/view/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error viewing resume:', error);
    res.status(500).json({ error: 'Failed to view resume' });
  }
});

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await db.execute(
      'INSERT INTO resumes (filename, original_name) VALUES (?, ?)',
      [req.file.filename, req.file.originalname]
    );

    res.json({ 
      success: true, 
      message: 'Resume uploaded successfully!',
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

app.get('/api/github-repos', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.github.com/users/Anita-Boke/repos?sort=updated&per_page=6');
    const repos = await response.json();
    res.json(repos);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database and start server
initializeDatabase().then(() => {
  // Initialize email service
  emailService.initialize().then(() => {
    console.log('✅ Email server is ready to send messages');
  }).catch(err => {
    console.log('⚠️  Email service initialization failed:', err.message);
  });

  app.listen(PORT, () => {
    console.log(`Portfolio app running on http://localhost:${PORT}`);
  });
});
