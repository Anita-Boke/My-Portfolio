export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // For demo purposes, return sample resume data
      // In a real implementation, this would come from a database
      const resumeData = {
        id: 1,
        filename: 'anita-boke-resume.pdf',
        original_name: 'Anita Boke - Software Developer Resume.pdf',
        uploaded_at: '2024-11-12T10:30:00Z',
        url: 'https://example.com/resume/anita-boke-resume.pdf', // Would be actual cloud storage URL
        size: '2.1 MB'
      };

      res.status(200).json({
        success: true,
        resume: resumeData
      });
    } catch (error) {
      console.error('Error fetching resume info:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch resume info' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}