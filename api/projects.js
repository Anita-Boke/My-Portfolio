const { getConnection } = require('../lib/database');
const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Try to get projects from PlanetScale database first
      try {
        const db = await getConnection();
        const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
        
        if (rows.length > 0) {
          res.status(200).json(rows);
          return;
        }
      } catch (dbError) {
        console.log('Database not available, using JSON fallback');
      }

      // Fallback to JSON file
      const projectsPath = path.join(process.cwd(), 'public', 'projects.json');
      const projectsData = await fs.readFile(projectsPath, 'utf8');
      const projects = JSON.parse(projectsData);
      
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}