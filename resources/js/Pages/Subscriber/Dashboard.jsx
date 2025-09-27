import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';

export default function Dashboard({ dashboardStats }) {

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
                            
                            {/* Dashboard Statistics */}
                            <Row className='mb-4'>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 shadow-sm border-0' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                                        <Card.Body className='text-white'>
                                            <div className='mb-2'>
                                                <i className='bi bi-bookmark-fill' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1'>
                                                {dashboardStats?.totalBookmarkedTools || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 opacity-75'>
                                                Bookmarked Tools
                                            </Card.Text>
                                            <small className='opacity-75'>Click below to manage</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 shadow-sm border-0' style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                                        <Card.Body className='text-white'>
                                            <div className='mb-2'>
                                                <i className='bi bi-calendar-event' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1'>
                                                {dashboardStats?.upcomingOpportunities || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 opacity-75'>
                                                Upcoming Opportunities
                                            </Card.Text>
                                            <small className='opacity-75'>Don't miss out!</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Quick Actions */}
                            <div className='mb-4'>
                                <h5 className='poppins-semibold mb-3'>Quick Actions</h5>
                                <Row>
                                    <Col md={4} className='mb-2'>
                                        <Link href={route('subscriber.bookmarks')} className='btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-2'>
                                            <i className='bi bi-bookmarks me-2'></i>
                                            View Bookmarks
                                        </Link>
                                    </Col>
                                    <Col md={4} className='mb-2'>
                                        <Link href={route('subscriber.notifications')} className='btn btn-outline-success w-100 d-flex align-items-center justify-content-center py-2'>
                                            <i className='bi bi-bell me-2'></i>
                                            Notifications
                                        </Link>
                                    </Col>
                                    <Col md={4} className='mb-2'>
                                        <Link href={route('subscriber.notification_settings')} className='btn btn-outline-info w-100 d-flex align-items-center justify-content-center py-2'>
                                            <i className='bi bi-gear me-2'></i>
                                            Settings
                                        </Link>
                                    </Col>
                                </Row>
                            </div>

                            <div className='bg-light p-4 rounded'>
                                <h4 className='poppins-semibold m-0 p-0 text-primary'>Welcome to Your Dashboard!</h4>
                                <p className='fs-8 mb-3 mt-2'>
                                    Track your bookmarked tools and stay updated with upcoming opportunities. Your personalized dashboard helps you stay organized and never miss important deadlines.
                                </p>
                                <div className='d-flex gap-2'>
                                    <Link href={route('subscriber.bookmarks')} className='fs-8 btn btn-success shadow-sm border-0 px-3'>
                                        <i className='bi bi-bookmarks me-1'></i>
                                        Manage Bookmarks
                                    </Link>
                                    {dashboardStats?.upcomingOpportunities > 0 && (
                                        <span className='badge bg-warning text-dark px-3 py-2 fs-8'>
                                            <i className='bi bi-exclamation-triangle me-1'></i>
                                            {dashboardStats.upcomingOpportunities} opportunities expiring soon!
                                        </span>
                                    )}
                                </div>
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
