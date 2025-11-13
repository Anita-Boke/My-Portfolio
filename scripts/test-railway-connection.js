// Test API connections to Railway backend
console.log('Testing API connections...');

// Test configuration
const RAILWAY_URL = 'https://web-production-f7ac4.up.railway.app';

async function testEndpoint(endpoint, method = 'GET') {
    try {
        console.log(`Testing ${method} ${RAILWAY_URL}${endpoint}...`);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        if (method === 'POST' && endpoint === '/api/contact') {
            options.body = JSON.stringify({
                name: 'Test',
                email: 'test@example.com',
                message: 'Test message'
            });
        }
        
        const response = await fetch(`${RAILWAY_URL}${endpoint}`, options);
        
        console.log(`${endpoint}: Status ${response.status}`);
        
        if (response.ok) {
            const data = await response.text();
            console.log(`${endpoint}: Response length: ${data.length} chars`);
            if (data.length < 500) {
                console.log(`${endpoint}: Response:`, data);
            }
        } else {
            console.error(`${endpoint}: Error - ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.error(`${endpoint}: Network error:`, error.message);
    }
}

async function runTests() {
    await testEndpoint('/api/projects');
    await testEndpoint('/api/resume');
    await testEndpoint('/github-repos');
    await testEndpoint('/api/contact', 'POST');
}

runTests();