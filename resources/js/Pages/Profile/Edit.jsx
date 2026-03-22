import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePhotoForm from './Partials/UpdateProfilePhotoForm';

export default function Edit({ mustVerifyEmail, status, currentPlan, activeSubscription }) {
    const isPro = currentPlan === 'Pro';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <Container fluid={true}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div style={{ paddingTop: '96px', marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                }}>
                                    Profile Settings
                                </h2>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#86868b',
                                    marginTop: '6px',
                                    marginBottom: 0,
                                }}>
                                    Manage your account details and security
                                </p>
                            </div>

                            {/* Subscription Plan Card */}
                            <div style={{
                                background: isPro
                                    ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)'
                                    : '#fff',
                                border: isPro ? 'none' : '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '24px 32px',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                flexWrap: 'wrap',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {isPro && (
                                    <div style={{
                                        position: 'absolute', top: '-40px', right: '-30px',
                                        width: '160px', height: '160px',
                                        background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
                                        pointerEvents: 'none',
                                    }} />
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: isPro ? 'rgba(249,115,22,0.12)' : '#f5f5f7',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{
                                            fontSize: '22px',
                                            color: isPro ? '#f97316' : '#86868b',
                                        }}>
                                            {isPro ? 'workspace_premium' : 'star'}
                                        </span>
                                    </div>
                                    <div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}>
                                            <span style={{
                                                fontSize: '16px', fontWeight: 600,
                                                color: isPro ? '#fff' : '#000',
                                            }}>
                                                {currentPlan} Plan
                                            </span>
                                            {isPro && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 600,
                                                    background: 'rgba(22,163,74,0.15)',
                                                    color: '#4ade80',
                                                    padding: '3px 10px',
                                                    borderRadius: '9999px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em',
                                                }}>
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: isPro ? 'rgba(255,255,255,0.45)' : '#86868b',
                                            marginTop: '2px',
                                        }}>
                                            {isPro && activeSubscription
                                                ? `Renews ${formatDate(activeSubscription.ends_at)}`
                                                : 'Upgrade for unlimited features'}
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={isPro ? route('subscriber.billing') : route('subscription')}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '9px 20px', borderRadius: '9999px',
                                        fontSize: '13px', fontWeight: 500,
                                        textDecoration: 'none',
                                        background: isPro ? 'rgba(255,255,255,0.08)' : '#000',
                                        color: isPro ? 'rgba(255,255,255,0.7)' : '#fff',
                                        border: isPro ? '1px solid rgba(255,255,255,0.12)' : 'none',
                                        position: 'relative', zIndex: 1,
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                        {isPro ? 'credit_card' : 'upgrade'}
                                    </span>
                                    {isPro ? 'Manage Billing' : 'Upgrade to Pro'}
                                </Link>
                            </div>

                            {/* Photo */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '32px',
                                marginBottom: '12px',
                                transition: 'all 0.3s ease',
                            }}>
                                <UpdateProfilePhotoForm />
                            </div>

                            {/* Profile info */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '32px',
                                marginBottom: '12px',
                                transition: 'all 0.3s ease',
                            }}>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            {/* Password */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '32px',
                                marginBottom: '12px',
                                transition: 'all 0.3s ease',
                            }}>
                                <UpdatePasswordForm />
                            </div>

                            {/* Delete */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '32px',
                                marginBottom: '64px',
                                transition: 'all 0.3s ease',
                            }}>
                                <DeleteUserForm />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
