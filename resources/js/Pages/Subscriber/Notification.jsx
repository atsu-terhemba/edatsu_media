import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';

export default function Notifications() {

    useEffect(()=>{
       
    })

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav/>
                        </Col>
                        <Col md={9} xs={12}>
                            <div className='border px-3 py-4 rounded text-center'>
                                <h2 className='poppins-semibold m-0 py-0'>Notifications</h2>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            
        </AuthenticatedLayout>
    );
}
