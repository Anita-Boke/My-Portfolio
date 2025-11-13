// Check deployment status for both Railway and Vercel
async function checkDeploymentStatus() {
    console.log('=== Checking Deployment Status ===\n');
    
    // Test Railway Backend
    console.log('1. Testing Railway Backend Deployment...');
    try {
        const railwayResponse = await fetch('https://my-portfolio-production-2f89.up.railway.app/api/github-repos');
        console.log(`   Railway Status: ${railwayResponse.status}`);
        
        if (railwayResponse.ok) {
            const data = await railwayResponse.json();
            console.log(`   ✅ Railway is working - returned ${data.length} repositories`);
        } else {
            const errorText = await railwayResponse.text();
            console.log(`   ⚠️  Railway has issues: ${errorText}`);
        }
    } catch (error) {
        console.log(`   ❌ Railway connection failed: ${error.message}`);
    }
    
    console.log('\n2. Testing Vercel Frontend Deployment...');
    try {
        const vercelResponse = await fetch('https://anita-boke-portfolio.vercel.app');
        console.log(`   Vercel Status: ${vercelResponse.status}`);
        
        if (vercelResponse.ok) {
            console.log('   ✅ Vercel frontend is deployed and accessible');
            
            // Check if the GitHub integration is working on Vercel
            console.log('\n3. Testing GitHub integration on Vercel frontend...');
            console.log('   Visit: https://anita-boke-portfolio.vercel.app');
            console.log('   Check the Projects section to see if GitHub repositories are loading');
        } else {
            console.log('   ❌ Vercel deployment has issues');
        }
    } catch (error) {
        console.log(`   ❌ Vercel connection failed: ${error.message}`);
    }
    
    console.log('\n4. Testing Direct GitHub API (baseline)...');
    try {
        const githubResponse = await fetch('https://api.github.com/users/Anita-Boke/repos?sort=updated&per_page=6&type=owner');
        console.log(`   GitHub API Status: ${githubResponse.status}`);
        
        if (githubResponse.ok) {
            const repos = await githubResponse.json();
            console.log(`   ✅ GitHub API working - ${repos.length} repositories available`);
        } else {
            console.log('   ❌ GitHub API has issues');
        }
    } catch (error) {
        console.log(`   ❌ GitHub API connection failed: ${error.message}`);
    }
    
    console.log('\n=== Deployment Status Summary ===');
    console.log('Latest changes pushed to GitHub:');
    console.log('✅ GitHub API fallback implementation');  
    console.log('✅ Node-fetch dependency added');
    console.log('✅ Enhanced GitHub repository display');
    console.log('✅ Correct Railway URL configuration');
    console.log('✅ API routing fixes');
    
    console.log('\nDeployments should automatically update from GitHub:');
    console.log('🔄 Railway: Auto-deploys from main branch');
    console.log('🔄 Vercel: Auto-deploys from main branch');
    console.log('\nBoth should have the latest GitHub integration features!');
}

checkDeploymentStatus();