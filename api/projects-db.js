const { getConnection } = require('../lib/database');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getConnection();

    if (req.method === 'GET') {
      // Fetch all projects
      const [rows] = await db.execute(
        'SELECT * FROM projects ORDER BY created_at DESC'
      );
      res.status(200).json(rows);
    } 
    
    else if (req.method === 'POST') {
      // Create new project
      const { title, description, image, github_url, live_url, tags } = req.body;
      
      const [result] = await db.execute(
        'INSERT INTO projects (title, description, image, github_url, live_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, image, github_url, live_url, tags]
      );

      res.status(201).json({ 
        success: true, 
        id: result.insertId,
        message: 'Project created successfully' 
      });
    }
    
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    
    // Fallback to JSON file if database fails
    if (req.method === 'GET') {
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const projectsPath = path.join(process.cwd(), 'public', 'projects.json');
        const projectsData = await fs.readFile(projectsPath, 'utf8');
        const projects = JSON.parse(projectsData);
        res.status(200).json(projects);
      } catch (fileError) {
        res.status(500).json({ error: 'Failed to fetch projects' });
      }
    } else {
      res.status(500).json({ error: 'Database operation failed' });
    }
  }
}