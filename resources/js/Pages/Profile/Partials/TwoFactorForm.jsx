import { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

export default function TwoFactorForm({ enabled: initialEnabled }) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [step, setStep] = useState('idle'); // idle, setup, verify, recovery, manage
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [secret, setSecret] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '12px',
        border: '1px solid #e5e5e7', background: '#fff', fontSize: '14px',
        color: '#000', outline: 'none', transition: 'border-color 0.15s ease',
    };
    const labelStyle = {
        display: 'block', fontSize: '12px', fontWeight: 500, color: '#86868b',
        marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
    };
    const btnPrimary = (disabled) => ({
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '10px 24px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500,
        background: disabled ? '#999' : '#000', color: '#fff', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
        opacity: disabled ? 0.7 : 1,
    });
    const btnSecondary = {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '10px 24px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500,
        background: '#fff', color: '#000', border: '1px solid #e5e5e7',
        cursor: 'pointer', transition: 'all 0.15s ease',
    };
    const btnDanger = (disabled) => ({
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '10px 24px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500,
        background: disabled ? '#999' : '#dc2626', color: '#fff', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
        opacity: disabled ? 0.7 : 1,
    });

    const reset = () => {
        setStep('idle');
        setPassword('');
        setCode('');
        setSecret('');
        setQrUrl('');
        setRecoveryCodes([]);
        setError('');
        setCopied(false);
    };

    const handleEnable = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/profile/two-factor/enable', { password });
            setSecret(res.data.secret);
            setQrUrl(res.data.qr_url);
            setStep('verify');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.password?.[0] || 'Invalid password.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/profile/two-factor/confirm', { code });
            setRecoveryCodes(res.data.recovery_codes);
            setEnabled(true);
            setStep('recovery');
            setCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/profile/two-factor/disable', { password });
            setEnabled(false);
            reset();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.password?.[0] || 'Invalid password.');
        } finally {
            setLoading(false);
        }
    };

    const handleShowCodes = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/profile/two-factor/recovery-codes', { password });
            setRecoveryCodes(res.data.recovery_codes);
            setStep('manage');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.password?.[0] || 'Invalid password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/profile/two-factor/regenerate', { password: prompt('Enter your password to regenerate codes:') });
            setRecoveryCodes(res.data.recovery_codes);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.password?.[0] || 'Failed to regenerate codes.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                        width: '32px', height: '32px', borderRadius: '10px', background: '#f5f5f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>
                            security
                        </span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                            Two-Factor Authentication
                        </h3>
                        {enabled && (
                            <span style={{
                                fontSize: '10px', fontWeight: 600, background: 'rgba(22,163,74,0.1)',
                                color: '#16a34a', padding: '3px 10px', borderRadius: '9999px',
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}>Enabled</span>
                        )}
                    </div>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 0 42px' }}>
                    Add an extra layer of security by requiring a verification code from an authenticator app when you sign in.
                </p>
            </div>

            {/* IDLE — Not enabled, show enable button */}
            {step === 'idle' && !enabled && (
                <form onSubmit={handleEnable}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input
                                type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password to enable 2FA"
                                style={inputStyle} required
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                        </div>
                        {error && <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>{error}</p>}
                        <div>
                            <button type="submit" disabled={loading || !password} style={btnPrimary(loading || !password)}>
                                {loading ? 'Setting up...' : 'Enable 2FA'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* IDLE — Already enabled, show manage options */}
            {step === 'idle' && enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>verified_user</span>
                        <span style={{ fontSize: '13px', color: '#15803d' }}>
                            Two-factor authentication is active. Your account has an extra layer of security.
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => setStep('show_codes')} style={btnSecondary}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>key</span>
                            View Recovery Codes
                        </button>
                        <button onClick={() => setStep('disable')} style={btnSecondary}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock_open</span>
                            Disable 2FA
                        </button>
                    </div>
                </div>
            )}

            {/* VERIFY — Show QR code and ask for verification code */}
            {step === 'verify' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                        padding: '20px', background: '#f5f5f7', borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                    }}>
                        <p style={{ fontSize: '13px', color: '#6e6e73', textAlign: 'center', margin: 0 }}>
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div style={{ padding: '16px', background: '#fff', borderRadius: '12px' }}>
                            <QRCodeSVG value={qrUrl} size={180} />
                        </div>
                        <div style={{ width: '100%' }}>
                            <p style={{ fontSize: '11px', color: '#86868b', marginBottom: '6px', textAlign: 'center' }}>
                                Or enter this code manually:
                            </p>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                <code style={{
                                    padding: '8px 16px', background: '#fff', borderRadius: '8px',
                                    border: '1px solid #e5e5e7', fontSize: '14px', fontWeight: 600,
                                    letterSpacing: '2px', color: '#000', userSelect: 'all',
                                }}>{secret}</code>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(secret)}
                                    style={{
                                        padding: '6px 10px', borderRadius: '8px', border: '1px solid #e5e5e7',
                                        background: '#fff', cursor: 'pointer', fontSize: '12px',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                        {copied ? 'check' : 'content_copy'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleConfirm}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Verification Code</label>
                                <input
                                    type="text" value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    style={{ ...inputStyle, letterSpacing: '4px', textAlign: 'center', fontSize: '20px', fontWeight: 600 }}
                                    maxLength={6} required autoFocus
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                />
                            </div>
                            {error && <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>{error}</p>}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="submit" disabled={loading || code.length !== 6} style={btnPrimary(loading || code.length !== 6)}>
                                    {loading ? 'Verifying...' : 'Verify & Enable'}
                                </button>
                                <button type="button" onClick={reset} style={btnSecondary}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* RECOVERY — Show recovery codes after successful setup */}
            {step === 'recovery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        padding: '16px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a',
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#d97706', flexShrink: 0 }}>warning</span>
                        <div>
                            <p style={{ fontSize: '13px', color: '#92400e', margin: 0, fontWeight: 600 }}>
                                Save these recovery codes
                            </p>
                            <p style={{ fontSize: '12px', color: '#a16207', margin: '4px 0 0' }}>
                                Store these codes in a safe place. Each code can only be used once if you lose access to your authenticator app.
                            </p>
                        </div>
                    </div>

                    <RecoveryCodesDisplay codes={recoveryCodes} onCopy={copyToClipboard} copied={copied} />

                    <div>
                        <button onClick={reset} style={btnPrimary(false)}>
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* SHOW_CODES — Password prompt to view recovery codes */}
            {step === 'show_codes' && (
                <form onSubmit={handleShowCodes}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input
                                type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password to view codes"
                                style={inputStyle} required autoFocus
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                        </div>
                        {error && <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>{error}</p>}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" disabled={loading || !password} style={btnPrimary(loading || !password)}>
                                {loading ? 'Verifying...' : 'View Codes'}
                            </button>
                            <button type="button" onClick={reset} style={btnSecondary}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}

            {/* MANAGE — View and regenerate recovery codes */}
            {step === 'manage' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <RecoveryCodesDisplay codes={recoveryCodes} onCopy={copyToClipboard} copied={copied} />

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={handleRegenerate} disabled={loading} style={btnSecondary}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                            {loading ? 'Regenerating...' : 'Regenerate Codes'}
                        </button>
                        <button onClick={reset} style={btnPrimary(false)}>Done</button>
                    </div>
                </div>
            )}

            {/* DISABLE — Password prompt to disable 2FA */}
            {step === 'disable' && (
                <form onSubmit={handleDisable}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{
                            padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca',
                            display: 'flex', alignItems: 'flex-start', gap: '12px',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#dc2626', flexShrink: 0 }}>error</span>
                            <p style={{ fontSize: '13px', color: '#991b1b', margin: 0 }}>
                                Disabling 2FA will remove the extra security from your account. You can re-enable it at any time.
                            </p>
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input
                                type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password to disable 2FA"
                                style={inputStyle} required autoFocus
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                        </div>
                        {error && <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>{error}</p>}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" disabled={loading || !password} style={btnDanger(loading || !password)}>
                                {loading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                            <button type="button" onClick={reset} style={btnSecondary}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}
        </section>
    );
}

function RecoveryCodesDisplay({ codes, onCopy, copied }) {
    const allCodes = codes.join('\n');
    return (
        <div style={{
            padding: '20px', background: '#f5f5f7', borderRadius: '12px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Recovery Codes
                </span>
                <button
                    type="button"
                    onClick={() => onCopy(allCodes)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 12px', borderRadius: '8px', border: '1px solid #e5e5e7',
                        background: '#fff', cursor: 'pointer', fontSize: '12px', color: '#6e6e73',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copied' : 'Copy all'}
                </button>
            </div>
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
            }}>
                {codes.map((code, i) => (
                    <code key={i} style={{
                        display: 'block', padding: '8px 12px', background: '#fff',
                        borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                        color: '#000', textAlign: 'center', letterSpacing: '1px',
                        border: '1px solid #e5e5e7',
                    }}>{code}</code>
                ))}
            </div>
        </div>
    );
}
