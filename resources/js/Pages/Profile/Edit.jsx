import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/Footer';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
                            <div className='py-3 rounded my-3 px-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 fw-bold'>Profile Settings</h4>
                                    <i className='bi bi-person-circle text-primary' style={{fontSize: '1.5rem'}}></i>
                                </div>
                            </div>

                            <Card className="mb-3" style={{border: '1px solid #dee2e6', boxShadow: 'none'}}>
                                <Card.Body className="p-4">
                                    <UpdateProfilePhotoForm />
                                </Card.Body>
                            </Card>

                            <Card className="mb-3" style={{border: '1px solid #dee2e6', boxShadow: 'none'}}>
                                <Card.Body className="p-4">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                    />
                                </Card.Body>
                            </Card>

                            <Card className="mb-3" style={{border: '1px solid #dee2e6', boxShadow: 'none'}}>
                                <Card.Body className="p-4">
                                    <UpdatePasswordForm />
                                </Card.Body>
                            </Card>

                            <Card className="mb-3" style={{border: '1px solid #dee2e6', boxShadow: 'none'}}>
                                <Card.Body className="p-4">
                                    <DeleteUserForm />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
        </AuthenticatedLayout>
    );
}
