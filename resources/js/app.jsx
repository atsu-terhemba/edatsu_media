import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';
import '../css/style.css';
import './bootstrap';
import "sweetalert2/dist/sweetalert2.min.css";
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';

// Sentry — only initializes when VITE_SENTRY_DSN is set at build time, so
// dev/SSR builds without the env var stay quiet.
if (!import.meta.env.SSR && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
        release: import.meta.env.VITE_SENTRY_RELEASE,
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '0'),
    });
}

const appName = import.meta.env.VITE_APP_NAME || 'edatsu media';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: 'red',
        showSpinner: true,
    },
});

// Register service worker for push notifications (browser only)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}
