import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
            const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth <= 768;
            return isMobileDevice;
        };

        const mobileDevice = checkMobile();
        setIsMobile(mobileDevice);

        // Only proceed if it's a mobile device
        if (!mobileDevice) {
            return;
        }

        // Multiple checks to detect if app is already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppiOS = window.navigator.standalone === true;
        const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
        
        // Check if running as installed PWA
        const isInstalled = isStandaloneMode || isInWebAppiOS || isInWebAppChrome;
        setIsStandalone(isInstalled);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if user has already dismissed the prompt
        const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
        
        // Check if we should remind later
        const remindAfter = localStorage.getItem('pwa-remind-after');
        const shouldRemindLater = remindAfter && new Date() < new Date(remindAfter);
        
        // Don't show if already installed, dismissed, or remind-later is active
        if (isInstalled || hasBeenDismissed === 'true' || shouldRemindLater) {
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show our custom install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS devices, show manual instructions after a delay
        if (iOS && !isInstalled && !hasBeenDismissed && !shouldRemindLater) {
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000); // Show after 3 seconds
        }

        // Listen for app installation
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

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                // Mark as dismissed since they installed
                localStorage.setItem('pwa-install-dismissed', 'true');
                setIsStandalone(true);
            } else {
                console.log('User dismissed the install prompt');
                // Set remind later for declined installs
                const remindAfter = new Date();
                remindAfter.setDate(remindAfter.getDate() + 7);
                localStorage.setItem('pwa-remind-after', remindAfter.toISOString());
            }
            
            // Clear the deferredPrompt
            setDeferredPrompt(null);
        }
        
        // Hide the prompt
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember that user dismissed it
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    const handleRemindLater = () => {
        setShowPrompt(false);
        // Set a timestamp to remind later (e.g., after 7 days)
        const remindAfter = new Date();
        remindAfter.setDate(remindAfter.getDate() + 7);
        localStorage.setItem('pwa-remind-after', remindAfter.toISOString());
    };

    // Don't render if not mobile, already installed, or shouldn't show
    if (!isMobile || isStandalone || !showPrompt) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className="position-fixed w-100 h-100"
                style={{
                    top: 0,
                    left: 0,
                    background: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1050,
                    animation: 'fadeIn 0.3s ease'
                }}
                onClick={handleRemindLater}
            />

            {/* PWA Install Prompt */}
            <div 
                className="position-fixed w-100 d-flex justify-content-center"
                style={{
                    top: '20px',
                    left: 0,
                    zIndex: 1051,
                    padding: '0 16px',
                    animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    className="bg-white rounded-4 shadow-lg border-0 p-4"
                    style={{
                        maxWidth: '400px',
                        width: '100%',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}
                >
                    {/* Header */}
                    <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                }}
                            >
                                <Smartphone size={24} color="white" />
                            </div>
                            <div>
                                <h6 className="mb-1 fw-bold text-dark">Install App</h6>
                                <small className="text-muted">Get the full experience</small>
                            </div>
                        </div>
                        <button 
                            className="btn btn-sm btn-outline-secondary rounded-circle border-0"
                            onClick={handleDismiss}
                            style={{ width: '32px', height: '32px', padding: 0 }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        <p className="mb-2 text-dark" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                            Install our app for faster access, offline browsing, and a native experience.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center"
                            onClick={handleInstallClick}
                            style={{ 
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            <Download size={16} className="me-2" />
                            Install Now
                        </button>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={handleRemindLater}
                            style={{ 
                                borderRadius: '12px',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
};

export default PWAInstallPrompt;
