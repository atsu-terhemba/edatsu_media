import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePhotoForm from './Partials/UpdateProfilePhotoForm';

export default function Edit({ mustVerifyEmail, status }) {
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
