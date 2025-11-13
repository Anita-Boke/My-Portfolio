// Test Railway service status
async function testRailwayService() {
    const RAILWAY_URL = 'https://web-production-f7ac4.up.railway.app';
    
    try {
        console.log('Testing Railway service root endpoint...');
        const response = await fetch(RAILWAY_URL);
        console.log('Root status:', response.status);
        
        if (response.ok) {
            const text = await response.text();
            console.log('Root response:', text.substring(0, 200) + '...');
        } else {
            console.log('Root error:', response.statusText);
        }
        
        // Test health endpoint if it exists
        console.log('\nTesting health endpoint...');
        const healthResponse = await fetch(`${RAILWAY_URL}/health`);
        console.log('Health status:', healthResponse.status);
        
        if (healthResponse.ok) {
            const healthText = await healthResponse.text();
            console.log('Health response:', healthText);
        }
        
    } catch (error) {
        console.error('Railway service error:', error.message);
    }
}

testRailwayService();