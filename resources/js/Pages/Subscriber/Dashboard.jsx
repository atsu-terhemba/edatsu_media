import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';

export default function Dashboard() {

    useEffect(()=>{
       
    })

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='border px-3 py-4 rounded my-3 text-center'>
                                <h2 className='poppins-semibold m-0 py-0'>Dashboard</h2>
                            </div>
                            <div>
                                <p className='poppins-semibold m-0 p-0'>Welcome!</p>
                                <p className='fs-8'>
                                Your dashboard is a little quiet right now, but we're working on something awesome behind the scenes. Stay tuned — exciting updates are on the way!
                                </p>
                                <Link  href={route('subscriber.bookmarks')} className=' fs-8 btn btn-success shadow-sm border-0 px-3'>See Bookmarks</Link>
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
