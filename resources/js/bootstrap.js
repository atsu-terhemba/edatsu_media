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

// Auto-refresh on CSRF token mismatch (419)
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // Fetch a fresh CSRF cookie, then retry the failed request once
            return axios.get('/sanctum/csrf-cookie').then(() => {
                // Update the meta tag token from the fresh XSRF cookie
                const freshToken = document.head.querySelector('meta[name="csrf-token"]');
                if (freshToken) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = freshToken.content;
                }
                return axios(error.config);
            }).catch(() => {
                // If refresh also fails, reload the page to get a fresh session
                window.location.reload();
                return Promise.reject(error);
            });
        }
        return Promise.reject(error);
    }
);
