import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import Footer from '@/Components/Footer';
import DashboardSkeleton from '@/Components/DashboardSkeleton';

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
                                <DashboardSkeleton />
                            </Col>
                            <Col sm={3}>
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
                                <div className='py-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                                    <h4 className='m-0' style={{fontWeight: 'normal'}}>Dashboard</h4>
                                </div>
                                <Alert variant="danger" className="text-center">
                                    <Alert.Heading>Oops! Something went wrong</Alert.Heading>
                                    <p>{error}</p>
                                    <Button variant="outline-danger" onClick={fetchSubscriberDetails}>
                                        Try Again
                                    </Button>
                                </Alert>
                            </Col>
                            <Col sm={3}>
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
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='py-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 p-0'>
                                        Hi, {subscriberData?.user?.name}!
                                    </h4>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={fetchSubscriberDetails}
                                        disabled={loading}
                                        style={{borderRadius: '6px'}}
                                    >
                                        <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''} me-1`}></i>
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            {/* Expiring Soon Opportunities */}
                            {subscriberData?.expiringSoonOpportunities?.length > 0 && (
                                <div className='mb-3'>
                                    <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <h6 className='mb-3' style={{color: '#dc3545', fontWeight: 'normal'}}>
                                            Opportunities Expiring Soon
                                        </h6>
                                        {subscriberData.expiringSoonOpportunities.slice(0, 3).map((opportunity, index) => (
                                            <div 
                                                key={opportunity.id} 
                                                className='d-flex justify-content-between align-items-center py-2'
                                                style={{borderBottom: index < subscriberData.expiringSoonOpportunities.slice(0, 3).length - 1 ? '1px solid #dee2e6' : 'none'}}
                                            >
                                                <div>
                                                    <div className='text-truncate'>{opportunity.title}</div>
                                                    <small className='d-block text-muted'>
                                                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <Button size='sm' variant='outline-secondary' style={{borderRadius: '6px'}}>
                                                    <i className='bi bi-arrow-right'></i>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Reminders */}
                            {subscriberData?.upcomingReminders?.length > 0 && (
                                <div className='mb-3'>
                                    <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <h6 className='mb-3' style={{color: '#0d6efd', fontWeight: 'normal'}}>
                                            Upcoming Reminders
                                        </h6>
                                        {subscriberData.upcomingReminders.map((bookmark, index) => (
                                            <div 
                                                key={bookmark.id} 
                                                className='d-flex justify-content-between align-items-center py-2'
                                                style={{borderBottom: index < subscriberData.upcomingReminders.length - 1 ? '1px solid #dee2e6' : 'none'}}
                                            >
                                                <div className='flex-grow-1'>
                                                    <div className='d-block'>{bookmark.opportunity?.title}</div>
                                                    <small className='text-muted d-block'>
                                                        <i className='bi bi-calendar-check me-1'></i>
                                                        Reminder: {new Date(bookmark.reminder_date).toLocaleDateString()} at {new Date(bookmark.reminder_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </small>
                                                    <small className='text-danger d-block'>
                                                        <i className='bi bi-alarm me-1'></i>
                                                        Deadline: {new Date(bookmark.opportunity?.deadline).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <Link 
                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                    className='btn btn-sm btn-outline-secondary ms-2'
                                                    style={{borderRadius: '6px'}}
                                                >
                                                    <i className='bi bi-arrow-right'></i>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Summary & Stats */}
                            <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                <h6 className='mb-3' style={{fontWeight: 'normal'}}>Your Activity</h6>
                                
                                {/* Upcoming Opportunities */}
                                <div className='mb-3 pb-3' style={{borderBottom: '1px solid #dee2e6'}}>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <div>
                                            <i className='bi bi-calendar-event text-primary me-2' style={{fontSize: '1.5rem'}}></i>
                                            <span className='h4 mb-0'>{subscriberData?.stats?.upcomingOpportunities || 0}</span>
                                        </div>
                                        <Link href={route('subscriber.bookmarked_opportunities')} className='btn btn-outline-secondary btn-sm' style={{borderRadius: '6px'}}>
                                            View All
                                            <i className='bi bi-arrow-right ms-1'></i>
                                        </Link>
                                    </div>
                                    <small className='text-muted'>Upcoming Opportunities</small>
                                    {subscriberData?.stats?.upcomingOpportunities > 0 && (
                                        <div className='mt-2'>
                                            <span className='badge bg-warning text-dark px-2 py-1' style={{fontSize: '0.75rem'}}>
                                                <i className='bi bi-exclamation-triangle me-1'></i>
                                                {subscriberData.stats.upcomingOpportunities} opportunities expiring soon!
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Activity Summary */}
                                <div>
                                    <small className='text-muted d-block mb-2'>
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
            </Container>
            <Footer />
        </AuthenticatedLayout>
    );
}
