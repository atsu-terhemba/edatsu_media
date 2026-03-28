import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TwoFactorChallenge() {
    const [useRecovery, setUseRecovery] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('2fa.verify'));
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: '12px',
        border: '1px solid #e5e5e7', background: '#fff', fontSize: useRecovery ? '14px' : '24px',
        color: '#000', outline: 'none', transition: 'border-color 0.15s ease',
        textAlign: 'center', fontWeight: 600, letterSpacing: useRecovery ? '1px' : '6px',
        fontFamily: "'Poppins', sans-serif",
    };

    return (
        <GuestLayout>
            <Head title="Two-Factor Authentication" />

            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', padding: '96px 24px 48px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px', background: '#f5f5f7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#000' }}>
                                {useRecovery ? 'key' : 'security'}
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: '24px', fontWeight: 600, color: '#000',
                            letterSpacing: '-0.02em', margin: '0 0 8px',
                        }}>
                            {useRecovery ? 'Recovery Code' : 'Two-Factor Authentication'}
                        </h1>
                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
                            {useRecovery
                                ? 'Enter one of your recovery codes to access your account.'
                                : 'Enter the 6-digit code from your authenticator app.'}
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => {
                                    const val = useRecovery ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setData('code', val);
                                }}
                                placeholder={useRecovery ? 'Enter recovery code' : '000000'}
                                style={inputStyle}
                                maxLength={useRecovery ? 20 : 6}
                                autoFocus
                                autoComplete="one-time-code"
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                            {errors.code && (
                                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px', textAlign: 'center' }}>
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || (!useRecovery && data.code.length !== 6) || (useRecovery && !data.code)}
                            style={{
                                width: '100%', padding: '12px 24px', borderRadius: '9999px',
                                fontSize: '14px', fontWeight: 500, border: 'none',
                                background: processing ? '#999' : '#000', color: '#fff',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                opacity: processing ? 0.7 : 1,
                            }}
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setUseRecovery(!useRecovery);
                                setData('code', '');
                            }}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '13px', color: '#86868b', textDecoration: 'underline',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            {useRecovery ? 'Use authenticator code instead' : 'Use a recovery code'}
                        </button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
