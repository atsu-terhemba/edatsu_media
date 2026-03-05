import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import Footer from '@/Components/Footer';
import DashboardSkeleton from '@/Components/DashboardSkeleton';

// Eyebrow + orange bar pattern
function SectionEyebrow({ text }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <span style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#86868b',
            }}>
                {text}
            </span>
        </div>
    );
}

// Stat card component
function StatCard({ label, value, icon, badge }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Col md={4}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: '28px',
                    borderRadius: '16px',
                    background: '#fff',
                    border: `1px solid ${hovered ? '#e0e0e0' : '#f0f0f0'}`,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.06)' : 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: '#86868b',
                            display: 'block',
                        }}>
                            {label}
                        </span>
                        <span style={{
                            marginTop: '10px',
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#000',
                            lineHeight: 1,
                        }}>
                            {value}
                        </span>
                    </div>
                    <span style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#000' }}>
                            {icon}
                        </span>
                    </span>
                </div>
                {badge && (
                    <div style={{ marginTop: '14px' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#86868b',
                            background: '#f5f5f7',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{badge.icon}</span>
                            {badge.text}
                        </span>
                    </div>
                )}
            </div>
        </Col>
    );
}

export default function Dashboard() {
    const [subscriberData, setSubscriberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshHovered, setRefreshHovered] = useState(false);

    useEffect(() => {
        fetchSubscriberDetails();
    }, []);

    const fetchSubscriberDetails = async () => {
        try {
            setLoading(true);
            setError(null);
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

    // Loading state
    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <Container fluid={true}>
                    <Container>
                        <Row className="g-4" style={{ paddingTop: '80px' }}>
                            <Col md={3} className="d-none d-md-block">
                                <SubscriberSideNav />
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

    // Error state
    if (error) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <Container fluid={true}>
                    <Container>
                        <Row className="g-4" style={{ paddingTop: '80px' }}>
                            <Col md={3} className="d-none d-md-block">
                                <SubscriberSideNav />
                            </Col>
                            <Col md={9} xs={12}>
                                <div style={{ padding: '16px 24px', textAlign: 'center' }}>
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: '48px',
                                        color: '#86868b',
                                        marginBottom: '16px',
                                        display: 'block',
                                    }}>
                                        error_outline
                                    </span>
                                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>
                                        Something went wrong
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                                        {error}
                                    </p>
                                    <button
                                        onClick={fetchSubscriberDetails}
                                        style={{
                                            padding: '10px 32px',
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            background: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                    >
                                        Try Again
                                    </button>
                                </div>
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
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        {/* Sidebar */}
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>

                        {/* Main Content */}
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h1 style={{
                                            fontSize: '28px',
                                            fontWeight: 600,
                                            color: '#000',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                        }}>
                                            Hi, <Link href={route('profile.edit')} style={{ textDecoration: 'none', color: '#000' }}>
                                                {subscriberData?.user?.name}
                                            </Link>
                                        </h1>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0' }}>
                                            Here's what's happening with your opportunities
                                        </p>
                                    </div>
                                    <button
                                        onClick={fetchSubscriberDetails}
                                        disabled={loading}
                                        onMouseEnter={() => setRefreshHovered(true)}
                                        onMouseLeave={() => setRefreshHovered(false)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 20px',
                                            borderRadius: '9999px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            background: refreshHovered ? '#000' : '#fff',
                                            color: refreshHovered ? '#fff' : '#000',
                                            border: '1px solid #e0e0e0',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                            refresh
                                        </span>
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <Row className="g-3 mb-4">
                                <StatCard
                                    label="Upcoming"
                                    value={subscriberData?.stats?.upcomingOpportunities || 0}
                                    icon="event"
                                    badge={subscriberData?.stats?.upcomingOpportunities > 0 ? {
                                        icon: 'schedule',
                                        text: 'With deadlines',
                                    } : null}
                                />
                                <StatCard
                                    label="Saved"
                                    value={subscriberData?.stats?.totalBookmarks || 0}
                                    icon="bookmark"
                                    badge={null}
                                />
                                <StatCard
                                    label="Reminders"
                                    value={subscriberData?.upcomingReminders?.length || 0}
                                    icon="notifications_active"
                                    badge={subscriberData?.upcomingReminders?.length > 0 ? {
                                        icon: 'alarm',
                                        text: 'Active',
                                    } : null}
                                />
                            </Row>

                            {/* Expiring Soon Opportunities */}
                            {subscriberData?.expiringSoonOpportunities?.length > 0 && (
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: '1px solid #f0f0f0',
                                    background: '#fff',
                                    marginBottom: '16px',
                                }}>
                                    <SectionEyebrow text="Expiring Soon" />
                                    {subscriberData.expiringSoonOpportunities.slice(0, 3).map((opportunity, index) => (
                                        <div
                                            key={opportunity.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '14px 0',
                                                borderBottom: index < subscriberData.expiringSoonOpportunities.slice(0, 3).length - 1 ? '1px solid #f5f5f7' : 'none',
                                            }}
                                        >
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}>
                                                    {opportunity.title}
                                                </div>
                                                <span style={{ fontSize: '12px', color: '#86868b' }}>
                                                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/op/${opportunity.id}/${opportunity.slug}`}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9999px',
                                                    background: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    marginLeft: '12px',
                                                    transition: 'background 0.15s ease',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>
                                                    arrow_forward
                                                </span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upcoming Reminders */}
                            {subscriberData?.upcomingReminders?.length > 0 && (
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: '1px solid #f0f0f0',
                                    background: '#fff',
                                    marginBottom: '16px',
                                }}>
                                    <SectionEyebrow text="Upcoming Reminders" />
                                    {subscriberData.upcomingReminders.map((bookmark, index) => (
                                        <div
                                            key={bookmark.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '14px 0',
                                                borderBottom: index < subscriberData.upcomingReminders.length - 1 ? '1px solid #f5f5f7' : 'none',
                                            }}
                                        >
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                }}>
                                                    {bookmark.opportunity?.title}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>event_available</span>
                                                        Reminder: {new Date(bookmark.reminder_date).toLocaleDateString()} at {new Date(bookmark.reminder_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: '#f97316', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>alarm</span>
                                                        Deadline: {new Date(bookmark.opportunity?.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9999px',
                                                    background: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    marginLeft: '12px',
                                                    transition: 'background 0.15s ease',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>
                                                    arrow_forward
                                                </span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Activity Summary */}
                            <div style={{
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid #f0f0f0',
                                background: '#fff',
                                marginBottom: '32px',
                            }}>
                                <SectionEyebrow text="Your Activity" />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: '#f5f5f7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#000' }}>
                                                event
                                            </span>
                                        </span>
                                        <div>
                                            <span style={{ fontSize: '24px', fontWeight: 600, color: '#000' }}>
                                                {subscriberData?.stats?.upcomingOpportunities || 0}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '12px', color: '#86868b' }}>
                                                Upcoming Opportunities
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('subscriber.bookmarked_opportunities')}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 20px',
                                            borderRadius: '9999px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#000',
                                            border: '1px solid #e0e0e0',
                                            textDecoration: 'none',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#000';
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.borderColor = '#000';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#000';
                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                        }}
                                    >
                                        View All
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                            arrow_forward
                                        </span>
                                    </Link>
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
