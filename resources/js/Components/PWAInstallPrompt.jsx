import React, { useState, useEffect } from 'react';
import { X, Download, Zap, Bell, Wifi } from 'lucide-react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
            return mobileRegex.test(userAgent) || window.innerWidth <= 768;
        };

        const mobileDevice = checkMobile();
        setIsMobile(mobileDevice);

        if (!mobileDevice) return;

        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppiOS = window.navigator.standalone === true;
        const isInstalled = isStandaloneMode || isInWebAppiOS;
        setIsStandalone(isInstalled);

        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
        const remindAfter = localStorage.getItem('pwa-remind-after');
        const shouldRemindLater = remindAfter && new Date() < new Date(remindAfter);

        if (isInstalled || hasBeenDismissed === 'true' || shouldRemindLater) return;

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        if (iOS && !isInstalled && !hasBeenDismissed && !shouldRemindLater) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        const handleAppInstalled = () => {
            setShowPrompt(false);
            setIsStandalone(true);
            localStorage.setItem('pwa-install-dismissed', 'true');
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const animateClose = (callback) => {
        setIsClosing(true);
        setTimeout(() => {
            setShowPrompt(false);
            setIsClosing(false);
            callback?.();
        }, 300);
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                localStorage.setItem('pwa-install-dismissed', 'true');
                setIsStandalone(true);
            } else {
                const remindDate = new Date();
                remindDate.setDate(remindDate.getDate() + 7);
                localStorage.setItem('pwa-remind-after', remindDate.toISOString());
            }
            setDeferredPrompt(null);
        }
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        animateClose(() => localStorage.setItem('pwa-install-dismissed', 'true'));
    };

    const handleRemindLater = () => {
        animateClose(() => {
            const remindDate = new Date();
            remindDate.setDate(remindDate.getDate() + 7);
            localStorage.setItem('pwa-remind-after', remindDate.toISOString());
        });
    };

    if (!isMobile || isStandalone || !showPrompt) return null;

    const features = [
        { icon: <Zap size={14} />, label: 'Faster access' },
        { icon: <Bell size={14} />, label: 'Notifications' },
        { icon: <Wifi size={14} />, label: 'Works offline' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleRemindLater}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 1050,
                    animation: isClosing ? 'pwaFadeOut 0.3s ease forwards' : 'pwaFadeIn 0.3s ease',
                }}
            />

            {/* Bottom Sheet */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1051,
                    animation: isClosing ? 'pwaSlideOut 0.3s ease forwards' : 'pwaSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div
                    style={{
                        background: '#1d1d1f',
                        borderRadius: '24px 24px 0 0',
                        padding: '12px 24px 28px',
                        maxWidth: '500px',
                        margin: '0 auto',
                        position: 'relative',
                    }}
                >
                    {/* Drag Handle */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <div
                            style={{
                                width: '36px',
                                height: '4px',
                                borderRadius: '2px',
                                background: 'rgba(255,255,255,0.2)',
                            }}
                        />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.5)',
                            padding: 0,
                        }}
                    >
                        <X size={16} />
                    </button>

                    {/* App Icon + Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                        <img
                            src="/img/logo/main.png"
                            alt="Edatsu Media"
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                            }}
                        />
                        <div>
                            <h3
                                style={{
                                    color: '#ffffff',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    margin: '0 0 2px',
                                    letterSpacing: '-0.3px',
                                }}
                            >
                                Edatsu Media
                            </h3>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '13px',
                                    margin: 0,
                                }}
                            >
                                edatsu.com
                            </p>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {features.map((f, i) => (
                            <span
                                key={i}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    padding: '6px 12px',
                                    borderRadius: '980px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                {f.icon}
                                {f.label}
                            </span>
                        ))}
                    </div>

                    {/* iOS Instructions */}
                    {isIOS && (
                        <div
                            style={{
                                background: 'rgba(249, 115, 22, 0.1)',
                                border: '1px solid rgba(249, 115, 22, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 14px',
                                marginBottom: '20px',
                            }}
                        >
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '13px',
                                    margin: 0,
                                    lineHeight: 1.5,
                                }}
                            >
                                Tap{' '}
                                <span style={{ fontWeight: 600, color: '#f97316' }}>
                                    Share
                                </span>{' '}
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ verticalAlign: 'middle', margin: '0 2px' }}
                                >
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>{' '}
                                in Safari, then{' '}
                                <span style={{ fontWeight: 600, color: '#f97316' }}>
                                    "Add to Home Screen"
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {!isIOS && (
                            <button
                                onClick={handleInstallClick}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: '#f97316',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '980px',
                                    padding: '14px 24px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    letterSpacing: '0.2px',
                                }}
                            >
                                <Download size={16} />
                                Install App
                            </button>
                        )}
                        <button
                            onClick={handleRemindLater}
                            style={{
                                flex: isIOS ? 1 : 'none',
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '980px',
                                padding: '14px 20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            {isIOS ? 'Got it' : 'Not now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes pwaFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pwaFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes pwaSlideIn {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes pwaSlideOut {
                    from { transform: translateY(0); }
                    to { transform: translateY(100%); }
                }
            `}</style>
        </>
    );
};

export default PWAInstallPrompt;
