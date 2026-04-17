import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                padding: '96px 24px 48px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    {/* Brand heading */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <span style={{
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.02em',
                            }}>
                                edatsu<span style={{ color: '#f97316' }}>.</span>media
                            </span>
                        </Link>
                    </div>

                    {/* Icon */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#fff7ed',
                            border: '1px solid #fed7aa',
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '28px',
                                color: '#f97316',
                                fontVariationSettings: "'FILL' 1",
                            }}>
                                lock_reset
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#000',
                        textAlign: 'center',
                        margin: '0 0 8px',
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        Reset your password
                    </h2>

                    <p style={{
                        fontSize: '14px',
                        color: '#86868b',
                        textAlign: 'center',
                        lineHeight: 1.5,
                        margin: '0 0 32px',
                    }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {status && (
                        <div style={{
                            background: 'rgba(22,163,74,0.06)',
                            border: '1px solid rgba(22,163,74,0.15)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#16a34a',
                            marginBottom: '24px',
                            textAlign: 'center',
                        }}>
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#86868b',
                                marginBottom: '6px',
                            }}>
                                Email
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control shadow-none"
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e5e7',
                                    fontSize: '14px',
                                    background: '#fff',
                                    color: '#000',
                                }}
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 small text-danger" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '12px 32px',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: 500,
                                textAlign: 'center',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                border: 'none',
                                background: '#000',
                                color: '#fff',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                        >
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to login */}
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Link
                            href="/login"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px',
                                color: '#86868b',
                                textDecoration: 'none',
                                fontWeight: 500,
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                            Back to login
                        </Link>
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: '48px',
                        paddingTop: '24px',
                        borderTop: '1px solid #f0f0f0',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px',
                            marginBottom: '16px',
                            flexWrap: 'wrap',
                        }}>
                            <Link href="/terms" style={{ fontSize: '12px', color: '#86868b', textDecoration: 'none', transition: 'color 0.15s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                            >
                                Terms of Service
                            </Link>
                            <Link href="/privacy" style={{ fontSize: '12px', color: '#86868b', textDecoration: 'none', transition: 'color 0.15s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                            >
                                Privacy Policy
                            </Link>
                            <Link href="/help" style={{ fontSize: '12px', color: '#86868b', textDecoration: 'none', transition: 'color 0.15s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                            >
                                Help
                            </Link>
                        </div>
                        <p style={{ fontSize: '11px', color: '#b0b0b5', margin: 0 }}>
                            &copy; {new Date().getFullYear()} Edatsu Media. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
