import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

const STORAGE_KEY = 'feedback-prompt-dismissed-at';
const SNOOZE_DAYS = 7;

export default function FeedbackPrompt() {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const dismissedAt = localStorage.getItem(STORAGE_KEY);
        let show = true;
        if (dismissedAt) {
            const daysSince = (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24);
            show = daysSince >= SNOOZE_DAYS;
        }
        if (!show) return;
        const t = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, new Date().toISOString());
            setVisible(false);
            setClosing(false);
        }, 250);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Share feedback"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 1040,
                width: 'min(320px, calc(100vw - 32px))',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                padding: '18px 20px',
                animation: closing ? 'feedbackOut 0.25s ease forwards' : 'feedbackIn 0.35s ease',
                overflow: 'hidden',
            }}
        >
            <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: '#f5f5f7', border: 'none', borderRadius: '50%',
                    width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', zIndex: 2,
                    transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ececef'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#86868b' }}>
                    close
                </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(249,115,22,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#f97316' }}>
                        rate_review
                    </span>
                </div>
                <h4 style={{
                    fontSize: '14px', fontWeight: 600, color: '#000',
                    margin: 0, letterSpacing: '-0.01em', paddingRight: '20px',
                }}>
                    How can we improve?
                </h4>
            </div>

            <p style={{
                fontSize: '13px', color: '#86868b',
                margin: '0 0 14px', lineHeight: 1.45, position: 'relative', zIndex: 1,
            }}>
                Got a minute? Tell us what's working and what's not. Your feedback shapes what we build next.
            </p>

            <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 1 }}>
                <Link
                    href={route('subscriber.feedback')}
                    onClick={() => localStorage.setItem(STORAGE_KEY, new Date().toISOString())}
                    style={{
                        flex: 1,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '9px 16px', borderRadius: '9999px',
                        background: '#000', color: '#fff',
                        fontSize: '13px', fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    Share feedback
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                        arrow_forward
                    </span>
                </Link>
                <button
                    onClick={handleClose}
                    style={{
                        padding: '9px 14px', borderRadius: '9999px',
                        background: 'transparent', color: '#86868b',
                        border: '1px solid #e5e5e7',
                        fontSize: '13px', fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#86868b'; }}
                >
                    Later
                </button>
            </div>

            <style>{`
                @keyframes feedbackIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes feedbackOut {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to { opacity: 0; transform: translateY(16px) scale(0.96); }
                }
            `}</style>
        </div>
    );
}
