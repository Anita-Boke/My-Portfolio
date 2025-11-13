const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const emailService = require('./services/emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration for Vercel frontend + Railway backend
const cors = require('cors');
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://anita-boke-portfolio-*.vercel.app',
    'https://*.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection - Railway compatible
let dbConfig;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) {
  // Railway MySQL connection string
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      port: url.port || 3306,
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: {
        rejectUnauthorized: false
      }
    };
  } catch (error) {
    console.log('⚠️ Invalid DATABASE_URL, using local configuration');
    dbConfig = null;
  }
} else {
  // Local development
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
  };
}

let db;

async function initializeDatabase() {
  try {
    // Only try to connect if we have a valid database configuration
    if (dbConfig && dbConfig.host !== 'localhost') {
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
    } else {
      console.log('⚠️ Using localhost - Database disabled for production deployment');
      console.log('📄 Using JSON files as data source');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📄 Falling back to JSON files as data source');
    db = null;
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

// Database Setup Endpoint (for remote table creation)
app.post('/api/setup-database', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    console.log('🗄️ Creating database tables remotely...');
    
    // Create RESUMES table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INT DEFAULT NULL,
        mime_type VARCHAR(100) DEFAULT 'application/pdf',
        is_current BOOLEAN DEFAULT FALSE,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_is_current (is_current),
        INDEX idx_uploaded_at (uploaded_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create MESSAGES table  
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        ip_address VARCHAR(45) DEFAULT NULL,
        user_agent TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Update PROJECTS table (add missing columns)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500) DEFAULT NULL,
        github_url VARCHAR(500) DEFAULT NULL,
        live_url VARCHAR(500) DEFAULT NULL,
        tags TEXT DEFAULT NULL,
        language VARCHAR(100) DEFAULT NULL,
        stars INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_github_sync BOOLEAN DEFAULT TRUE,
        github_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_featured (is_featured),
        INDEX idx_github_sync (is_github_sync),
        INDEX idx_github_id (github_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Database tables created successfully');
    
    res.json({ 
      success: true, 
      message: 'Database tables created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    res.status(500).json({ 
      error: 'Failed to setup database', 
      details: error.message 
    });
  }
});

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    if (db) {
      const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
      res.json(rows);
    } else {
      // Fallback to JSON file when database is not available
      try {
        const projectsData = await fs.readFile(path.join(__dirname, 'public', 'projects.json'), 'utf8');
        const projects = JSON.parse(projectsData);
        res.json(projects);
      } catch (fileError) {
        console.error('Error reading projects.json:', fileError);
        res.json([]); // Return empty array if no projects
      }
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to JSON file
    try {
      const projectsData = await fs.readFile(path.join(__dirname, 'public', 'projects.json'), 'utf8');
      const projects = JSON.parse(projectsData);
      res.json(projects);
    } catch (fileError) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
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

// Get all messages (for admin)
app.get('/api/messages', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const [rows] = await db.execute(`
      SELECT 
        id, name, email, message, status, created_at, updated_at
      FROM messages 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: rows.length,
      messages: rows
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const messageId = req.params.id;
    await db.execute(
      'UPDATE messages SET status = "read", updated_at = NOW() WHERE id = ?',
      [messageId]
    );

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

app.get('/api/resume/current', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    // Get the current resume (marked as is_current = TRUE)
    const [rows] = await db.execute(
      'SELECT * FROM resumes WHERE is_current = TRUE ORDER BY uploaded_at DESC LIMIT 1'
    );

    if (rows.length === 0) {
      // Fallback to most recent resume if no current is marked
      const [fallbackRows] = await db.execute(
        'SELECT * FROM resumes ORDER BY uploaded_at DESC LIMIT 1'
      );
      
      if (fallbackRows.length === 0) {
        return res.status(404).json({ error: 'No resume found' });
      }
      
      return res.json({
        ...fallbackRows[0],
        message: 'Showing most recent resume (no current resume marked)'
      });
    }

    res.json({
      ...rows[0],
      message: 'Current resume retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching current resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume', details: error.message });
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

// Get all resumes
app.get('/api/resumes', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const [rows] = await db.execute(`
      SELECT 
        id, filename, original_name, file_url, file_size, 
        is_current, uploaded_at
      FROM resumes 
      ORDER BY uploaded_at DESC
    `);

    res.json({
      success: true,
      count: rows.length,
      resumes: rows
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes', details: error.message });
  }
});

// Set resume as current
app.put('/api/resumes/:id/set-current', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const resumeId = req.params.id;
    
    // First, set all resumes as not current
    await db.execute('UPDATE resumes SET is_current = FALSE');
    
    // Then set the selected resume as current
    await db.execute(
      'UPDATE resumes SET is_current = TRUE, updated_at = NOW() WHERE id = ?',
      [resumeId]
    );

    res.json({ success: true, message: 'Resume set as current' });
  } catch (error) {
    console.error('Error setting resume as current:', error);
    res.status(500).json({ error: 'Failed to set resume as current' });
  }
});

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    // Create file URL for Railway deployment
    const baseUrl = process.env.RAILWAY_URL || `https://my-portfolio-production-2f89.up.railway.app`;
    const filePath = `uploads/${req.file.filename}`;
    const fileUrl = `${baseUrl}/${filePath}`;

    // Mark other resumes as not current
    await db.execute('UPDATE resumes SET is_current = FALSE');

    // Insert new resume record
    await db.execute(`
      INSERT INTO resumes (
        filename, 
        original_name, 
        file_path, 
        file_url, 
        file_size, 
        mime_type, 
        is_current
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [
        req.file.filename,
        req.file.originalname,
        filePath,
        fileUrl,
        req.file.size,
        req.file.mimetype
      ]
    );

    console.log(`✅ Resume uploaded: ${req.file.originalname} -> ${fileUrl}`);

    res.json({ 
      success: true, 
      message: 'Resume uploaded successfully!',
      filename: req.file.filename,
      file_url: fileUrl,
      file_path: filePath,
      original_name: req.file.originalname
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume', details: error.message });
  }
});

app.get('/api/github-repos', async (req, res) => {
  try {
    // Use built-in fetch (Node.js 18+) or fallback to node-fetch
    let fetch;
    try {
      fetch = globalThis.fetch;
    } catch (e) {
      fetch = (await import('node-fetch')).default;
    }
    
    // Fetch repositories with additional details
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Anita-Portfolio-App'
    };
    
    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    console.log('Fetching GitHub repositories for Anita-Boke...');
    
    const response = await fetch('https://api.github.com/users/Anita-Boke/repos?sort=updated&per_page=10&type=owner', {
      headers: headers
    });
    
    console.log('GitHub API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error response:', errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const repos = await response.json();
    console.log(`Found ${repos.length} repositories`);
    
    // Filter and enhance repository data
    const filteredRepos = repos
      .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || [],
        fork: repo.fork,
        archived: repo.archived,
        private: repo.private
      }));
    
    console.log(`Returning ${filteredRepos.length} filtered repositories`);
    res.json(filteredRepos);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub repositories', details: error.message });
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
