// Test GitHub repositories functionality
async function testGitHubRepos() {
    const RAILWAY_URL = 'https://my-portfolio-production-2f89.up.railway.app';
    
    try {
        console.log('Testing GitHub repositories endpoint...');
        
        const response = await fetch(`${RAILWAY_URL}/api/github-repos`);
        console.log('GitHub repos status:', response.status);
        
        if (response.ok) {
            const repos = await response.json();
            console.log(`Found ${repos.length} repositories`);
            
            if (repos.length > 0) {
                console.log('\nRepository details:');
                repos.forEach((repo, index) => {
                    console.log(`${index + 1}. ${repo.name}`);
                    console.log(`   Description: ${repo.description || 'No description'}`);
                    console.log(`   Language: ${repo.language || 'Not specified'}`);
                    console.log(`   Stars: ${repo.stargazers_count}`);
                    console.log(`   Topics: ${repo.topics.join(', ') || 'None'}`);
                    console.log(`   URL: ${repo.html_url}`);
                    console.log(`   Homepage: ${repo.homepage || 'No homepage'}`);
                    console.log(`   Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
                    console.log('');
                });
            }
        } else {
            const errorText = await response.text();
            console.error('GitHub API error:', response.status, response.statusText);
            console.error('Error details:', errorText);
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testGitHubRepos();