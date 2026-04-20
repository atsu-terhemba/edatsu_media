import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function EmailVerificationOverlay() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    if (!user || user.email_verified_at) return null;

    const resend = () => {
        if (sending) return;
        setSending(true);
        setError(null);
        router.post(route('verification.send'), {}, {
            preserveScroll: true,
            onSuccess: () => setSent(true),
            onError: () => setError('Could not send. Try again in a moment.'),
            onFinish: () => setSending(false),
        });
    };

    const logout = () => {
        router.post(route('logout'));
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div style={{
                maxWidth: '440px',
                width: '100%',
                background: '#fff',
                borderRadius: '16px',
                padding: '40px 32px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#fff7ed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#f97316' }}>
                        mark_email_unread
                    </span>
                </div>

                <span style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#86868b',
                    display: 'block',
                    marginBottom: '8px',
                }}>
                    Verify your email
                </span>

                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#000',
                    margin: '0 0 12px',
                    letterSpacing: '-0.01em',
                }}>
                    One more step
                </h2>

                <p style={{ fontSize: '14px', color: '#52525b', lineHeight: 1.55, margin: '0 0 24px' }}>
                    We sent a verification link to <strong style={{ color: '#000' }}>{user.email}</strong>.
                    Click it to unlock your dashboard.
                </p>

                {sent && (
                    <div style={{
                        fontSize: '13px',
                        color: '#15803d',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                    }}>
                        A new verification link is on the way.
                    </div>
                )}

                {error && (
                    <div style={{
                        fontSize: '13px',
                        color: '#b91c1c',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={resend}
                    disabled={sending}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: sending ? 'wait' : 'pointer',
                        opacity: sending ? 0.7 : 1,
                        transition: 'opacity 0.15s ease',
                        marginBottom: '10px',
                    }}
                >
                    {sending ? 'Sending...' : 'Resend verification email'}
                </button>

                <button
                    type="button"
                    onClick={logout}
                    style={{
                        width: '100%',
                        padding: '10px 24px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: 'transparent',
                        color: '#52525b',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                    }}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
