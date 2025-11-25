import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Fragment, useState, useEffect } from 'react';
import Metadata from '@/Components/Metadata';
import SocialLogin from '@/Components/SocialLogin';

export default function Register({role}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'subscriber',
        password_confirmation: '',
    });

    // Features data for auto-scrolling
    const features = [
        {
            icon: '🎯',
            title: 'Personalized Dashboard',
            description: 'Access tailored opportunities and insights just for you'
        },
        {
            icon: '💼',
            title: 'Global Opportunities',
            description: 'Discover funding and business opportunities worldwide'
        },
        {
            icon: '📈',
            title: 'Track Your Progress',
            description: 'Monitor applications and success metrics in real-time'
        },
        {
            icon: '🔔',
            title: 'Smart Alerts',
            description: 'Never miss an opportunity with instant notifications'
        }
    ];

    // State for auto-scrolling features
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    // Auto-scroll features every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeatureIndex((prevIndex) => 
                (prevIndex + 1) % features.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [features.length]);

    const submit = (e) => {
        e.preventDefault();
        post(route('sign-up'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <Fragment>
           <Metadata
            title="Sign Up - Edatsu Media"
            description="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            keywords="sign up, create account, business opportunities, funding resources, finance tools, entrepreneur support, grants and investments, Edatsu Media"
            canonicalUrl="https://www.edatsu.com/signup"
            ogTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            ogDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            ogImage="/img/logo/default_logo.jpg"
            ogUrl="https://www.edatsu.com/signup"
            twitterTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            twitterDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            twitterImage="/img/logo/default_logo.jpg"
            />

        <GuestLayout>
            <style>{`
                .register-container {
                    min-height: 100vh;
                }
                
                .register-container .row {
                    min-height: 100vh;
                }
                
                .register-container .col-lg-7,
                .register-container .col-md-6 {
                    min-height: 100vh;
                }
                
                .hero-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                    min-height: 100vh;
                    height: 100%;
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
                    border-radius: 16px;
                    padding: 2rem;
                    margin: 1rem 0;
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

                .features-container {
                    position: relative;
                    height: 120px;
                    overflow: hidden;
                    margin: 1.5rem 0;
                }

                .feature-slide {
                    position: absolute;
                    width: 100%;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    transform: translateY(20px);
                }

                .feature-slide.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .feature-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 1rem;
                }

                .feature-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .feature-indicator.active {
                    background: rgba(255, 255, 255, 0.8);
                    transform: scale(1.2);
                }
                
                @media (max-width: 768px) {
                    .register-container {
                        min-height: 100vh;
                        max-height: none;
                        overflow: auto;
                    }
                    
                    .register-container .row {
                        min-height: 100vh;
                        flex-direction: column;
                    }
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
                        min-height: 40vh;
                    }
                    
                    .hero-section {
                        min-height: 40vh;
                        padding: 2rem 1rem;
                    }
                    
                    .form-section {
                        min-height: 60vh;
                        padding: 1rem;
                        align-items: flex-start;
                        padding-top: 2rem;
                    }
                    
                    .content-overlay {
                        padding: 1rem;
                    }
                    
                    .hero-illustration {
                        display: none;
                    }
                    
                    .form-container {
                        margin: 0;
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 992px) {
                    .form-section {
                        align-items: flex-start;
                        padding-top: 2rem;
                        padding-bottom: 2rem;
                    }
                    
                    .hero-section {
                        min-height: 60vh;
                    }
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
                        min-height: 60vh;
                    }
                }

                @media (max-height: 800px) {
                    .hero-section {
                        min-height: 50vh;
                    }
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
                        min-height: 50vh;
                    }
                    
                    .form-section {
                        min-height: 50vh;
                        align-items: flex-start;
                        padding-top: 1rem;
                    }
                    
                    .register-container {
                        overflow: auto;
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
            
            <div className="register-container">
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
                                    Start your journey today!
                                </h1>
                                <p className="welcome-subtitle">
                                    Join thousands of entrepreneurs discovering opportunities worldwide
                                </p>
                                
                                <div className="features-container">
                                    {features.map((feature, index) => (
                                        <div 
                                            key={index}
                                            className={`feature-slide ${index === currentFeatureIndex ? 'active' : ''}`}
                                        >
                                            <div className="feature-item">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="feature-icon">
                                                        <span style={{fontSize: '1.5rem'}}>{feature.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1 fw-semibold">{feature.title}</h6>
                                                        <small className="opacity-75">{feature.description}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="feature-indicators">
                                    {features.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`feature-indicator ${index === currentFeatureIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentFeatureIndex(index)}
                                        />
                                    ))}
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
                                            <div className="fw-bold fs-4">Free</div>
                                            <small className="opacity-75">To Join</small>
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
                                <div className="text-center mb-4">
                                    <h2 className="h4 fw-bold text-dark mb-2">Create Account</h2>
                                    <p className="text-muted small">Fill in your details to get started</p>
                                </div>
                                
                                <form onSubmit={submit}>
                                    <div className="mb-3">
                                        <InputLabel htmlFor="name" value="Username" className="form-label fw-semibold" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="form-control shadow-none focus:shadow-none"
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '16px'
                                            }}
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <small className='text-secondary small d-block mt-1'>
                                            <strong className='text-danger'>* </strong>
                                            Spaces not allowed. Use underscores instead
                                        </small>
                                        <InputError message={errors.name} className="mt-1 text-danger small" />
                                    </div>

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
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
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
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
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
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="form-label fw-semibold" />
                                        <div className="password-input-wrapper">
                                            <TextInput
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? "text" : "password"}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="form-control shadow-none focus:shadow-none"
                                                style={{
                                                    padding: '12px 40px 12px 16px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e9ecef',
                                                    fontSize: '16px'
                                                }}
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                                            >
                                                {showPasswordConfirmation ? (
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
                                        <InputError message={errors.password_confirmation} className="mt-1 text-danger small" />
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
                                        {processing ? 'Creating account...' : 'Create Account'}
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
                                        Already have an account? 
                                        <Link href="/login" className="text-primary text-decoration-none fw-semibold ms-1">
                                            Sign in here
                                        </Link>
                                    </p>
                                    <p className="small text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                                        By signing up you agree to the <Link href="/terms" className="text-primary text-decoration-none">Terms of Service</Link> and <Link href="/privacy" className="text-primary text-decoration-none">Privacy Policy</Link>
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
