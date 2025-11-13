// Wait for Railway deployment and test upload
async function testAfterDeployment() {
    console.log('⏳ Waiting 60 seconds for Railway to redeploy with database fixes...');
    
    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    console.log('🧪 Testing database endpoints after fix...');
    
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    // Test endpoints
    const endpoints = [
        '/api/resume/current',
        '/api/resumes', 
        '/api/messages'
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${RAILWAY_URL}${endpoint}`);
            console.log(`${endpoint}: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`${endpoint}: ✅ Working - Response keys:`, Object.keys(data));
            } else {
                const error = await response.text();
                console.log(`${endpoint}: ❌`, error.substring(0, 150));
            }
        } catch (e) {
            console.log(`${endpoint}: ❌ Network error:`, e.message);
        }
    }
    
    console.log('\n📄 Now try uploading your resume at:');
    console.log('https://anita-boke-portfolio.vercel.app');
    console.log('Look for the Resume section and click "Upload New Resume"');
}

testAfterDeployment();