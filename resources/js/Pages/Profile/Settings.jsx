import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import DeleteUserForm from './Partials/DeleteUserForm';
import TwoFactorForm from './Partials/TwoFactorForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

export default function Settings({ twoFactorEnabled }) {
    const tabStyle = (active) => ({
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 18px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
        textDecoration: 'none', transition: 'all 0.15s ease',
        background: active ? '#000' : '#f5f5f7',
        color: active ? '#fff' : '#6e6e73',
        border: 'none',
    });

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />

            <Container fluid={true}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div style={{ paddingTop: '96px', marginBottom: '24px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600, color: '#000',
                                    letterSpacing: '-0.02em', margin: 0,
                                }}>
                                    Settings
                                </h2>
                                <p style={{
                                    fontSize: '14px', color: '#86868b',
                                    marginTop: '6px', marginBottom: 0,
                                }}>
                                    Manage your security and account preferences
                                </p>
                            </div>

                            {/* Tab Navigation */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                <Link href={route('profile.edit')} style={tabStyle(false)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
                                    Profile
                                </Link>
                                <span style={tabStyle(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>settings</span>
                                    Settings
                                </span>
                            </div>

                            {/* Password */}
                            <div style={{
                                background: '#fff', border: '1px solid #f0f0f0',
                                borderRadius: '16px', padding: '32px',
                                marginBottom: '12px', transition: 'all 0.3s ease',
                            }}>
                                <UpdatePasswordForm />
                            </div>

                            {/* Two-Factor Authentication */}
                            <div style={{
                                background: '#fff', border: '1px solid #f0f0f0',
                                borderRadius: '16px', padding: '32px',
                                marginBottom: '12px', transition: 'all 0.3s ease',
                            }}>
                                <TwoFactorForm enabled={twoFactorEnabled} />
                            </div>

                            {/* Delete Account */}
                            <div style={{
                                background: '#fff', border: '1px solid #f0f0f0',
                                borderRadius: '16px', padding: '32px',
                                marginBottom: '64px', transition: 'all 0.3s ease',
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
