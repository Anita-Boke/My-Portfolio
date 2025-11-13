// Test Railway database connection after deployment
async function testRailwayDatabaseAfterDeployment() {
    console.log('🔧 Testing Railway database endpoints after deployment...');
    
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    const endpoints = [
        '/api/projects',
        '/api/contact', 
        '/api/resume/current'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\nTesting ${endpoint}...`);
            
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // For contact endpoint, use POST
            if (endpoint === '/api/contact') {
                options.method = 'POST';
                options.body = JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com',
                    message: 'Test message from deployment check'
                });
            }
            
            const response = await fetch(`${RAILWAY_URL}${endpoint}`, options);
            console.log(`${endpoint}: Status ${response.status}`);
            
            if (response.ok) {
                const result = await response.text();
                console.log(`${endpoint}: ✅ Working - Response length: ${result.length} chars`);
                
                if (result.length < 500) {
                    console.log(`${endpoint}: Response preview:`, result.substring(0, 200));
                }
            } else {
                const error = await response.text();
                console.log(`${endpoint}: ❌ Error - ${response.status}`, error.substring(0, 200));
            }
            
        } catch (error) {
            console.log(`${endpoint}: ❌ Network error:`, error.message);
        }
    }
    
    console.log('\n🚀 Database deployment check complete!');
    console.log('If you see database connection errors, wait 2-3 minutes for Railway to fully deploy the MySQL service.');
}

testRailwayDatabaseAfterDeployment();