// Test the database table creation and operations
async function testDatabaseOperations() {
    console.log('🧪 Testing database table operations...');
    
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    try {
        // 1. Test Messages endpoint (should work after tables are created)
        console.log('\n1. Testing messages endpoint...');
        const messagesResponse = await fetch(`${RAILWAY_URL}/api/messages`);
        console.log('Messages endpoint status:', messagesResponse.status);
        
        if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            console.log('✅ Messages table working - Count:', messagesData.count);
        } else {
            const error = await messagesResponse.text();
            console.log('❌ Messages error:', error);
        }
        
        // 2. Test Resumes endpoint
        console.log('\n2. Testing resumes endpoint...');
        const resumesResponse = await fetch(`${RAILWAY_URL}/api/resumes`);
        console.log('Resumes endpoint status:', resumesResponse.status);
        
        if (resumesResponse.ok) {
            const resumesData = await resumesResponse.json();
            console.log('✅ Resumes table working - Count:', resumesData.count);
        } else {
            const error = await resumesResponse.text();
            console.log('❌ Resumes error:', error);
        }
        
        // 3. Test current resume endpoint
        console.log('\n3. Testing current resume endpoint...');
        const currentResumeResponse = await fetch(`${RAILWAY_URL}/api/resume/current`);
        console.log('Current resume status:', currentResumeResponse.status);
        
        if (currentResumeResponse.ok) {
            const resumeData = await currentResumeResponse.json();
            console.log('✅ Current resume working:', resumeData.filename || 'No filename');
        } else {
            const error = await currentResumeResponse.text();
            console.log('❌ Current resume error:', error);
        }
        
        // 4. Test contact form (POST)
        console.log('\n4. Testing contact form submission...');
        const contactResponse = await fetch(`${RAILWAY_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message to verify the database is working properly.'
            })
        });
        console.log('Contact form status:', contactResponse.status);
        
        if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            console.log('✅ Contact form working:', contactData.message);
        } else {
            const error = await contactResponse.text();
            console.log('❌ Contact form error:', error);
        }
        
        console.log('\n🎯 Database Test Summary:');
        console.log('If all endpoints show ✅, your database tables are working correctly!');
        console.log('If you see ❌ errors, wait 2-3 minutes for Railway to deploy the database changes.');
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testDatabaseOperations();