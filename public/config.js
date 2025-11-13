// Configuration for API endpoints
// This file should be updated with your Railway backend URL

window.__RAILWAY_BACKEND_URL__ = 'https://my-portfolio-production-2f89.up.railway.app';

// You can also set this dynamically based on environment
if (window.location.hostname === 'localhost') {
    window.__RAILWAY_BACKEND_URL__ = 'http://localhost:3000';
}