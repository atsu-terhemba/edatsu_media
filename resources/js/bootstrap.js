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

// Auto-refresh on CSRF token mismatch (419) - retry only once
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419 && !error.config._retried) {
            error.config._retried = true;
            // Read fresh token from cookie (Laravel sets XSRF-TOKEN cookie automatically)
            const freshToken = getXsrfTokenFromCookie();
            if (freshToken) {
                error.config.headers['X-XSRF-TOKEN'] = freshToken;
                return axios(error.config);
            }
            // If no cookie token, reload the page to get a fresh session
            window.location.reload();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);
