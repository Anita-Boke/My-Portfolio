// GitHub Webhook Handler for Instant Portfolio Updates
// Automatically refreshes portfolio when repositories change

let githubWebhookCache = {
    lastUpdate: null,
    repositories: [],
    updateInProgress: false
};

// Enhanced GitHub fetch with caching
async function fetchGitHubRepositoriesWithCache(force = false) {
    const cacheKey = 'github_repos_cache';
    const cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Check if we should use cache
    if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const cacheData = JSON.parse(cached);
            const isExpired = Date.now() - cacheData.timestamp > cacheTimeout;
            
            if (!isExpired) {
                console.log('📦 Using cached GitHub data');
                return cacheData.repositories;
            }
        }
    }
    
    try {
        console.log('🔄 Fetching fresh GitHub data...');
        
        const response = await fetch(`${GITHUB_CONFIG.apiUrl}?sort=updated&per_page=${GITHUB_CONFIG.maxRepos}&type=owner&timestamp=${Date.now()}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Anita-Boke-Portfolio',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const repositories = await response.json();
        
        // Cache the results
        const cacheData = {
            repositories,
            timestamp: Date.now(),
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        githubWebhookCache.repositories = repositories;
        githubWebhookCache.lastUpdate = new Date();
        
        console.log(`✅ Cached ${repositories.length} repositories`);
        return repositories;
        
    } catch (error) {
        console.error('❌ GitHub fetch failed:', error);
        
        // Fallback to cache if available
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            console.log('📦 Falling back to cached data');
            return JSON.parse(cached).repositories;
        }
        
        throw error;
    }
}

// Simulate GitHub webhook for instant updates
function simulateGitHubWebhook() {
    console.log('🔔 Simulating GitHub webhook...');
    
    if (githubWebhookCache.updateInProgress) {
        console.log('⏳ Update already in progress...');
        return;
    }
    
    githubWebhookCache.updateInProgress = true;
    
    fetchGitHubRepositoriesWithCache(true)
        .then(repos => {
            console.log('🔄 Refreshing portfolio with latest repositories...');
            displayRepositories(repos);
            
            // Show update notification
            showUpdateNotification('Portfolio updated with latest GitHub repositories!');
            
            githubWebhookCache.updateInProgress = false;
        })
        .catch(error => {
            console.error('❌ Webhook simulation failed:', error);
            githubWebhookCache.updateInProgress = false;
        });
}

// Display repositories with enhanced formatting
function displayRepositories(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    // Filter and format repositories
    const projects = repos
        .filter(repo => !repo.fork && !repo.archived)
        .slice(0, 6)
        .map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'A software project showcasing development skills',
            github_url: repo.html_url,
            live_url: repo.homepage || null,
            language: repo.language,
            stars: repo.stargazers_count || 0,
            updated_at: repo.updated_at,
            topics: repo.topics || [],
            isNew: isRepositoryNew(repo.updated_at)
        }));
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card ${project.isNew ? 'project-new' : ''}">
            <div class="project-image">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-size: 3rem;">
                    ${getLanguageEmoji(project.language)}
                </div>
                ${project.isNew ? '<div class="project-new-badge">🆕 New</div>' : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-meta">
                    ${project.language ? `<span class="project-language">📝 ${project.language}</span>` : ''}
                    <span class="project-stars">⭐ ${project.stars}</span>
                </div>
                ${project.topics.length > 0 ? `
                    <div class="project-tags">
                        ${project.topics.map(topic => `<span class="project-tag">${escapeHtml(topic)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="project-links">
                    <a href="${project.github_url}" target="_blank" class="project-link">💻 View Code</a>
                    ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="project-link">🚀 Live Demo</a>` : ''}
                    <span class="project-updated">Updated: ${new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`🎯 Displayed ${projects.length} repositories`);
}

// Check if repository is new (updated within last 24 hours)
function isRepositoryNew(updatedAt) {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return new Date(updatedAt).getTime() > oneDayAgo;
}

// Show update notification
function showUpdateNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'github-update-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🔄</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Setup automatic refresh with exponential backoff
function setupAutoRefresh() {
    let refreshInterval = GITHUB_CONFIG.refreshInterval; // Start with 5 minutes
    let consecutiveErrors = 0;
    
    function scheduleRefresh() {
        setTimeout(async () => {
            try {
                console.log('🔄 Auto-refreshing GitHub repositories...');
                const repos = await fetchGitHubRepositoriesWithCache(true);
                displayRepositories(repos);
                
                // Reset error count and interval on success
                consecutiveErrors = 0;
                refreshInterval = GITHUB_CONFIG.refreshInterval;
                
                scheduleRefresh(); // Schedule next refresh
                
            } catch (error) {
                console.error('❌ Auto-refresh failed:', error);
                
                // Implement exponential backoff
                consecutiveErrors++;
                refreshInterval = Math.min(
                    refreshInterval * Math.pow(2, consecutiveErrors),
                    30 * 60 * 1000 // Max 30 minutes
                );
                
                console.log(`⏳ Retrying in ${refreshInterval / 60000} minutes...`);
                scheduleRefresh(); // Schedule retry
            }
        }, refreshInterval);
    }
    
    if (GITHUB_CONFIG.autoRefresh) {
        console.log(`🔄 Auto-refresh enabled (every ${refreshInterval / 60000} minutes)`);
        scheduleRefresh();
    }
}

// Manual refresh button
function addManualRefreshButton() {
    const projectsSection = document.querySelector('#projects');
    if (!projectsSection) return;
    
    const refreshButton = document.createElement('button');
    refreshButton.className = 'github-refresh-btn';
    refreshButton.innerHTML = '🔄 Refresh Repositories';
    refreshButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        backdrop-filter: blur(10px);
        font-size: 14px;
        transition: all 0.3s ease;
    `;
    
    refreshButton.addEventListener('click', () => {
        refreshButton.innerHTML = '🔄 Refreshing...';
        refreshButton.disabled = true;
        
        simulateGitHubWebhook();
        
        setTimeout(() => {
            refreshButton.innerHTML = '🔄 Refresh Repositories';
            refreshButton.disabled = false;
        }, 2000);
    });
    
    projectsSection.style.position = 'relative';
    projectsSection.appendChild(refreshButton);
}

// Initialize GitHub webhook simulation
function initializeGitHubWebhook() {
    console.log('🔔 Initializing GitHub auto-sync...');
    
    // Setup auto-refresh
    setupAutoRefresh();
    
    // Add manual refresh button
    addManualRefreshButton();
    
    // Listen for visibility changes to refresh when tab becomes active
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && githubWebhookCache.lastUpdate) {
            const timeSinceUpdate = Date.now() - githubWebhookCache.lastUpdate.getTime();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (timeSinceUpdate > fiveMinutes) {
                console.log('🔄 Tab became active, refreshing repositories...');
                simulateGitHubWebhook();
            }
        }
    });
    
    console.log('✅ GitHub auto-sync initialized');
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchGitHubRepositoriesWithCache,
        simulateGitHubWebhook,
        initializeGitHubWebhook,
        githubWebhookCache
    };
}