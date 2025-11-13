// Test specific Railway endpoints that should exist
async function testSpecificEndpoints() {
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    const endpointsToTest = [
        { path: '/api/contact', method: 'POST', data: { name: 'Test', email: 'test@example.com', message: 'Test message' }},
        { path: '/api/resume/current', method: 'GET' },
        { path: '/api/github-repos', method: 'GET' }
    ];
    
    for (const endpoint of endpointsToTest) {
        try {
            console.log(`\nTesting ${endpoint.method} ${endpoint.path}...`);
            
            const options = {
                method: endpoint.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            if (endpoint.data) {
                options.body = JSON.stringify(endpoint.data);
            }
            
            const response = await fetch(`${RAILWAY_URL}${endpoint.path}`, options);
            console.log(`${endpoint.path}: Status ${response.status}`);
            
            if (response.ok) {
                const text = await response.text();
                console.log(`${endpoint.path}: Success - Response length: ${text.length} chars`);
                if (text.length < 300) {
                    console.log(`${endpoint.path}: Response:`, text);
                }
            } else {
                const errorText = await response.text();
                console.log(`${endpoint.path}: Error - ${response.status} ${response.statusText}`);
                if (errorText) {
                    console.log(`${endpoint.path}: Error details:`, errorText.substring(0, 200));
                }
            }
            
        } catch (error) {
            console.error(`${endpoint.path}: Network error:`, error.message);
        }
    }
}

testSpecificEndpoints();