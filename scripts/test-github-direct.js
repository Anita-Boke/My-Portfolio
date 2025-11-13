// Test GitHub API directly from frontend
async function testGitHubApiDirect() {
    try {
        console.log('Testing GitHub API directly...');
        
        const response = await fetch('https://api.github.com/users/Anita-Boke/repos?sort=updated&per_page=6&type=owner');
        console.log('Direct GitHub API status:', response.status);
        
        if (response.ok) {
            const repos = await response.json();
            console.log(`Found ${repos.length} repositories directly from GitHub`);
            
            const filteredRepos = repos.filter(repo => !repo.fork && !repo.archived);
            console.log(`After filtering: ${filteredRepos.length} repositories`);
            
            filteredRepos.forEach((repo, index) => {
                console.log(`${index + 1}. ${repo.name} (${repo.language || 'No language'}) - ${repo.stargazers_count} stars`);
            });
            
            return filteredRepos;
        } else {
            const errorData = await response.json();
            console.error('GitHub API error:', errorData);
        }
        
    } catch (error) {
        console.error('Direct GitHub API test error:', error.message);
    }
}

// Test both Railway endpoint and direct GitHub API
async function testBothApproaches() {
    console.log('=== Testing GitHub Repository Fetching ===\n');
    
    // Test direct GitHub API
    const directRepos = await testGitHubApiDirect();
    
    console.log('\n=== Testing Railway Backend Endpoint ===');
    
    // Test Railway endpoint  
    try {
        const railwayResponse = await fetch('https://my-portfolio-production-2f89.up.railway.app/api/github-repos');
        console.log('Railway endpoint status:', railwayResponse.status);
        
        if (railwayResponse.ok) {
            const railwayRepos = await railwayResponse.json();
            console.log(`Railway returned ${railwayRepos.length} repositories`);
        } else {
            const errorText = await railwayResponse.text();
            console.error('Railway error:', errorText);
        }
    } catch (error) {
        console.error('Railway test error:', error.message);
    }
}

testBothApproaches();