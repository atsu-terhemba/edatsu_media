import Swal from 'sweetalert2';

const DEFAULT_COPY = {
    title: 'Upgrade to Pro to access this feature',
    body: 'This feature is available on the Pro plan. Upgrade to unlock it along with everything else Pro has to offer.',
};

const FEATURE_COPY = {
    bookmarks: {
        title: 'Upgrade to Pro for unlimited bookmarks',
        body: (limit) => `Free plan includes ${limit} bookmarks. Upgrade to Pro to save as many opportunities and tools as you want.`,
    },
    saved_articles: {
        title: 'Upgrade to Pro to save more articles',
        body: (limit) => `Free plan lets you save ${limit} articles. Upgrade to Pro for unlimited saves.`,
    },
    reminders: {
        title: 'Upgrade to Pro for unlimited reminders',
        body: (limit) => `Free plan allows ${limit} active reminders. Upgrade to Pro to never miss a deadline.`,
    },
    custom_feeds: {
        title: 'Upgrade to Pro for unlimited feeds',
        body: (limit) => `Free plan supports ${limit} custom RSS feeds. Upgrade to Pro to follow unlimited sources.`,
    },
    bulk_export: {
        title: 'Upgrade to Pro to export your bookmarks',
        body: 'Bulk export (CSV / PDF) is a Pro feature. Upgrade to download your saved items in one click.',
    },
    web_push: {
        title: 'Upgrade to Pro for push notifications',
        body: 'Web push notifications are a Pro feature. Upgrade to get real-time alerts even when the tab is closed.',
    },
};

export function resolveCopy(feature, limit, override) {
    if (override && (override.title || override.body)) {
        return {
            title: override.title || DEFAULT_COPY.title,
            body: override.body || DEFAULT_COPY.body,
        };
    }
    const entry = FEATURE_COPY[feature];
    if (!entry) return DEFAULT_COPY;
    return {
        title: entry.title,
        body: typeof entry.body === 'function' ? entry.body(limit) : entry.body,
    };
}

export function showProUpgrade({ feature, limit, title, body, onDismiss } = {}) {
    const copy = resolveCopy(feature, limit, { title, body });
    return Swal.fire({
        title: copy.title,
        html: `<p style="color:#86868b;font-size:14px;margin:0 0 16px;line-height:1.5;">${copy.body}</p>`,
        showCancelButton: true,
        confirmButtonText: 'Upgrade to Pro',
        cancelButtonText: 'Not now',
        confirmButtonColor: '#f97316',
        reverseButtons: true,
        customClass: { popup: 'subscription-modal-popup' },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/upgrade-plan';
        } else if (typeof onDismiss === 'function') {
            onDismiss();
        }
        return result;
    });
}

export function installProUpgradeInterceptor(axiosInstance) {
    if (!axiosInstance || !axiosInstance.interceptors) return;
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const data = error?.response?.data;
            if (error?.response?.status === 402 && data?.error === 'quota_exceeded') {
                showProUpgrade({
                    feature: data.feature,
                    limit: data.limit,
                    body: data.message,
                });
            }
            return Promise.reject(error);
        },
    );
}
