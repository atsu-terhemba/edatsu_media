import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import Metadata from '@/Components/Metadata';
import SocialLogin from '@/Components/SocialLogin';

export default function Login({ status, canResetPassword }) {
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
                description="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
                keywords="login, sign in, business insights, funding opportunities, finance tools, entrepreneur support, grants and investments, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/login"
                ogTitle="Login to Edatsu Media - Business Insights & Funding Opportunities"
                ogDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/login"
                twitterTitle="Login to Edatsu Media - Business Insights & Funding Opportunities"
                twitterDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
                twitterImage="/img/logo/default_logo.jpg"
            />

            <GuestLayout>
                <style>{`
                    .login-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fafbfc;
                        padding: 2rem 1rem;
                    }
                    
                    .form-container {
                        width: 100%;
                        max-width: 450px;
                        border-radius: 16px;
                        padding: 2.5rem;
                        margin: 1rem auto;
                    }
                    
                    .brand-logo {
                        text-align: center;
                        font-size: 1.8rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 2rem;
                    }
                    
                    .password-input-wrapper {
                        position: relative;
                    }
                    
                    .password-toggle-btn {
                        position: absolute;
                        right: 12px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: none;
                        border: none;
                        color: #6c757d;
                        cursor: pointer;
                        padding: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .password-toggle-btn:hover {
                        color: #495057;
                    }
                    
                    @media (max-width: 768px) {
                        .login-container {
                            padding: 1rem;
                        }
                        
                        .form-container {
                            padding: 2rem 1.5rem;
                        }
                    }
                `}</style>
                
                <div className="login-container">
                    <div className="form-container">
                        <div className="brand-logo">
                            edatsu.media
                        </div>
                        
                        {status && (
                            <div className="alert alert-success mb-4">
                                {status}
                            </div>
                        )}
                        
                        <div className="text-center mb-4">
                            <h2 className="h4 fw-bold text-dark mb-2">Sign In</h2>
                            <p className="text-muted small">Enter your credentials to access your account</p>
                        </div>
                        
                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <InputLabel htmlFor="email" value="Email address" className="form-label fw-semibold" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="form-control shadow-none focus:shadow-none"
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '2px solid #e9ecef',
                                        fontSize: '16px'
                                    }}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1 text-danger small" />
                            </div>

                            <div className="mb-3">
                                <InputLabel htmlFor="password" value="Password" className="form-label fw-semibold" />
                                <div className="password-input-wrapper">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="form-control shadow-none focus:shadow-none"
                                        style={{
                                            padding: '12px 40px 12px 16px',
                                            borderRadius: '8px',
                                            border: '2px solid #e9ecef',
                                            fontSize: '16px'
                                        }}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-danger small" />
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="d-flex align-items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', e.target.checked)
                                            }
                                            className="me-2"
                                        />
                                        <span className="small text-muted">Remember me</span>
                                    </label>
                                    
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="small text-primary text-decoration-none"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="btn w-100 fw-semibold"
                                disabled={processing}
                                style={{
                                    background: '#1a1a2e',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        
                        <div className="text-center my-4">
                            <div className="d-flex align-items-center">
                                <hr className="flex-grow-1" />
                                <span className="px-3 small text-muted">or continue with</span>
                                <hr className="flex-grow-1" />
                            </div>
                        </div>
                        
                        <SocialLogin />
                        
                        <div className="text-center mt-4 pt-3 border-top">
                            <p className="small text-muted mb-2">
                                Don't have an account? 
                                <Link href="/register" className="text-primary text-decoration-none fw-semibold ms-1">
                                    Create one here
                                </Link>
                            </p>
                            <p className="small text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                                By continuing, you agree to the Edatsu Media <Link href="/terms" className="text-primary text-decoration-none">Terms of Service</Link>, the <Link href="/privacy" className="text-primary text-decoration-none">Privacy Policy</Link>, and other relevant policies. This site uses cookies. See our <Link href="/cookies" className="text-primary text-decoration-none">Cookie Policy</Link> for more information.
                            </p>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </Fragment>
    );
}
