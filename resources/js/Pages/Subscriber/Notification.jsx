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
                    <Row>
                        <Col sm={3} className="d-none d-md-block">
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6} xs={12}>
                            <div className='border px-3 py-4 rounded my-3 text-center'>
                                <h2 className='poppins-semibold m-0 py-0'>Notifications</h2>
                            </div>
                        </Col>
                        <Col sm={3}>
                            {/* <div>main content</div> */}
                        </Col>
                    </Row>
                </Container>
            </Container>
            
        </AuthenticatedLayout>
    );
}
