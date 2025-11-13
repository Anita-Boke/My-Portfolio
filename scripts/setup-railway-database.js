const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupRailwayDatabase() {
    console.log('🚀 Setting up Railway MySQL database...');
    
    // Railway will automatically provide DATABASE_URL
    // Format: mysql://user:password@host:port/database
    
    let connection;
    try {
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) {
            // Parse Railway DATABASE_URL
            const url = new URL(process.env.DATABASE_URL);
            const dbConfig = {
                host: url.hostname,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1), // Remove leading slash
                port: url.port || 3306,
                ssl: { rejectUnauthorized: false }
            };
            
            connection = await mysql.createConnection(dbConfig);
            console.log('✅ Connected to Railway MySQL database');
        } else {
            console.log('❌ DATABASE_URL not found. Please set up Railway MySQL addon.');
            console.log('Go to Railway dashboard → Your project → Add MySQL addon');
            return;
        }
        
        // Create tables with proper structure
        console.log('📝 Creating database tables...');
        
        // Projects table
        await connection.execute(`
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
        console.log('✅ Projects table created');
        
        // Messages table (for contact form)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('new', 'read', 'replied') DEFAULT 'new'
            )
        `);
        console.log('✅ Messages table created');
        
        // Resumes table (stores file paths)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS resumes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_url VARCHAR(500) NOT NULL,
                file_size INT,
                mime_type VARCHAR(100),
                is_current BOOLEAN DEFAULT FALSE,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Resumes table created');
        
        // Insert sample data if needed
        const [projects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
        if (projects[0].count === 0) {
            console.log('📝 Adding sample project...');
            await connection.execute(`
                INSERT INTO projects (title, description, github_url, tags) VALUES
                ('Portfolio Website', 'Modern responsive portfolio with Node.js backend and MySQL database', 'https://github.com/Anita-Boke/My-Portfolio', 'JavaScript,Node.js,MySQL,HTML,CSS')
            `);
        }
        
        console.log('🎉 Database setup complete!');
        console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
        
    } catch (error) {
        console.error('❌ Database setup error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupRailwayDatabase();