import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import Metadata from '@/Components/Metadata';
import SocialLogin from '@/Components/SocialLogin';

export default function Login({ status, canResetPassword, error }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Fragment>
            <Metadata
                title="Login - Edatsu Media"
                description="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources."
                keywords="login, sign in, business insights, funding opportunities, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/login"
                ogTitle="Login to Edatsu Media"
                ogDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/login"
                twitterTitle="Login to Edatsu Media"
                twitterDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources."
                twitterImage="/img/logo/default_logo.jpg"
            />

            <GuestLayout>
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

                        {error && (
                            <div style={{
                                background: 'rgba(220,38,38,0.06)',
                                border: '1px solid rgba(220,38,38,0.15)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: '#dc2626',
                                marginBottom: '24px',
                                textAlign: 'center',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Social Login */}
                        <SocialLogin />

                        {/* Divider */}
                        <div className="d-flex align-items-center" style={{ margin: '24px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                            <span style={{ padding: '0 16px', fontSize: '12px', color: '#86868b' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                        </div>

                        {/* Form */}
                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '16px' }}>
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
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1 small text-danger" />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#86868b',
                                    marginBottom: '6px',
                                }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="form-control shadow-none"
                                        style={{
                                            padding: '12px 44px 12px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid #e5e5e7',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: '#000',
                                        }}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#86868b',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 small text-danger" />
                            </div>

                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '24px' }}>
                                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="me-2"
                                    />
                                    <span style={{ fontSize: '13px', color: '#86868b' }}>Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        style={{ fontSize: '13px', color: '#000', textDecoration: 'none', fontWeight: 500 }}
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Primary button - pill, black bg */}
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
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Bottom links */}
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '16px' }}>
                                Don't have an account?{' '}
                                <Link href="/register" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                                    Create one
                                </Link>
                            </p>
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
        </Fragment>
    );
}
