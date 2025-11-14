// Portfolio JavaScript functionality

// Hardcoded GitHub Configuration for Auto-Sync
const GITHUB_CONFIG = {
    username: 'Anita-Boke',
    profileUrl: 'https://github.com/Anita-Boke',
    apiUrl: 'https://api.github.com/users/Anita-Boke/repos',
    maxRepos: 20,
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
};

// API Configuration - detects environment and uses appropriate backend
const API_CONFIG = {
    getRailwayUrl() {
        return window.__RAILWAY_BACKEND_URL__ || 'http://localhost:3000';
    },
    
    // API endpoints
    projects: '/api/projects',
    contact: '/api/contact',  
    resume: '/api/resume',
    uploadResume: '/api/upload-resume'
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    const baseUrl = API_CONFIG.getRailwayUrl();
    console.log('API Base URL:', baseUrl, 'Endpoint:', endpoint);
    return `${baseUrl}${endpoint}`;
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeCursor();
    initializeAnimations();
    initializeForms();
    fetchProjects();
    setupModalHandlers();
    
    // Initialize GitHub auto-sync if available
    if (typeof initializeGitHubWebhook === 'function') {
        initializeGitHubWebhook();
    }
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== CUSTOM CURSOR =====
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                
                // Add specific animations
                if (element.classList.contains('animate-slide-in')) {
                    element.style.animation = 'slideInFromLeft 1s ease-out forwards';
                }
                if (element.classList.contains('animate-fade-in')) {
                    element.style.animation = 'fadeInUp 1.2s ease-out forwards';
                }
                if (element.classList.contains('animate-slide-left')) {
                    element.style.animation = 'slideInFromLeft 1s ease-out forwards';
                }
                if (element.classList.contains('animate-slide-right')) {
                    element.style.animation = 'slideInFromRight 1s ease-out forwards';
                }
                if (element.classList.contains('animate-expand')) {
                    element.style.animation = 'expandWidth 1.5s ease-out forwards';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-slide-in, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-expand');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== FORMS =====
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Resume upload
    const resumeInput = document.getElementById('resumeInput');
    if (resumeInput) {
        resumeInput.addEventListener('change', handleResumeUpload);
    }

    // Project forms
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', handleAddProject);
    }

    const editProjectForm = document.getElementById('editProjectForm');
    if (editProjectForm) {
        editProjectForm.addEventListener('submit', handleEditProject);
    }

    // Load current resume info
    loadCurrentResumeInfo();
}

