const mysql = require('mysql2/promise');

// PlanetScale database configuration
const dbConfig = {
  host: process.env.PLANETSCALE_HOST || process.env.DB_HOST,
  username: process.env.PLANETSCALE_USERNAME || process.env.DB_USER,
  password: process.env.PLANETSCALE_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.PLANETSCALE_DATABASE || process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  },
  // PlanetScale specific settings
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

let connection = null;

async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('✅ Connected to PlanetScale database');
    } catch (error) {
      console.error('❌ PlanetScale connection failed:', error.message);
      throw error;
    }
  }
  return connection;
}

async function initializeDatabase() {
  try {
    const db = await getConnection();
    
    // Create projects table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        github_url VARCHAR(500),
        live_url VARCHAR(500),
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create messages table for contact form
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create resumes table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

module.exports = {
  getConnection,
  initializeDatabase
};