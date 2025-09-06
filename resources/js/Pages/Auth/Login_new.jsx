import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import Metadata from '@/Components/Metadata';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SocialLogin from '@/Components/SocialLogin';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

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
                    max-height: 100vh;
                    overflow: hidden;
                }
                
                .hero-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                
                .hero-illustration {
                    position: absolute;
                    right: -10%;
                    top: 10%;
                    width: 120%;
                    height: 80%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.1'%3E%3Ccircle cx='400' cy='300' r='200'/%3E%3Ccircle cx='400' cy='300' r='150'/%3E%3Ccircle cx='400' cy='300' r='100'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;
                    background-size: contain;
                }
                
                .content-overlay {
                    position: relative;
                    z-index: 2;
                    color: white;
                    padding: 2rem;
                }
                
                .form-section {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fafbfc;
                    padding: 2rem 1rem;
                }
                
                .form-container {
                    width: 100%;
                    max-width: 400px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    padding: 2rem;
                }
                
                .feature-item {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                }
                
                .feature-item:hover {
                    background: rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                }
                
                @media (max-width: 768px) {
                    .login-container {
                        min-height: 100vh;
                        max-height: none;
                        overflow: auto;
                    }
                    
                    .hero-section {
                        min-height: 40vh;
                        padding: 2rem 1rem;
                    }
                    
                    .form-section {
                        min-height: 60vh;
                        padding: 1rem;
                    }
                    
                    .content-overlay {
                        padding: 1rem;
                    }
                    
                    .hero-illustration {
                        display: none;
                    }
                }
                
                .brand-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 2rem;
                }
                
                .welcome-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                }
                
                .welcome-subtitle {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                
                @media (max-width: 768px) {
                    .welcome-title {
                        font-size: 2rem;
                    }
                    
                    .welcome-subtitle {
                        font-size: 1rem;
                    }
                }
            `}</style>
            
            <div className="login-container">
                <div className="row g-0 h-100">
                    {/* Hero Section - Left Side */}
                    <div className="col-lg-7 col-md-6">
                        <div className="hero-section">
                            <div className="hero-illustration"></div>
                            <div className="content-overlay">
                                <div className="brand-logo">
                                    edatsu.media
                                </div>
                                
                                <h1 className="welcome-title">
                                    Welcome back!
                                </h1>
                                <p className="welcome-subtitle">
                                    Continue with the intelligence platform trusted by entrepreneurs worldwide
                                </p>
                                
                                <div className="features-grid">
                                    <div className="feature-item">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="feature-icon">
                                                <span style={{fontSize: '1.5rem'}}>🔔</span>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-semibold">Smart Notifications</h6>
                                                <small className="opacity-75">Get alerts for opportunities matching your interests</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="feature-icon">
                                                <span style={{fontSize: '1.5rem'}}>🛠️</span>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-semibold">Productivity Tools</h6>
                                                <small className="opacity-75">Calendar sync, deadline tracking, and more</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="feature-icon">
                                                <span style={{fontSize: '1.5rem'}}>📊</span>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-semibold">Analytics Dashboard</h6>
                                                <small className="opacity-75">Track your success and application progress</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="feature-icon">
                                                <span style={{fontSize: '1.5rem'}}>🎯</span>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-semibold">AI-Powered Matching</h6>
                                                <small className="opacity-75">Personalized opportunity recommendations</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-3 border-top border-light border-opacity-25">
                                    <div className="d-flex gap-3 text-center">
                                        <div className="flex-fill">
                                            <div className="fw-bold fs-4">10K+</div>
                                            <small className="opacity-75">Active Users</small>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="fw-bold fs-4">500+</div>
                                            <small className="opacity-75">Opportunities</small>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="fw-bold fs-4">95%</div>
                                            <small className="opacity-75">Success Rate</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Section - Right Side */}
                    <div className="col-lg-5 col-md-6">
                        <div className="form-section">
                            <div className="form-container">
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
                                            className="form-control"
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
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="form-control"
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '16px'
                                            }}
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
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
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                
                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="small text-muted mb-0">
                                        Don't have an account? 
                                        <Link href="/register" className="text-primary text-decoration-none fw-semibold ms-1">
                                            Create one here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
         </Fragment>
    );
}
