const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateXAMPPToRailway() {
    console.log('🔄 Starting XAMPP to Railway migration...');

    let xamppConnection, railwayConnection;

    try {
        // Connect to XAMPP (local)
        console.log('📡 Connecting to XAMPP database...');
        xamppConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Your XAMPP password
            database: 'portfolio_db'
        });
        console.log('✅ Connected to XAMPP');

        // Connect to Railway
        console.log('📡 Connecting to Railway database...');
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not found. Set up Railway MySQL addon first.');
        }

        const url = new URL(process.env.DATABASE_URL);
        railwayConnection = await mysql.createConnection({
            host: url.hostname,
            user: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            port: url.port || 3306,
            ssl: { rejectUnauthorized: false }
        });
        console.log('✅ Connected to Railway');

        // Migrate Projects
        console.log('📦 Migrating projects...');
        const [projects] = await xamppConnection.execute('SELECT * FROM projects');
        
        for (const project of projects) {
            await railwayConnection.execute(`
                INSERT IGNORE INTO projects 
                (id, title, description, image, github_url, live_url, tags, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                project.id,
                project.title,
                project.description,
                project.image,
                project.github_url,
                project.live_url,
                project.tags,
                project.created_at,
                project.updated_at
            ]);
        }
        console.log(`✅ Migrated ${projects.length} projects`);

        // Migrate Messages
        console.log('📦 Migrating messages...');
        try {
            const [messages] = await xamppConnection.execute('SELECT * FROM messages');
            
            for (const message of messages) {
                await railwayConnection.execute(`
                    INSERT IGNORE INTO messages 
                    (id, name, email, message, created_at, status) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    message.id,
                    message.name,
                    message.email,
                    message.message,
                    message.created_at,
                    message.status || 'new'
                ]);
            }
            console.log(`✅ Migrated ${messages.length} messages`);
        } catch (e) {
            console.log('⚠️ Messages table not found in XAMPP or empty');
        }

        // Migrate Resumes
        console.log('📦 Migrating resumes...');
        try {
            const [resumes] = await xamppConnection.execute('SELECT * FROM resumes');
            
            for (const resume of resumes) {
                // Update file URLs for Railway
                const railwayUrl = 'https://my-portfolio-production-2f89.up.railway.app';
                const newFileUrl = `${railwayUrl}/uploads/${resume.filename}`;
                
                await railwayConnection.execute(`
                    INSERT IGNORE INTO resumes 
                    (id, filename, original_name, file_path, file_url, file_size, mime_type, is_current, uploaded_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    resume.id,
                    resume.filename,
                    resume.original_name,
                    resume.file_path || `uploads/${resume.filename}`,
                    newFileUrl,
                    resume.file_size,
                    resume.mime_type,
                    resume.is_current,
                    resume.uploaded_at
                ]);
            }
            console.log(`✅ Migrated ${resumes.length} resumes`);
        } catch (e) {
            console.log('⚠️ Resumes table not found in XAMPP or empty');
        }

        console.log('🎉 Migration completed successfully!');
        
        // Verify migration
        const [railwayProjects] = await railwayConnection.execute('SELECT COUNT(*) as count FROM projects');
        const [railwayMessages] = await railwayConnection.execute('SELECT COUNT(*) as count FROM messages');
        const [railwayResumes] = await railwayConnection.execute('SELECT COUNT(*) as count FROM resumes');
        
        console.log('📊 Migration Summary:');
        console.log(`   Projects: ${railwayProjects[0].count}`);
        console.log(`   Messages: ${railwayMessages[0].count}`);
        console.log(`   Resumes: ${railwayResumes[0].count}`);

    } catch (error) {
        console.error('❌ Migration error:', error.message);
    } finally {
        if (xamppConnection) await xamppConnection.end();
        if (railwayConnection) await railwayConnection.end();
    }
}

// Run migration
migrateXAMPPToRailway();