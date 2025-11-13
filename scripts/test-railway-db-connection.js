// Test Railway database connection
require('dotenv').config();

async function testRailwayConnection() {
    console.log('🔍 Checking Railway database configuration...');
    
    console.log('Environment variables:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET');
    console.log('DB_HOST:', process.env.DB_HOST);
    
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mysql://user:password@host:port/database') {
        console.log('');
        console.log('❌ DATABASE_URL not configured properly');
        console.log('');
        console.log('🔧 STEPS TO FIX:');
        console.log('1. Go to Railway dashboard: https://railway.app');
        console.log('2. Open your project: my-portfolio-production-2f89');
        console.log('3. Click "New Service" → "Database" → "MySQL"');
        console.log('4. Wait for MySQL to deploy (2-3 minutes)');
        console.log('5. Railway will auto-generate DATABASE_URL variable');
        console.log('6. Then run this script again');
        console.log('');
        console.log('📝 After MySQL is added, you should see:');
        console.log('   Variables tab → DATABASE_URL → mysql://root:password@host:3306/railway');
        return;
    }
    
    try {
        const mysql = require('mysql2/promise');
        const url = new URL(process.env.DATABASE_URL);
        
        const connection = await mysql.createConnection({
            host: url.hostname,
            user: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            port: url.port || 3306,
            ssl: { rejectUnauthorized: false }
        });
        
        console.log('✅ Railway database connection successful!');
        console.log('Database host:', url.hostname);
        console.log('Database name:', url.pathname.slice(1));
        
        await connection.end();
        
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
    }
}

testRailwayConnection();