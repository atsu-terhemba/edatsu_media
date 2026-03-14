import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Set up CSRF token for axios requests
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Helper to read XSRF token from cookie
function getXsrfTokenFromCookie() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// Refresh CSRF token by making a lightweight GET request
async function refreshCsrfToken() {
    try {
        const response = await axios.get('/csrf-token');
        const newToken = response.data?.token;
        if (newToken) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
            // Also update the meta tag for any code that reads it directly
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) metaTag.content = newToken;
            return newToken;
        }
    } catch {
        // csrf-token endpoint failed
    }
    // Fallback: read from cookie
    const cookieToken = getXsrfTokenFromCookie();
    if (cookieToken) {
        window.axios.defaults.headers.common['X-XSRF-TOKEN'] = cookieToken;
    }
    return cookieToken;
}

// Auto-refresh on CSRF token mismatch (419) - retry only once
window.axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419 && !error.config._retried) {
            error.config._retried = true;
            try {
                const freshToken = await refreshCsrfToken();
                if (freshToken) {
                    // Update the request headers with fresh token
                    error.config.headers['X-CSRF-TOKEN'] = freshToken;
                    delete error.config.headers['X-XSRF-TOKEN'];
                    return axios(error.config);
                }
            } catch {
                // Refresh failed
            }
            // If all else fails, reload the page
            window.location.reload();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);
