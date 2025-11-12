const mysql = require('mysql2/promise');

const main = async () => {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'portfolio_db'
    });

    console.log('✅ Database connected successfully');
    
    // Check if resumes table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'resumes'");
    if (tables.length === 0) {
      console.log('❌ Resumes table does not exist');
      await db.end();
      return;
    }
    
    console.log('✅ Resumes table exists');
    
    // Check resume count
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM resumes');
    console.log('📊 Resume count:', rows[0].count);
    
    // Get latest resume
    const [latest] = await db.execute('SELECT * FROM resumes ORDER BY upload_date DESC LIMIT 1');
    if (latest.length > 0) {
      console.log('📄 Latest resume:', {
        id: latest[0].id,
        original_name: latest[0].original_name,
        filename: latest[0].filename,
        upload_date: latest[0].upload_date
      });
    } else {
      console.log('📄 No resumes found');
    }
    
    await db.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
};

main();