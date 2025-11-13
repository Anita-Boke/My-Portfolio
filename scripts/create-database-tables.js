const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabaseTables() {
    console.log('🗄️ Creating database tables for Railway MySQL...');
    
    let connection;
    
    try {
        // Connect to Railway database
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) {
            const url = new URL(process.env.DATABASE_URL);
            const dbConfig = {
                host: url.hostname,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1),
                port: url.port || 3306,
                ssl: { rejectUnauthorized: false }
            };
            
            connection = await mysql.createConnection(dbConfig);
            console.log('✅ Connected to Railway MySQL database');
        } else {
            console.log('❌ DATABASE_URL not found. Make sure Railway MySQL addon is configured.');
            return;
        }
        
        // 1. Create RESUMES table
        console.log('📄 Creating resumes table...');
        await connection.execute(`
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
        console.log('✅ Resumes table created successfully');
        
        // 2. Create MESSAGES table  
        console.log('💬 Creating messages table...');
        await connection.execute(`
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
        console.log('✅ Messages table created successfully');
        
        // 3. Create PROJECTS table (for future use)
        console.log('🚀 Creating projects table...');
        await connection.execute(`
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
        console.log('✅ Projects table created successfully');
        
        // 4. Check existing data
        console.log('\n📊 Checking table contents...');
        
        const [resumeCount] = await connection.execute('SELECT COUNT(*) as count FROM resumes');
        const [messageCount] = await connection.execute('SELECT COUNT(*) as count FROM messages');  
        const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
        
        console.log(`📄 Resumes: ${resumeCount[0].count} records`);
        console.log(`💬 Messages: ${messageCount[0].count} records`);
        console.log(`🚀 Projects: ${projectCount[0].count} records`);
        
        // 5. Create sample data if needed
        if (resumeCount[0].count === 0) {
            console.log('\n📝 Adding sample resume placeholder...');
            await connection.execute(`
                INSERT INTO resumes (
                    filename, 
                    original_name, 
                    file_path, 
                    file_url, 
                    is_current
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    'sample-resume.pdf',
                    'Sample Resume.pdf',
                    'uploads/sample-resume.pdf',
                    'https://my-portfolio-production-2f89.up.railway.app/uploads/sample-resume.pdf',
                    true
                ]
            );
            console.log('✅ Sample resume record created');
        }
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Table Schema Summary:');
        console.log('┌─────────────────────────────────────────────────────────────┐');
        console.log('│ RESUMES TABLE                                               │');
        console.log('├─────────────────────────────────────────────────────────────┤');
        console.log('│ • Stores uploaded resume files                             │');
        console.log('│ • Only one resume marked as "current" at a time            │');
        console.log('│ • Tracks file path, URL, size, and upload date             │');
        console.log('│ • Supports PDF files with metadata                         │');
        console.log('└─────────────────────────────────────────────────────────────┘');
        
        console.log('┌─────────────────────────────────────────────────────────────┐');
        console.log('│ MESSAGES TABLE                                              │');
        console.log('├─────────────────────────────────────────────────────────────┤');
        console.log('│ • Stores contact form submissions                          │');
        console.log('│ • Tracks message status (new/read/replied)                 │');
        console.log('│ • Includes sender details and timestamps                   │');
        console.log('│ • Optional IP and user agent tracking                      │');
        console.log('└─────────────────────────────────────────────────────────────┘');
        
    } catch (error) {
        console.error('❌ Database setup error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the setup
createDatabaseTables();