import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import Footer from '@/Components/Footer';

export default function Dashboard() {
    const [subscriberData, setSubscriberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscriberDetails();
    }, []);

    const fetchSubscriberDetails = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state
            const response = await axios.get('/api/subscriber/details');
            
            if (response.data.success) {
                setSubscriberData(response.data.data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error fetching subscriber details:', err);
            if (err.response?.status === 401) {
                setError('Please log in to view your dashboard.');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to access this data.');
            } else if (err.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Failed to load dashboard data. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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
                                <div className='text-center py-5'>
                                    <Spinner animation="border" role="status" className='me-2'>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    <span className='ms-2'>Loading your dashboard...</span>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </AuthenticatedLayout>
        );
    }

    if (error) {
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
                                <Alert variant="danger" className="text-center">
                                    <Alert.Heading>Oops! Something went wrong</Alert.Heading>
                                    <p>{error}</p>
                                    <Button variant="outline-danger" onClick={fetchSubscriberDetails}>
                                        Try Again
                                    </Button>
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <Container fluid={true}>
                {/* <Container> */}
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='border px-3 py-4 rounded my-3'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h2 className='poppins-semibold m-0 py-0'>Dashboard</h2>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={fetchSubscriberDetails}
                                        disabled={loading}
                                    >
                                        <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''} me-1`}></i>
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            {/* Welcome Message */}
                            <div className='bg-light p-4 rounded mb-4'>
                                <h4 className='poppins-semibold m-0 p-0 text-primary'>
                                    Welcome back, {subscriberData?.user?.name}!
                                </h4>
                                <p className='fs-8 mb-0 mt-2'>
                                    Track your bookmarked tools and stay updated with upcoming opportunities. Your personalized dashboard helps you stay organized and never miss important deadlines.
                                </p>
                            </div>
                            
                            {/* Dashboard Statistics */}
                            <Row className='mb-4'>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 border border-light bg-light'>
                                        <Card.Body className='text-dark'>
                                            <div className='mb-2'>
                                                <i className='bi bi-bookmark-fill text-dark' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1 text-dark'>
                                                {subscriberData?.stats?.totalBookmarkedTools || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 text-muted'>
                                                Bookmarked Tools
                                            </Card.Text>
                                            <div className='mt-3'>
                                                <Link href={route('subscriber.bookmarked_tools')} className='btn btn-flat btn-flat-primary btn-sm w-100 d-flex align-items-center justify-content-between'>
                                                    <span>View Tools</span>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 border border-light bg-light'>
                                        <Card.Body className='text-dark'>
                                            <div className='mb-2'>
                                                <i className='bi bi-calendar-event text-dark' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1 text-dark'>
                                                {subscriberData?.stats?.upcomingOpportunities || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 text-muted'>
                                                Upcoming Opportunities
                                            </Card.Text>
                                            <div className='mt-3'>
                                                <Link href={route('subscriber.bookmarked_opportunities')} className='btn btn-flat btn-flat-primary btn-sm w-100 d-flex align-items-center justify-content-between'>
                                                    <span>View Opportunities</span>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 border border-light bg-light'>
                                        <Card.Body className='text-dark'>
                                            <div className='mb-2'>
                                                <i className='bi bi-bell-fill text-dark' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1 text-dark'>
                                                {subscriberData?.stats?.unreadNotifications || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 text-muted'>
                                                Unread Notifications
                                            </Card.Text>
                                            <div className='mt-3'>
                                                <Link href={route('subscriber.notifications')} className='btn btn-flat btn-flat-primary btn-sm w-100 d-flex align-items-center justify-content-between'>
                                                    <span>View Notifications</span>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className='mb-3'>
                                    <Card className='text-center h-100 border border-light bg-light'>
                                        <Card.Body className='text-dark'>
                                            <div className='mb-2'>
                                                <i className='bi bi-chat-dots-fill text-dark' style={{fontSize: '2.5rem'}}></i>
                                            </div>
                                            <Card.Title className='poppins-semibold h2 mb-1 text-dark'>
                                                {subscriberData?.stats?.unreadMessages || 0}
                                            </Card.Title>
                                            <Card.Text className='fs-7 text-muted'>
                                                Unread Messages
                                            </Card.Text>
                                            <div className='mt-3'>
                                                <Link href={route('subscriber.messages')} className='btn btn-flat btn-flat-primary btn-sm w-100 d-flex align-items-center justify-content-between'>
                                                    <span>View Messages</span>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Expiring Soon Opportunities */}
                            {subscriberData?.expiringSoonOpportunities?.length > 0 && (
                                <div className='mb-4'>
                                    <h5 className='poppins-semibold mb-3 text-danger'>
                                        <i className='bi bi-exclamation-triangle-fill me-2'></i>
                                        Opportunities Expiring Soon
                                    </h5>
                                    <div className='bg-light p-3 rounded'>
                                        {subscriberData.expiringSoonOpportunities.slice(0, 3).map((opportunity) => (
                                            <div key={opportunity.id} className='d-flex justify-content-between align-items-center py-2 border-bottom'>
                                                <div>
                                                    <strong className='text-truncate'>{opportunity.title}</strong>
                                                    <small className='d-block text-muted'>
                                                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <Button size='sm' variant='outline-primary'>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Summary & Stats */}
                            <div className='bg-light p-4 rounded'>
                                <h5 className='poppins-semibold mb-3'>Your Activity</h5>
                                <div className='d-flex gap-2 flex-wrap mb-3'>
                                    {subscriberData?.stats?.upcomingOpportunities > 0 && (
                                        <span className='badge bg-warning text-dark px-3 py-2 fs-8'>
                                            <i className='bi bi-exclamation-triangle me-1'></i>
                                            {subscriberData.stats.upcomingOpportunities} opportunities expiring soon!
                                        </span>
                                    )}
                                    {subscriberData?.stats?.unreadNotifications > 0 && (
                                        <span className='badge bg-info text-white px-3 py-2 fs-8'>
                                            <i className='bi bi-bell me-1'></i>
                                            {subscriberData.stats.unreadNotifications} new notifications
                                        </span>
                                    )}
                                </div>
                                
                                {/* Activity Summary */}
                                <div className='pt-3 border-top'>
                                    <small className='text-muted d-block'>
                                        <i className='bi bi-activity me-1'></i>
                                        This month: {subscriberData?.stats?.monthlyBookmarks || 0} new bookmarks
                                    </small>
                                    <small className='text-muted d-block'>
                                        <i className='bi bi-clock-history me-1'></i>
                                        Member since: {subscriberData?.user?.created_at ? new Date(subscriberData.user.created_at).toLocaleDateString() : 'N/A'}
                                    </small>
                                </div>
                            </div>
                        </Col>
                        <Col sm={3}>
                            {/* <div>main content</div> */}
                        </Col>
                    </Row>
                </Container>
            {/* </Container> */}
            <Footer />
        </AuthenticatedLayout>
    );
}
