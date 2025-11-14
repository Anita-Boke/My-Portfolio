// Vercel Auto-Deploy Setup Script
// Configures and deploys the portfolio with GitHub auto-sync to Vercel

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERCEL_CONFIG = {
    projectName: 'anita-boke-portfolio',
    githubRepo: 'Anita-Boke/My-Portfolio',
    productionUrl: 'https://anita-boke-portfolio.vercel.app',
    framework: 'other'
};

function executeCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    try {
        const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
        console.log(`✅ ${description} completed successfully`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

function checkVercelCLI() {
    console.log('🔍 Checking Vercel CLI installation...');
    try {
        const version = execSync('vercel --version', { encoding: 'utf8' });
        console.log(`✅ Vercel CLI found: ${version.trim()}`);
        return true;
    } catch (error) {
        console.log('❌ Vercel CLI not found. Installing...');
        return executeCommand('npm install -g vercel', 'Installing Vercel CLI');
    }
}

function validateProjectStructure() {
    console.log('\n🔍 Validating project structure...');
    
    const requiredFiles = [
        'package.json',
        'vercel.json',
        'public/index.html',
        'public/script.js',
        'public/styles.css',
        'server.js'
    ];
    
    let isValid = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} (missing)`);
            isValid = false;
        }
    });
    
    return isValid;
}

function checkGitHubIntegration() {
    console.log('\n🔍 Verifying GitHub integration...');
    
    const scriptPath = path.join('public', 'script.js');
    if (!fs.existsSync(scriptPath)) {
        console.log('❌ script.js not found');
        return false;
    }
    
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    const checks = [
        { pattern: /Anita-Boke/, name: 'Hardcoded GitHub username' },
        { pattern: /github\.com\/users\/Anita-Boke/, name: 'GitHub API endpoint' },
        { pattern: /autoRefresh.*true/, name: 'Auto-refresh enabled' },
        { pattern: /fetchProjects/, name: 'Project fetching function' }
    ];
    
    let allChecksPass = true;
    
    checks.forEach(check => {
        if (check.pattern.test(scriptContent)) {
            console.log(`   ✅ ${check.name}`);
        } else {
            console.log(`   ❌ ${check.name}`);
            allChecksPass = false;
        }
    });
    
    return allChecksPass;
}

function displayDeploymentInfo() {
    console.log('\n📊 Deployment Configuration:');
    console.log('=' .repeat(50));
    console.log(`Project Name: ${VERCEL_CONFIG.projectName}`);
    console.log(`GitHub Repository: ${VERCEL_CONFIG.githubRepo}`);
    console.log(`Production URL: ${VERCEL_CONFIG.productionUrl}`);
    console.log(`Framework: ${VERCEL_CONFIG.framework}`);
    
    console.log('\n🔗 GitHub Auto-Sync:');
    console.log(`Profile: https://github.com/Anita-Boke`);
    console.log(`API: https://api.github.com/users/Anita-Boke/repos`);
    console.log(`Auto-Refresh: Every 5 minutes`);
    console.log(`Max Repositories: 20 (filtered to 6 display)`);
}

async function deployToVercel() {
    console.log('\n🚀 Starting Vercel deployment...');
    
    // Step 1: Check CLI
    if (!checkVercelCLI()) {
        console.log('❌ Cannot proceed without Vercel CLI');
        return false;
    }
    
    // Step 2: Validate structure
    if (!validateProjectStructure()) {
        console.log('❌ Project structure validation failed');
        return false;
    }
    
    // Step 3: Check GitHub integration
    if (!checkGitHubIntegration()) {
        console.log('❌ GitHub integration validation failed');
        return false;
    }
    
    // Step 4: Display info
    displayDeploymentInfo();
    
    // Step 5: Deploy
    console.log('\n🚀 Deploying to Vercel...');
    
    const deploySuccess = executeCommand(
        'vercel --prod --confirm',
        'Deploying to production'
    );
    
    if (deploySuccess) {
        console.log('\n🎉 Deployment Successful!');
        console.log('\n📱 Your Portfolio URLs:');
        console.log(`   Production: ${VERCEL_CONFIG.productionUrl}`);
        console.log(`   GitHub: https://github.com/${VERCEL_CONFIG.githubRepo}`);
        
        console.log('\n🔄 Auto-Sync Status:');
        console.log('   ✅ GitHub repositories will auto-update every 5 minutes');
        console.log('   ✅ New commits will trigger automatic redeployment');
        console.log('   ✅ No manual intervention required');
        
        console.log('\n📊 Next Steps:');
        console.log('   1. Visit your live portfolio');
        console.log('   2. Check that GitHub repositories are loading');
        console.log('   3. Test the contact form and resume upload');
        console.log('   4. Monitor Vercel dashboard for deployment status');
        
        return true;
    } else {
        console.log('\n❌ Deployment failed. Check the logs above for details.');
        return false;
    }
}

// Preview deployment
async function deployPreview() {
    console.log('\n👀 Creating preview deployment...');
    
    const previewSuccess = executeCommand(
        'vercel',
        'Creating preview deployment'
    );
    
    if (previewSuccess) {
        console.log('\n✅ Preview deployment created!');
        console.log('Check the Vercel dashboard for the preview URL.');
    }
    
    return previewSuccess;
}

// Main execution
async function main() {
    console.log('🚀 Vercel + GitHub Auto-Sync Deployment');
    console.log('=' .repeat(50));
    
    const args = process.argv.slice(2);
    const command = args[0] || 'deploy';
    
    switch (command) {
        case 'deploy':
        case 'prod':
            await deployToVercel();
            break;
            
        case 'preview':
            await deployPreview();
            break;
            
        case 'validate':
            console.log('\n🔍 Validation Mode');
            validateProjectStructure();
            checkGitHubIntegration();
            displayDeploymentInfo();
            break;
            
        default:
            console.log('\nUsage:');
            console.log('  node scripts/vercel-deploy.js [command]');
            console.log('\nCommands:');
            console.log('  deploy, prod - Deploy to production');
            console.log('  preview      - Create preview deployment');
            console.log('  validate     - Validate project structure');
            break;
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('\n💥 Deployment script failed:', error);
        process.exit(1);
    });
}

module.exports = {
    deployToVercel,
    deployPreview,
    validateProjectStructure,
    checkGitHubIntegration,
    VERCEL_CONFIG
};