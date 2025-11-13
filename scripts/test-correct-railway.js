// Test the correct Railway URL
async function testCorrectRailwayUrl() {
    const CORRECT_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    try {
        console.log('Testing correct Railway URL:', CORRECT_URL);
        
        // Test root endpoint
        const rootResponse = await fetch(CORRECT_URL);
        console.log('Root status:', rootResponse.status);
        
        if (rootResponse.ok) {
            const rootText = await rootResponse.text();
            console.log('Root response (first 200 chars):', rootText.substring(0, 200));
        }
        
        // Test API endpoints
        const endpoints = ['/api/projects', '/api/contact', '/api/resume', '/github-repos'];
        
        for (const endpoint of endpoints) {
            console.log(`\nTesting ${endpoint}...`);
            const response = await fetch(`${CORRECT_URL}${endpoint}`);
            console.log(`${endpoint}: Status ${response.status}`);
            
            if (response.ok) {
                const text = await response.text();
                console.log(`${endpoint}: Response length: ${text.length} chars`);
                if (text.length < 300) {
                    console.log(`${endpoint}: Response:`, text);
                }
            } else {
                console.log(`${endpoint}: Error - ${response.statusText}`);
            }
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testCorrectRailwayUrl();