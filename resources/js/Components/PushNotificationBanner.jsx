import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import usePushNotifications from '@/hooks/usePushNotifications';

const STORAGE_KEY = 'push-banner-dismissed-at';
const SNOOZE_DAYS = 7;

export default function PushNotificationBanner() {
    const { vapidPublicKey } = usePage().props;
    const { isSubscribed, permission, subscribe } = usePushNotifications(vapidPublicKey);
    const [snoozed, setSnoozed] = useState(true);
    const [closing, setClosing] = useState(false);
    const [busy, setBusy] = useState(false);

    const supported = typeof window !== 'undefined'
        && 'serviceWorker' in navigator
        && 'PushManager' in window;

    useEffect(() => {
        const dismissedAt = localStorage.getItem(STORAGE_KEY);
        if (!dismissedAt) {
            setSnoozed(false);
            return;
        }
        const daysSince = (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24);
        setSnoozed(daysSince < SNOOZE_DAYS);
    }, []);

    const handleEnable = async () => {
        setBusy(true);
        const ok = await subscribe();
        setBusy(false);
        if (ok) {
            handleDismiss(false);
        } else if (Notification.permission === 'denied') {
            handleDismiss(true);
        }
    };

    const handleDismiss = (persist = true) => {
        setClosing(true);
        setTimeout(() => {
            if (persist) localStorage.setItem(STORAGE_KEY, new Date().toISOString());
            setSnoozed(true);
            setClosing(false);
        }, 300);
    };

    if (!supported || !vapidPublicKey) return null;
    if (isSubscribed) return null;
    if (permission === 'denied') return null;
    if (snoozed) return null;

    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '16px',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            animation: closing ? 'pushBannerOut 0.3s ease forwards' : 'pushBannerIn 0.4s ease',
        }}>
            <div style={{
                position: 'absolute', top: '-30px', right: '-20px',
                width: '140px', height: '140px',
                background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <button
                onClick={() => handleDismiss(true)}
                aria-label="Dismiss"
                style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: '#f5f5f7', border: 'none', borderRadius: '50%',
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', zIndex: 2,
                    transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ececef'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>
                    close
                </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(249,115,22,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#f97316' }}>
                        notifications_active
                    </span>
                </div>

                <div style={{ flex: 1, minWidth: '180px', paddingRight: '32px' }}>
                    <h4 style={{
                        fontSize: '15px', fontWeight: 600, color: '#000',
                        margin: '0 0 4px', letterSpacing: '-0.01em',
                    }}>
                        Never miss a deadline
                    </h4>
                    <p style={{
                        fontSize: '13px', color: '#86868b',
                        margin: 0, lineHeight: 1.4,
                    }}>
                        Turn on push notifications to get reminders for your saved opportunities.
                    </p>
                </div>

                <button
                    onClick={handleEnable}
                    disabled={busy}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '10px 22px', borderRadius: '9999px', border: 'none',
                        background: '#000', color: '#fff', fontSize: '13px',
                        fontWeight: 500, cursor: busy ? 'wait' : 'pointer',
                        transition: 'background 0.15s ease',
                        whiteSpace: 'nowrap', flexShrink: 0,
                        opacity: busy ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = '#333'; }}
                    onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = '#000'; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {busy ? 'progress_activity' : 'notifications'}
                    </span>
                    {busy ? 'Enabling…' : 'Enable'}
                </button>
            </div>

            <style>{`
                @keyframes pushBannerIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pushBannerOut {
                    from { opacity: 1; max-height: 200px; margin-bottom: 16px; }
                    to { opacity: 0; max-height: 0; margin-bottom: 0; padding: 0; overflow: hidden; }
                }
            `}</style>
        </div>
    );
}
