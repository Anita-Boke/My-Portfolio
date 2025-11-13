// Portfolio JavaScript functionality

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

    projectsGrid.innerHTML = '<p class="loading">Loading GitHub repositories...</p>';

    try {
        let repos;
        
        try {
            // Try Railway backend first
            const response = await fetch(getApiUrl('/github-repos'));
            if (response.ok) {
                repos = await response.json();
                console.log('Successfully loaded repos from Railway backend');
            } else {
                throw new Error('Railway backend not available');
            }
        } catch (backendError) {
            console.log('Railway backend not available, using direct GitHub API');
            
            // Fallback to direct GitHub API
            const githubResponse = await fetch('https://api.github.com/users/Anita-Boke/repos?sort=updated&per_page=10&type=owner');
            if (!githubResponse.ok) {
                throw new Error('GitHub API error: ' + githubResponse.statusText);
            }
            repos = await githubResponse.json();
        }

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
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-size: 3rem;">
                        ${getLanguageEmoji(project.language)}
                    </div>
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
