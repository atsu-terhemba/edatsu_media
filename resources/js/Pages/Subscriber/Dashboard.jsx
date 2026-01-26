import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/custom-badges.css';
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
                        <Row className="g-4">
                            <Col md={3} className="d-none d-md-block">
                                <div className='my-3 fs-9' style={{position: 'sticky', top: '20px'}}>
                                    <SubscriberSideNav/>
                                </div>
                            </Col>
                            <Col md={9} xs={12}>
                                <DashboardSkeleton />
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
                        <Row className="g-4">
                            <Col md={3} className="d-none d-md-block">
                                <div className='my-3 fs-9' style={{position: 'sticky', top: '20px'}}>
                                    <SubscriberSideNav/>
                                </div>
                            </Col>
                            <Col md={9} xs={12}>
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
                    <Row className="g-4">
                        <Col md={3} className="d-none d-md-block">
                            <div className='my-3 fs-9' style={{position: 'sticky', top: '20px'}}>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div className='py-3 px-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0 p-0 fw-bold'>
                                        Hi, <Link href={route('profile.edit')} className='text-decoration-none text-dark'>{subscriberData?.user?.name}</Link>!
                                    </h4>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={fetchSubscriberDetails}
                                        disabled={loading}
                                        style={{borderRadius: '6px'}}
                                    >
                                        <span className={`material-symbols-outlined${loading ? ' spin' : ''} me-1`} style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span>
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <Row className='mb-3 g-3'>
                                <Col md={4}>
                                    <div className='p-3 rounded h-100' style={{border: '1px solid #dee2e6', minHeight: '120px'}}>
                                        <div className='d-flex align-items-start justify-content-between'>
                                            <div>
                                                <small className='text-muted d-block mb-1'>
                                                    Upcoming Opportunities
                                                </small>
                                                <h2 className='mb-0'>{subscriberData?.stats?.upcomingOpportunities || 0}</h2>
                                            </div>
                                            <span className='material-symbols-outlined text-primary' style={{fontSize: '1.5rem'}}>event</span>
                                        </div>
                                        {subscriberData?.stats?.upcomingOpportunities > 0 && (
                                            <div className='mt-2'>
                                                <span className='upcoming-badge'>
                                                    <span className='material-symbols-outlined'>event_upcoming</span>
                                                    Upcoming & Expiring
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='p-3 rounded h-100' style={{border: '1px solid #dee2e6', minHeight: '120px'}}>
                                        <div className='d-flex align-items-start justify-content-between'>
                                            <div>
                                                <small className='text-muted d-block mb-1'>
                                                    This Month
                                                </small>
                                                <h2 className='mb-0'>{subscriberData?.stats?.monthlyBookmarks || 0}</h2>
                                            </div>
                                            <span className='material-symbols-outlined text-success' style={{fontSize: '1.5rem'}}>monitoring</span>
                                        </div>
                                        <small className='text-muted d-block mt-2'>
                                            New bookmarks added
                                        </small>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='p-3 rounded h-100' style={{border: '1px solid #dee2e6', minHeight: '120px'}}>
                                        <div className='d-flex align-items-start justify-content-between'>
                                            <div>
                                                <small className='text-muted d-block mb-1'>
                                                    Active Reminders
                                                </small>
                                                <h2 className='mb-0'>{subscriberData?.upcomingReminders?.length || 0}</h2>
                                            </div>
                                            <span className='material-symbols-outlined text-warning' style={{fontSize: '1.5rem'}}>notifications</span>
                                        </div>
                                        <small className='text-muted d-block mt-2'>
                                            Upcoming notifications
                                        </small>
                                    </div>
                                </Col>
                            </Row>

                            {/* Expiring Soon Opportunities */}
                            {subscriberData?.expiringSoonOpportunities?.length > 0 && (
                                <div className='mb-3'>
                                    <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <h6 className='mb-3 fw-bold' style={{color: '#dc3545', fontSize: '0.9em'}}>
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
                                                <Link
                                                    href={`/op/${opportunity.id}/${opportunity.slug}`}
                                                    className='btn btn-sm btn-outline-secondary'
                                                    style={{borderRadius: '6px'}}
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '16px'}}>arrow_forward</span>
                                                </Link>
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
                                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>event_available</span>
                                                        Reminder: {new Date(bookmark.reminder_date).toLocaleDateString()} at {new Date(bookmark.reminder_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </small>
                                                    <small className='text-danger d-block'>
                                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>alarm</span>
                                                        Deadline: {new Date(bookmark.opportunity?.deadline).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <Link 
                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                    className='btn btn-sm btn-outline-secondary ms-2'
                                                    style={{borderRadius: '6px'}}
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '16px'}}>arrow_forward</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Summary */}
                            <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                <h6 className='mb-3' style={{fontWeight: 'normal'}}>Your Activity</h6>
                                
                                <div className='mb-3'>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <div>
                                            <span className='material-symbols-outlined text-primary me-2' style={{fontSize: '1.5rem', verticalAlign: 'middle'}}>event</span>
                                            <span className='h4 mb-0'>{subscriberData?.stats?.upcomingOpportunities || 0}</span>
                                        </div>
                                        <Link href={route('subscriber.bookmarked_opportunities')} className='btn btn-outline-secondary btn-sm' style={{borderRadius: '6px'}}>
                                            View All
                                            <span className='material-symbols-outlined ms-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>arrow_forward</span>
                                        </Link>
                                    </div>
                                    <small className='text-muted'>Upcoming Opportunities</small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
        </AuthenticatedLayout>
    );
}
