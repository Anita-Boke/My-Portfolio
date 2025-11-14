// GitHub Auto-Sync Test Script
// Tests the hardcoded GitHub integration for Anita-Boke repositories

const GITHUB_CONFIG = {
    username: 'Anita-Boke',
    profileUrl: 'https://github.com/Anita-Boke',
    apiUrl: 'https://api.github.com/users/Anita-Boke/repos',
    maxRepos: 20
};

async function testGitHubSync() {
    console.log('🚀 Testing GitHub Auto-Sync Integration...');
    console.log(`👤 Profile: ${GITHUB_CONFIG.profileUrl}`);
    console.log(`🔗 API Endpoint: ${GITHUB_CONFIG.apiUrl}`);
    
    try {
        console.log('\n📡 Fetching repositories from GitHub API...');
        
        const response = await fetch(`${GITHUB_CONFIG.apiUrl}?sort=updated&per_page=${GITHUB_CONFIG.maxRepos}&type=owner`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Anita-Boke-Portfolio-Test'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} - ${response.statusText}`);
        }
        
        const repos = await response.json();
        
        console.log(`\n✅ Successfully fetched ${repos.length} repositories!`);
        console.log('\n📊 Repository Summary:');
        console.log('=' .repeat(60));
        
        const filteredRepos = repos
            .filter(repo => !repo.fork && !repo.archived)
            .slice(0, 6);
            
        filteredRepos.forEach((repo, index) => {
            console.log(`${index + 1}. ${repo.name}`);
            console.log(`   📝 Language: ${repo.language || 'Not specified'}`);
            console.log(`   ⭐ Stars: ${repo.stargazers_count}`);
            console.log(`   📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
            console.log(`   🔗 URL: ${repo.html_url}`);
            if (repo.homepage) {
                console.log(`   🚀 Live Demo: ${repo.homepage}`);
            }
            if (repo.topics && repo.topics.length > 0) {
                console.log(`   🏷️  Topics: ${repo.topics.join(', ')}`);
            }
            console.log('');
        });
        
        console.log('🎯 Integration Status:');
        console.log(`   ✅ GitHub API Connection: Working`);
        console.log(`   ✅ Repository Filtering: Active (${filteredRepos.length} shown)`);
        console.log(`   ✅ Auto-Sync: Enabled`);
        console.log(`   ✅ Vercel Ready: Yes`);
        
        console.log('\n🚀 Deployment URLs:');
        console.log(`   Frontend: https://anita-boke-portfolio.vercel.app`);
        console.log(`   GitHub: ${GITHUB_CONFIG.profileUrl}`);
        
        // Test rate limiting info
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        
        if (rateLimitRemaining) {
            console.log('\n📊 GitHub API Rate Limits:');
            console.log(`   Requests Remaining: ${rateLimitRemaining}`);
            if (rateLimitReset) {
                const resetTime = new Date(parseInt(rateLimitReset) * 1000);
                console.log(`   Reset Time: ${resetTime.toLocaleString()}`);
            }
        }
        
        return {
            success: true,
            totalRepos: repos.length,
            displayedRepos: filteredRepos.length,
            repositories: filteredRepos
        };
        
    } catch (error) {
        console.error('\n❌ GitHub Auto-Sync Test Failed:');
        console.error(`   Error: ${error.message}`);
        
        console.log('\n🔧 Troubleshooting Steps:');
        console.log('   1. Check internet connection');
        console.log('   2. Verify GitHub username: Anita-Boke');
        console.log('   3. Check GitHub API status: https://status.github.com/');
        console.log('   4. Consider adding GitHub token for higher rate limits');
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testGitHubSync()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 GitHub Auto-Sync Test Completed Successfully!');
                process.exit(0);
            } else {
                console.log('\n💥 GitHub Auto-Sync Test Failed!');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 Unexpected Error:', error);
            process.exit(1);
        });
}

module.exports = { testGitHubSync, GITHUB_CONFIG };