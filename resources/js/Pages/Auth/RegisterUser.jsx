import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import Metadata from '@/Components/Metadata';
import SocialLogin from '@/Components/SocialLogin';
import { Container, Row, Col } from 'react-bootstrap';

export default function Register({ role }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'subscriber',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('sign-up'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const benefits = [
        { icon: 'search', title: 'Discover Opportunities', desc: 'Access funding, grants, and accelerator programs from around the world.' },
        { icon: 'bookmark', title: 'Save & Organize', desc: 'Bookmark opportunities and tools to revisit anytime.' },
        { icon: 'notifications', title: 'Never Miss a Deadline', desc: 'Get reminders for application deadlines that matter to you.' },
        { icon: 'handyman', title: 'Business Tools', desc: 'Find the right software and resources to grow your venture.' },
    ];

    const inputStyle = {
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #e5e5e7',
        fontSize: '14px',
        background: '#fff',
        color: '#000',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: 500,
        color: '#86868b',
        marginBottom: '6px',
    };

    return (
        <Fragment>
            <Metadata
                title="Sign Up - Edatsu Media"
                description="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources."
                keywords="sign up, create account, business opportunities, funding resources, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/signup"
                ogTitle="Join Edatsu Media"
                ogDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/signup"
                twitterTitle="Join Edatsu Media"
                twitterDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources."
                twitterImage="/img/logo/default_logo.jpg"
            />

            <GuestLayout>
                {/* Hero Section */}
                <section className="position-relative" style={{
                    backgroundImage: "url('/img/defaults/banner_business.jpg')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                }}>
                    <div style={{
                        position: 'relative',
                        padding: '140px 0 80px',
                        textAlign: 'center',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.82) 100%)',
                    }}>
                        <Container>
                            <Row className="justify-content-center">
                                <Col xs={12} md={10} lg={7}>
                                    <div className="d-flex flex-column align-items-center">
                                        <div className="d-flex flex-column align-items-center mb-4">
                                            <span
                                                className="section-eyebrow"
                                                style={{ color: 'rgba(255,255,255,0.5)' }}
                                            >
                                                Join Us
                                            </span>
                                            <div className="eyebrow-bar" />
                                        </div>

                                        <h1 style={{
                                            fontSize: 'clamp(32px, 6vw, 48px)',
                                            fontWeight: 600,
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em',
                                            color: '#fff',
                                            marginBottom: '16px',
                                        }}>
                                            Start your journey{' '}
                                            <span style={{ color: '#f97316' }}>today</span>
                                        </h1>

                                        <p style={{
                                            fontSize: 'clamp(14px, 1.5vw, 16px)',
                                            lineHeight: 1.625,
                                            fontWeight: 400,
                                            color: 'rgba(255,255,255,0.6)',
                                            maxWidth: '520px',
                                            margin: '0 auto',
                                        }}>
                                            Join thousands of entrepreneurs discovering funding, grants, and tools to grow their business.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </section>

                {/* Form + Benefits Section */}
                <section style={{ padding: '64px 0 96px', background: '#f5f5f7' }}>
                    <Container>
                        <Row className="g-5 justify-content-center">
                            {/* Form Card */}
                            <Col lg={5} md={7}>
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '24px',
                                    padding: '40px 32px',
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                        <h2 style={{
                                            fontSize: '22px',
                                            fontWeight: 600,
                                            color: '#000',
                                            letterSpacing: '-0.01em',
                                            marginBottom: '6px',
                                        }}>
                                            Create Account
                                        </h2>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                            It's free — takes less than a minute
                                        </p>
                                    </div>

                                    {/* Social Login */}
                                    <SocialLogin />

                                    {/* Divider */}
                                    <div className="d-flex align-items-center" style={{ margin: '20px 0' }}>
                                        <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                                        <span style={{ padding: '0 16px', fontSize: '12px', color: '#86868b' }}>or</span>
                                        <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                                    </div>

                                    <form onSubmit={submit}>
                                        <div style={{ marginBottom: '14px' }}>
                                            <label style={labelStyle}>Username</label>
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="form-control shadow-none"
                                                style={inputStyle}
                                                autoComplete="name"
                                                isFocused={true}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <small style={{ fontSize: '11px', color: '#86868b', marginTop: '4px', display: 'block' }}>
                                                No spaces — use underscores instead
                                            </small>
                                            <InputError message={errors.name} className="mt-1 small text-danger" />
                                        </div>

                                        <div style={{ marginBottom: '14px' }}>
                                            <label style={labelStyle}>Email</label>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="form-control shadow-none"
                                                style={inputStyle}
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-1 small text-danger" />
                                        </div>

                                        <div style={{ marginBottom: '14px' }}>
                                            <label style={labelStyle}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <TextInput
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={data.password}
                                                    className="form-control shadow-none"
                                                    style={{ ...inputStyle, paddingRight: '44px' }}
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
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

                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={labelStyle}>Confirm Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <TextInput
                                                    id="password_confirmation"
                                                    type={showPasswordConfirmation ? "text" : "password"}
                                                    name="password_confirmation"
                                                    value={data.password_confirmation}
                                                    className="form-control shadow-none"
                                                    style={{ ...inputStyle, paddingRight: '44px' }}
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
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
                                                        {showPasswordConfirmation ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                            </div>
                                            <InputError message={errors.password_confirmation} className="mt-1 small text-danger" />
                                        </div>

                                        {/* Primary pill button */}
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
                                            {processing ? 'Creating account...' : 'Create Account'}
                                        </button>
                                    </form>

                                    {/* Bottom links */}
                                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                        <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '12px' }}>
                                            Already have an account?{' '}
                                            <Link href="/login" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                                                Sign in
                                            </Link>
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
                                            By signing up you agree to the{' '}
                                            <Link href="/terms" style={{ color: '#000', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
                                            <Link href="/privacy" style={{ color: '#000', textDecoration: 'none' }}>Privacy Policy</Link>.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            {/* Benefits Side */}
                            <Col lg={5} md={7}>
                                <div style={{ paddingTop: '16px' }}>
                                    <div className="d-flex flex-column align-items-start mb-3">
                                        <span
                                            className="section-eyebrow"
                                            style={{ color: '#86868b' }}
                                        >
                                            Why Join
                                        </span>
                                        <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                                    </div>

                                    <h2 style={{
                                        fontSize: 'clamp(24px, 3vw, 30px)',
                                        fontWeight: 600,
                                        color: '#000',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.15,
                                        marginBottom: '12px',
                                    }}>
                                        Everything you need to find your next opportunity
                                    </h2>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#86868b',
                                        lineHeight: 1.625,
                                        marginBottom: '32px',
                                    }}>
                                        Edatsu brings together the resources entrepreneurs need — all in one place.
                                    </p>

                                    <div className="d-flex flex-column gap-3">
                                        {benefits.map((item, i) => (
                                            <div
                                                key={i}
                                                className="d-flex align-items-start gap-3"
                                                style={{
                                                    background: '#fff',
                                                    borderRadius: '16px',
                                                    padding: '20px',
                                                    border: '1px solid #f0f0f0',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#e5e5e5';
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#f0f0f0';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '18px' }}>
                                                        {item.icon}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: '#000',
                                                        marginBottom: '4px',
                                                        letterSpacing: '-0.01em',
                                                    }}>
                                                        {item.title}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#86868b',
                                                        lineHeight: 1.5,
                                                    }}>
                                                        {item.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="d-flex gap-4 flex-wrap" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
                                        {[
                                            { num: '5,000+', label: 'Users' },
                                            { num: '500+', label: 'Opportunities' },
                                            { num: '30+', label: 'Countries' },
                                        ].map((stat, i) => (
                                            <div key={i}>
                                                <div style={{ fontSize: '22px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>{stat.num}</div>
                                                <div style={{ fontSize: '12px', color: '#86868b', marginTop: '2px' }}>{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </GuestLayout>
        </Fragment>
    );
}
