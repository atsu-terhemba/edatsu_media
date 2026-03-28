import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'pwa-banner-dismissed-at';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        setIsStandalone(isStandaloneMode);

        if (isStandaloneMode) return;

        // Check if dismissed within last 30 days
        const dismissedAt = localStorage.getItem(STORAGE_KEY);
        if (dismissedAt) {
            const dismissDate = new Date(dismissedAt);
            const daysSince = (Date.now() - dismissDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSince < 30) return;
        }

        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        const handlePrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handlePrompt);

        // For iOS or if beforeinstallprompt doesn't fire, show after delay
        setTimeout(() => setVisible(true), 2000);

        const handleInstalled = () => {
            setVisible(false);
            setIsStandalone(true);
        };
        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handlePrompt);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsStandalone(true);
            }
            setDeferredPrompt(null);
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            setClosing(false);
            localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        }, 300);
    };

    if (isStandalone || !visible) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
            animation: closing ? 'pwaBannerOut 0.3s ease forwards' : 'pwaBannerIn 0.4s ease',
        }}>
            {/* Decorative glow */}
            <div style={{
                position: 'absolute', top: '-30px', right: '-20px',
                width: '140px', height: '140px',
                background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Close button */}
            <button
                onClick={handleDismiss}
                style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', zIndex: 2,
                    transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)' }}>
                    close
                </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                {/* App icon */}
                <img
                    src="/img/logo/main.png"
                    alt="Edatsu Media"
                    style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)', flexShrink: 0,
                    }}
                />

                {/* Text */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <h4 style={{
                        fontSize: '15px', fontWeight: 600, color: '#fff',
                        margin: '0 0 4px', letterSpacing: '-0.01em',
                    }}>
                        Get instant updates
                    </h4>
                    <p style={{
                        fontSize: '13px', color: 'rgba(255,255,255,0.5)',
                        margin: 0, lineHeight: 1.4,
                    }}>
                        {isIOS
                            ? 'Add Edatsu to your home screen for push notifications and offline access.'
                            : 'Install the Edatsu app for push notifications, reminders, and offline access.'}
                    </p>
                </div>

                {/* Feature pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { icon: 'notifications_active', label: 'Push alerts' },
                        { icon: 'speed', label: 'Faster' },
                        { icon: 'wifi_off', label: 'Offline' },
                    ].map((f, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                            fontSize: '11px', fontWeight: 500, padding: '4px 10px',
                            borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.06)',
                            whiteSpace: 'nowrap',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{f.icon}</span>
                            {f.label}
                        </span>
                    ))}
                </div>

                {/* Install button */}
                {!isIOS ? (
                    <button
                        onClick={handleInstall}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '10px 22px', borderRadius: '9999px', border: 'none',
                            background: '#f97316', color: '#fff', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#ea580c'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#f97316'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                        Install App
                    </button>
                ) : (
                    <div style={{
                        padding: '8px 14px', borderRadius: '12px',
                        background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                        flexShrink: 0,
                    }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                            Tap <span style={{ fontWeight: 600, color: '#f97316' }}>Share</span> then{' '}
                            <span style={{ fontWeight: 600, color: '#f97316' }}>"Add to Home Screen"</span>
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pwaBannerIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pwaBannerOut {
                    from { opacity: 1; max-height: 200px; margin-bottom: 16px; }
                    to { opacity: 0; max-height: 0; margin-bottom: 0; padding: 0; overflow: hidden; }
                }
            `}</style>
        </div>
    );
};

export default PWAInstallBanner;
