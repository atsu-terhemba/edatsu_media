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
    compare_tools: {
        title: 'Compare up to 5 tools with Pro',
        body: (limit) => `Free plan lets you compare ${limit} tools at a time. Upgrade to Pro to compare up to 5 side-by-side.`,
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
        title: '',
        html: `
            <div style="text-align:center;padding:8px 4px 4px;font-family:'Poppins',sans-serif;">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%);border:1px solid rgba(249,115,22,0.18);margin:0 auto 20px;">
                    <span class="material-symbols-outlined" style="font-size:28px;color:#f97316;">workspace_premium</span>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:14px;">
                    <span style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#f97316;">Pro Plan</span>
                    <span style="display:block;width:32px;height:2px;background:#f97316;border-radius:2px;"></span>
                </div>
                <h3 style="font-family:'Poppins',sans-serif;font-size:20px;font-weight:600;color:#000;margin:0 0 10px;letter-spacing:-0.01em;line-height:1.3;">${copy.title}</h3>
                <p style="font-family:'Poppins',sans-serif;color:#86868b;font-size:14px;line-height:1.5;margin:0 0 24px;max-width:340px;margin-left:auto;margin-right:auto;">${copy.body}</p>
                <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                    <button type="button" id="pro-upgrade-cancel" style="font-family:'Poppins',sans-serif;background:#f5f5f7;color:#000;border:none;border-radius:9999px;padding:12px 24px;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.15s ease;">Not now</button>
                    <button type="button" id="pro-upgrade-confirm" style="font-family:'Poppins',sans-serif;background:#f97316;color:#fff;border:none;border-radius:9999px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">Upgrade to Pro<span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span></button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        width: '460px',
        padding: '28px 24px 24px',
        background: '#fff',
        customClass: { popup: 'pro-upgrade-modal-popup' },
        didOpen: () => {
            const confirmBtn = document.getElementById('pro-upgrade-confirm');
            const cancelBtn = document.getElementById('pro-upgrade-cancel');
            if (confirmBtn) {
                confirmBtn.addEventListener('mouseenter', () => { confirmBtn.style.background = '#ea580c'; });
                confirmBtn.addEventListener('mouseleave', () => { confirmBtn.style.background = '#f97316'; });
                confirmBtn.addEventListener('click', () => Swal.close({ isConfirmed: true }));
            }
            if (cancelBtn) {
                cancelBtn.addEventListener('mouseenter', () => { cancelBtn.style.background = '#ebebed'; });
                cancelBtn.addEventListener('mouseleave', () => { cancelBtn.style.background = '#f5f5f7'; });
                cancelBtn.addEventListener('click', () => Swal.close({ isDismissed: true }));
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/upgrade-plan';
        } else if (typeof onDismiss === 'function') {
            onDismiss();
        }
        return result;
    });
}

export function isQuotaError(error) {
    return Boolean(error?.__proUpgradeHandled);
}

// Trigger a gated file download — on 402 the global interceptor shows the upgrade modal.
// On success, the file downloads in-browser without a full-page navigation.
export async function downloadWithGate(url, fallbackFilename) {
    const axios = window.axios;
    if (!axios) {
        window.location.href = url;
        return;
    }
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        const disposition = response.headers?.['content-disposition'] || '';
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const filename = match ? match[1] : fallbackFilename || 'download';
        const blobUrl = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        if (isQuotaError(err)) return;
        // Axios returns blob error bodies — attempt to parse
        if (err?.response?.data instanceof Blob) {
            try {
                const text = await err.response.data.text();
                const parsed = JSON.parse(text);
                if (parsed?.error === 'quota_exceeded') {
                    showProUpgrade({
                        feature: parsed.feature,
                        limit: parsed.limit,
                        body: parsed.message,
                    });
                    return;
                }
            } catch { /* fall through */ }
        }
        throw err;
    }
}

export function installProUpgradeInterceptor(axiosInstance) {
    if (!axiosInstance || !axiosInstance.interceptors) return;
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const data = error?.response?.data;
            if (error?.response?.status === 402 && data?.error === 'quota_exceeded') {
                error.__proUpgradeHandled = true;
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
