// Test Railway deployment status
const https = require('https');

function testUrl(url) {
    return new Promise((resolve, reject) => {
        console.log(`Testing: ${url}`);
        
        const options = {
            method: 'GET',
            timeout: 10000
        };
        
        const req = https.request(url, options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers:`, res.headers);
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (data.length > 0) {
                    console.log(`Response (first 200 chars): ${data.substring(0, 200)}...`);
                }
                resolve(res.statusCode);
            });
        });
        
        req.on('error', (err) => {
            console.error(`Request error: ${err.message}`);
            reject(err);
        });
        
        req.on('timeout', () => {
            console.error('Request timeout');
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

async function main() {
    try {
        await testUrl('https://web-production-f7ac4.up.railway.app');
    } catch (error) {
        console.error('Failed to connect:', error.message);
    }
}

main();