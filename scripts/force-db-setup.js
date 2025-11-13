// Force database table creation via Railway API call
async function forceCreateDatabaseTables() {
    console.log('🔧 Forcing database table creation on Railway...');
    
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    try {
        // Create a special endpoint call to trigger table creation
        console.log('📡 Sending table creation request to Railway...');
        
        const response = await fetch(`${RAILWAY_URL}/api/setup-database`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                action: 'create_tables',
                force: true 
            })
        });
        
        console.log('Setup response status:', response.status);
        
        if (response.ok) {
            const result = await response.text();
            console.log('✅ Database setup response:', result);
        } else {
            const error = await response.text();
            console.log('❌ Setup failed:', error);
        }
        
        // Wait a moment then test again
        console.log('\n⏳ Waiting 5 seconds for database setup to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test endpoints again
        console.log('\n🧪 Testing after setup attempt...');
        
        const testEndpoints = ['/api/resumes', '/api/messages', '/api/resume/current'];
        
        for (const endpoint of testEndpoints) {
            try {
                const testResponse = await fetch(`${RAILWAY_URL}${endpoint}`);
                console.log(`${endpoint}: ${testResponse.status}`);
                
                if (testResponse.ok) {
                    console.log(`${endpoint}: ✅ Working`);
                } else {
                    const errorText = await testResponse.text();
                    console.log(`${endpoint}: ❌`, errorText.substring(0, 100));
                }
            } catch (e) {
                console.log(`${endpoint}: ❌ Network error`);
            }
        }
        
    } catch (error) {
        console.error('❌ Force setup error:', error.message);
    }
}

forceCreateDatabaseTables();