// ===== CONTACT FORM =====
async function handleContactSubmit(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('contactResult');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    resultDiv.textContent = '';

    try {
        const response = await fetch(getApiUrl(API_CONFIG.contact), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.textContent = 'Message sent successfully! Thank you for reaching out.';
            resultDiv.className = 'form-result success';
            e.target.reset();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
    } catch (error) {
        resultDiv.textContent = 'Failed to send message. Please try again.';
        resultDiv.className = 'form-result error';
        console.error('Contact form error:', error);
    } finally {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
}

// ===== RESUME UPLOAD =====
async function handleResumeUpload(e) {
    const file = e.target.files[0];
    const resultDiv = document.getElementById('resumeResult');
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
        resultDiv.textContent = 'Please select a PDF file.';
        resultDiv.className = 'upload-result error';
        return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    resultDiv.textContent = 'Uploading...';
    resultDiv.className = 'upload-result';

    try {
        const response = await fetch('/api/upload-resume', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.textContent = 'Resume uploaded successfully!';
            resultDiv.className = 'upload-result success';
            // Refresh resume info
            setTimeout(loadCurrentResumeInfo, 1000);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        resultDiv.textContent = 'Failed to upload resume. Please try again.';
        resultDiv.className = 'upload-result error';
        console.error('Resume upload error:', error);
    }
}

// ===== RESUME FUNCTIONS =====
async function loadCurrentResumeInfo() {
    const resumeInfo = document.getElementById('resumeInfo');
    if (!resumeInfo) return;

    try {
        const response = await fetch('/api/resume');
        
        if (response.status === 404) {
            resumeInfo.innerHTML = '<p style="color: var(--muted); font-size: 0.9rem; margin-top: 10px;">No resume uploaded yet</p>';
            return;
        }

        const data = await response.json();
        
        if (!data.success || !data.resume) {
            resumeInfo.innerHTML = '<p style="color: var(--muted); font-size: 0.9rem; margin-top: 10px;">No resume uploaded yet</p>';
            return;
        }

        const resume = data.resume;
        const uploadDate = new Date(resume.uploaded_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        resumeInfo.innerHTML = `
            <div style="background: var(--glass-bg); padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid var(--glass-border);">
                <p style="margin: 0 0 5px 0; color: var(--text); font-weight: 500;">📋 Current Resume</p>
                <p style="margin: 0 0 5px 0; color: var(--muted); font-size: 0.9rem;">File: ${escapeHtml(resume.original_name)}</p>
                <p style="margin: 0; color: var(--muted); font-size: 0.9rem;">Uploaded: ${uploadDate}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading resume info:', error);
        resumeInfo.innerHTML = '<p style="color: var(--muted); font-size: 0.9rem; margin-top: 10px;">Error loading resume information</p>';
    }
}

async function viewResume() {
    try {
        const response = await fetch('/api/resume/current');
        
        if (response.status === 404) {
            alert('No resume available to view. Please upload a resume first.');
            return;
        }

        const resume = await response.json();
        
        if (resume.error) {
            alert('No resume available to view. Please upload a resume first.');
            return;
        }

        // Open resume in new tab
        const viewUrl = `/api/resume/view/${resume.filename}`;
        window.open(viewUrl, '_blank');
    } catch (error) {
        console.error('Error viewing resume:', error);
        alert('Failed to view resume. Please try again.');
    }
}

async function downloadResume() {
    try {
        const response = await fetch('/api/resume/current');
        
        if (response.status === 404) {
            alert('No resume available to download. Please upload a resume first.');
            return;
        }

        const resume = await response.json();
        
        if (resume.error) {
            alert('No resume available to download. Please upload a resume first.');
            return;
        }

        // Create download link
        const downloadUrl = `/api/resume/download/${resume.filename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = resume.original_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Failed to download resume. Please try again.');
    }
}

// ===== PROJECTS =====
async function fetchProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<p class="loading">🔄 Auto-syncing from GitHub.com/Anita-Boke...</p>';

    try {
        let repos;
        
        // Use enhanced GitHub fetch with caching if available
        if (typeof fetchGitHubRepositoriesWithCache === 'function') {
            console.log(`🚀 Auto-syncing repositories from ${GITHUB_CONFIG.profileUrl} (with caching)`);
            repos = await fetchGitHubRepositoriesWithCache();
        } else {
            // Fallback to direct API call
            console.log(`🚀 Auto-syncing repositories from ${GITHUB_CONFIG.profileUrl}`);
            
            const githubResponse = await fetch(`${GITHUB_CONFIG.apiUrl}?sort=updated&per_page=${GITHUB_CONFIG.maxRepos}&type=owner`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Anita-Boke-Portfolio',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!githubResponse.ok) {
                throw new Error(`GitHub API error: ${githubResponse.status} - ${githubResponse.statusText}`);
            }
            
            repos = await githubResponse.json();
        }
        
        console.log(`✅ Successfully synced ${repos.length} repositories from GitHub`);

        if (repos.message) {
            throw new Error('GitHub API error: ' + repos.message);
        }

        if (!Array.isArray(repos) || repos.length === 0) {
            projectsGrid.innerHTML = '<p class="loading">No repositories found on GitHub.</p>';
            return;
        }

        // Filter out forked repos and convert GitHub repos to project format
        const projects = repos
            .filter(repo => !repo.fork && !repo.archived) // Exclude forked and archived repositories
            .slice(0, 6) // Show top 6 repositories
            .map(repo => ({
                id: repo.id,
                title: repo.name,
                description: repo.description || 'A software project showcasing my development skills',
                github_url: repo.html_url,
                live_url: repo.homepage || null,
                language: repo.language,
                stars: repo.stargazers_count || 0,
                updated_at: repo.updated_at,
                topics: repo.topics || []
            }));

        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    ${getProjectImage(project)}
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
        
    } catch (error) {
        projectsGrid.innerHTML = '<p class="loading">Failed to load GitHub repositories. Please try refreshing.</p>';
        console.error('Fetch GitHub repos error:', error);
    }
}

// Helper function to get emoji for programming languages
function getLanguageEmoji(language) {
    const languageEmojis = {
        'JavaScript': '🟨',
        'TypeScript': '🔷',
        'Python': '🐍',
        'Java': '☕',
        'C++': '⚡',
        'C#': '🔷',
        'PHP': '🐘',
        'Ruby': '💎',
        'Go': '🐹',
        'Rust': '🦀',
        'Swift': '🍎',
        'Kotlin': '🎯',
        'HTML': '🌐',
        'CSS': '🎨',
        'Shell': '🐚',
        'Dockerfile': '🐳',
        'Vue': '💚',
        'React': '⚛️'
    };
    return languageEmojis[language] || '📁';
}

// Generate dynamic project images based on language and project type
function getProjectImage(project) {
    const language = project.language;
    const title = project.title.toLowerCase();
    const description = (project.description || '').toLowerCase();
    
    // Generate dynamic gradient based on language
    const gradients = {
        'JavaScript': 'linear-gradient(135deg, #f7df1e, #323330)',
        'TypeScript': 'linear-gradient(135deg, #3178c6, #ffffff)', 
        'Python': 'linear-gradient(135deg, #3776ab, #ffd343)',
        'Java': 'linear-gradient(135deg, #ed8b00, #5382a1)',
        'C++': 'linear-gradient(135deg, #00599c, #004482)',
        'C#': 'linear-gradient(135deg, #239120, #68217a)',
        'PHP': 'linear-gradient(135deg, #777bb4, #ffffff)',
        'Ruby': 'linear-gradient(135deg, #cc342d, #ffffff)',
        'Go': 'linear-gradient(135deg, #00add8, #ffffff)',
        'Rust': 'linear-gradient(135deg, #ce422b, #000000)',
        'Swift': 'linear-gradient(135deg, #fa7343, #ffffff)',
        'HTML': 'linear-gradient(135deg, #e34f26, #ffffff)',
        'CSS': 'linear-gradient(135deg, #1572b6, #ffffff)',
        'Vue': 'linear-gradient(135deg, #4fc08d, #ffffff)',
        'React': 'linear-gradient(135deg, #61dafb, #20232a)',
        'default': 'linear-gradient(135deg, var(--accent), var(--accent-2))'
    };
    
    const gradient = gradients[language] || gradients.default;
    const emoji = getLanguageEmoji(language);
    
    // Determine project type for additional styling
    let projectType = 'general';
    if (title.includes('portfolio') || title.includes('website')) {
        projectType = 'web';
    } else if (title.includes('api') || title.includes('server') || title.includes('backend')) {
        projectType = 'backend';
    } else if (title.includes('app') || title.includes('mobile')) {
        projectType = 'mobile';
    } else if (title.includes('bot') || title.includes('ai') || title.includes('ml')) {
        projectType = 'ai';
    } else if (title.includes('game')) {
        projectType = 'game';
    } else if (title.includes('database') || title.includes('db')) {
        projectType = 'database';
    } else if (title.includes('management') || title.includes('system') || title.includes('bank')) {
        projectType = 'business';
    }
    
    const projectIcons = {
        'web': '🌐',
        'backend': '⚙️', 
        'mobile': '📱',
        'ai': '🤖',
        'game': '🎮',
        'database': '🗄️',
        'business': '💼',
        'general': emoji
    };
    
    const projectIcon = projectIcons[projectType];
    
    // Generate GitHub social preview URL
    const githubImageUrl = `https://opengraph.githubassets.com/1/${GITHUB_CONFIG.username}/${project.title}`;
    
    return `
        <div style="
            height: 100%; 
            position: relative;
            overflow: hidden;
            border-radius: 12px 12px 0 0;
            background: ${gradient};
        ">
            <img 
                src="${githubImageUrl}" 
                alt="${project.title} preview"
                style="
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover;
                    transition: transform 0.3s ease;
                "
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="
                background: ${gradient};
                height: 100%; 
                display: none; 
                flex-direction: column;
                align-items: center; 
                justify-content: center; 
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.1);
                    backdrop-filter: blur(1px);
                "></div>
                <div style="
                    font-size: 3rem; 
                    margin-bottom: 8px; 
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                ">${projectIcon}</div>
                <div style="
                    font-size: 0.9rem; 
                    font-weight: 600; 
                    color: rgba(255,255,255,0.9);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    padding: 0 10px;
                ">${language || 'Project'}</div>
                <div style="
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background: rgba(255,255,255,0.2);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.8);
                    backdrop-filter: blur(10px);
                ">${projectType.toUpperCase()}</div>
            </div>
            <div style="
                position: absolute;
                top: 8px;
                left: 8px;
                background: rgba(0,0,0,0.7);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                color: white;
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 4px;
            ">
                ${emoji} ${language || 'Code'}
            </div>
        </div>
    `;
}

async function syncGitHubRepos() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<p class="loading">Syncing GitHub repositories...</p>';

    try {
        const response = await fetch(getApiUrl('/github-repos'));
        const repos = await response.json();

        if (repos.message) {
            throw new Error('GitHub API error: ' + repos.message);
        }

        // Add GitHub repos as projects (you might want to modify this logic)
        console.log('GitHub repos:', repos);
        
        // Refresh projects after sync
        setTimeout(fetchProjects, 1000);
    } catch (error) {
        console.error('GitHub sync error:', error);
        fetchProjects(); // Fallback to regular projects
    }
}

// ===== PROJECT MANAGEMENT =====
async function handleAddProject(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('addProjectResult');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    resultDiv.textContent = '';

    try {
        const formData = new FormData(e.target);
        const response = await fetch('/api/projects', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.textContent = 'Project added successfully!';
            resultDiv.className = 'form-result success';
            e.target.reset();
            closeAddModal();
            fetchProjects();
        } else {
            throw new Error(result.error || 'Failed to add project');
        }
    } catch (error) {
        resultDiv.textContent = 'Failed to add project. Please try again.';
        resultDiv.className = 'form-result error';
        console.error('Add project error:', error);
    } finally {
        submitBtn.textContent = 'Add Project';
        submitBtn.disabled = false;
    }
}

async function handleEditProject(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('editProjectResult');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const projectId = document.getElementById('editProjectId').value;

    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;
    resultDiv.textContent = '';

    try {
        const formData = new FormData(e.target);
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.textContent = 'Project updated successfully!';
            resultDiv.className = 'form-result success';
            closeEditModal();
            fetchProjects();
        } else {
            throw new Error(result.error || 'Failed to update project');
        }
    } catch (error) {
        resultDiv.textContent = 'Failed to update project. Please try again.';
        resultDiv.className = 'form-result error';
        console.error('Edit project error:', error);
    } finally {
        submitBtn.textContent = 'Update Project';
        submitBtn.disabled = false;
    }
}

// ===== MODAL HANDLERS =====
function setupModalHandlers() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}

function openEditModal(projectId, title, description, image, tags, githubUrl, liveUrl) {
    console.log('Opening edit modal for project:', projectId, title);
    
    try {
        const modal = document.getElementById('editProjectModal');
        
        if (!modal) {
            console.error('Edit modal element not found!');
            alert('Edit modal not found. Please refresh the page.');
            return;
        }
        
        const titleInput = document.getElementById('editProjectTitle');
        const descInput = document.getElementById('editProjectDescription');
        const tagsInput = document.getElementById('editProjectTags');
        const githubInput = document.getElementById('editGithubUrl');
        const liveInput = document.getElementById('editLiveUrl');
        const idInput = document.getElementById('editProjectId');
        const preview = document.getElementById('currentImagePreview');
        
        // Check if all form elements exist
        if (!titleInput || !descInput || !idInput) {
            console.error('Form elements not found:', {titleInput, descInput, idInput});
            alert('Form elements not found. Please refresh the page.');
            return;
        }
        
        // Populate all form fields
        idInput.value = projectId;
        titleInput.value = title || '';
        descInput.value = description || '';
        tagsInput.value = tags || '';
        
        if (githubInput) githubInput.value = githubUrl || '';
        if (liveInput) liveInput.value = liveUrl || '';
        
        // Show current image
        if (preview) {
            if (image && image !== '' && !image.includes('placeholder')) {
                preview.innerHTML = `<img src="${image}" alt="Current project image" style="max-width: 200px; border-radius: 8px; margin-top: 10px;" />`;
            } else {
                preview.innerHTML = '<p style="color: var(--muted); font-size: 0.9rem; margin-top: 10px;">No image currently set</p>';
            }
        }
        
        console.log('Displaying modal...');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus on the title input
        setTimeout(() => {
            titleInput.focus();
        }, 100);
        
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Error opening edit form. Please check console and refresh.');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editProjectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.getElementById('editProjectForm').reset();
        document.getElementById('editProjectResult').textContent = '';
    }
}

function closeAddModal() {
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.getElementById('addProjectForm').reset();
        document.getElementById('addProjectResult').textContent = '';
    }
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== SMOOTH SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// ===== RESUME FUNCTIONALITY =====

// Load current resume info on page load
async function loadCurrentResume() {
    try {
        const response = await fetch(getApiUrl('/api/resume/current'));
        const resumeInfo = document.getElementById('resumeInfo');
        
        if (response.ok) {
            const resumeData = await response.json();
            resumeInfo.innerHTML = `
                <div class="current-resume">
                    <h4>Current Resume</h4>
                    <p><strong>File:</strong> ${resumeData.original_name}</p>
                    <p><strong>Uploaded:</strong> ${new Date(resumeData.uploaded_at).toLocaleDateString()}</p>
                    <p><strong>Size:</strong> ${formatFileSize(resumeData.file_size)}</p>
                </div>
            `;
        } else {
            resumeInfo.innerHTML = `
                <div class="no-resume">
                    <p>No resume uploaded yet. Click "Upload New Resume" to add your resume.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading current resume:', error);
        document.getElementById('resumeInfo').innerHTML = `
            <div class="resume-error">
                <p>Error loading resume information. Please try again later.</p>
            </div>
        `;
    }
}

// View current resume
async function viewResume() {
    try {
        const response = await fetch(getApiUrl('/api/resume/current'));
        
        if (response.ok) {
            const resumeData = await response.json();
            // Open resume in new tab
            window.open(resumeData.file_url, '_blank');
        } else {
            alert('No resume found. Please upload a resume first.');
        }
    } catch (error) {
        console.error('Error viewing resume:', error);
        alert('Error opening resume. Please try again.');
    }
}

// Download current resume
async function downloadResume() {
    try {
        const response = await fetch(getApiUrl('/api/resume/current'));
        
        if (response.ok) {
            const resumeData = await response.json();
            
            // Create download link
            const link = document.createElement('a');
            link.href = resumeData.file_url;
            link.download = resumeData.original_name;
            link.target = '_blank';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Resume download initiated:', resumeData.original_name);
        } else {
            alert('No resume found. Please upload a resume first.');
        }
    } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Error downloading resume. Please try again.');
    }
}

// Handle resume upload from laptop
document.addEventListener('DOMContentLoaded', function() {
    const resumeInput = document.getElementById('resumeInput');
    
    if (resumeInput) {
        resumeInput.addEventListener('change', handleResumeUpload);
    }
    
    // Load current resume info
    loadCurrentResume();
});

async function handleResumeUpload(event) {
    const file = event.target.files[0];
    const resultDiv = document.getElementById('resumeResult');
    
    if (!file) {
        return;
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
        resultDiv.innerHTML = '<p style="color: red;">Please select a PDF file only.</p>';
        return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        resultDiv.innerHTML = '<p style="color: red;">File size must be less than 10MB.</p>';
        return;
    }
    
    // Show upload progress
    resultDiv.innerHTML = '<p style="color: blue;">Uploading resume... Please wait.</p>';
    
    try {
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await fetch(getApiUrl('/api/upload-resume'), {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            resultDiv.innerHTML = `
                <p style="color: green;">✅ Resume uploaded successfully!</p>
                <p><strong>File:</strong> ${result.original_name}</p>
                <p><strong>URL:</strong> <a href="${result.file_url}" target="_blank">View Resume</a></p>
            `;
            
            // Reload current resume info
            setTimeout(() => {
                loadCurrentResume();
                resultDiv.innerHTML = '';
            }, 3000);
            
        } else {
            throw new Error(result.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('Resume upload error:', error);
        resultDiv.innerHTML = `<p style="color: red;">❌ Upload failed: ${error.message}</p>`;
    }
    
    // Clear file input
    event.target.value = '';
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
