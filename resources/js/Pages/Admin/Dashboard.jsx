import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSideNav from './Components/SideNav';
import { Users, UserPlus, Calendar, TrendingUp, Activity, Eye } from 'lucide-react';

export default function Dashboard({ 
    total_events, 
    total_oppty, 
    total_users, 
    total_admins, 
    all_users_count, 
    recent_users, 
    weekly_users, 
    daily_users, 
    user_trend, 
    recent_user_list 
}) {

    const [animatedCounts, setAnimatedCounts] = useState({
        total_users: 0,
        total_events: 0,
        total_oppty: 0,
        recent_users: 0
    });

    // Animate counters on mount
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        const counters = {
            total_users: total_users,
            total_events: total_events,
            total_oppty: total_oppty,
            recent_users: recent_users
        };

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setAnimatedCounts({
                total_users: Math.floor(counters.total_users * progress),
                total_events: Math.floor(counters.total_events * progress),
                total_oppty: Math.floor(counters.total_oppty * progress),
                recent_users: Math.floor(counters.recent_users * progress)
            });

            if (step >= steps) {
                clearInterval(timer);
                setAnimatedCounts(counters);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [total_users, total_events, total_oppty, recent_users]);

    // Calculate growth percentage (mock data for demo)
    const getGrowthPercentage = (current, previous = 0) => {
        if (previous === 0) return 100;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, trendValue }) => (
        <Card className="stat-card h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className={`stat-icon bg-${color}`}>
                        <Icon size={24} color="white" />
                    </div>
                    {trend && (
                        <Badge bg={trend === 'up' ? 'success' : 'danger'} className="d-flex align-items-center gap-1">
                            <TrendingUp size={12} />
                            {trendValue}%
                        </Badge>
                    )}
                </div>
                <h2 className="stat-number mb-1">{value.toLocaleString()}</h2>
                <h6 className="stat-title mb-2">{title}</h6>
                {subtitle && <small className="text-muted">{subtitle}</small>}
            </Card.Body>
        </Card>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <AdminSideNav/>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className='my-3'>
                                {/* Header */}
                                <div className="mb-4">
                                    <h1 className="poppins-bold mb-2">Admin Dashboard</h1>
                                    <p className="text-muted">Overview of your platform's performance and user statistics</p>
                                </div>

                                {/* Main Stats Cards */}
                                <Row className="mb-4">
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Users}
                                            title="Total Users"
                                            value={animatedCounts.total_users}
                                            subtitle="Registered subscribers"
                                            color="primary"
                                            trend="up"
                                            trendValue="12.5"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Activity}
                                            title="Opportunities"
                                            value={animatedCounts.total_oppty}
                                            subtitle="Total opportunities posted"
                                            color="success"
                                            trend="up"
                                            trendValue="8.3"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Calendar}
                                            title="Events"
                                            value={animatedCounts.total_events}
                                            subtitle="Total events created"
                                            color="warning"
                                            trend="up"
                                            trendValue="15.2"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={UserPlus}
                                            title="New Users (30d)"
                                            value={animatedCounts.recent_users}
                                            subtitle="Recent registrations"
                                            color="info"
                                            trend="up"
                                            trendValue="24.1"
                                        />
                                    </Col>
                                </Row>

                                {/* User Analytics Row */}
                                <Row className="mb-4">
                                    {/* User Growth Chart */}
                                    <Col lg={8} className="mb-3">
                                        <Card className="h-100 border-0 shadow-sm">
                                            <Card.Header className="bg-white border-0 pb-0">
                                                <h5 className="poppins-semibold mb-0">User Registration Trend</h5>
                                                <small className="text-muted">Last 6 months</small>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="chart-container">
                                                    {user_trend.map((month, index) => (
                                                        <div key={index} className="chart-bar-container mb-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <small className="text-muted">{month.month}</small>
                                                                <Badge bg="primary">{month.count}</Badge>
                                                            </div>
                                                            <ProgressBar 
                                                                now={(month.count / Math.max(...user_trend.map(m => m.count))) * 100} 
                                                                className="custom-progress"
                                                                style={{ height: '8px' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* Quick Stats */}
                                    <Col lg={4} className="mb-3">
                                        <Card className="h-100 border-0 shadow-sm">
                                            <Card.Header className="bg-white border-0 pb-0">
                                                <h5 className="poppins-semibold mb-0">Quick Stats</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="quick-stat-item mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">Today</span>
                                                        <span className="fw-bold text-success">{daily_users}</span>
                                                    </div>
                                                    <small className="text-muted">New registrations</small>
                                                </div>
                                                
                                                <div className="quick-stat-item mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">This Week</span>
                                                        <span className="fw-bold text-info">{weekly_users}</span>
                                                    </div>
                                                    <small className="text-muted">Weekly registrations</small>
                                                </div>

                                                <div className="quick-stat-item mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">Total Admins</span>
                                                        <span className="fw-bold text-warning">{total_admins}</span>
                                                    </div>
                                                    <small className="text-muted">Platform administrators</small>
                                                </div>

                                                <div className="quick-stat-item">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="text-muted">All Users</span>
                                                        <span className="fw-bold text-primary">{all_users_count}</span>
                                                    </div>
                                                    <small className="text-muted">Including admins</small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Recent Users */}
                                <Row>
                                    <Col>
                                        <Card className="border-0 shadow-sm">
                                            <Card.Header className="bg-white border-0 pb-0">
                                                <h5 className="poppins-semibold mb-0">Recent Users</h5>
                                                <small className="text-muted">Latest registered subscribers</small>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th className="border-0 text-muted fw-normal">Name</th>
                                                                <th className="border-0 text-muted fw-normal">Email</th>
                                                                <th className="border-0 text-muted fw-normal">Joined</th>
                                                                <th className="border-0 text-muted fw-normal">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {recent_user_list.map((user) => (
                                                                <tr key={user.id}>
                                                                    <td className="border-0">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="user-avatar me-3">
                                                                                {user.name.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <span className="fw-medium">{user.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="border-0 text-muted">{user.email}</td>
                                                                    <td className="border-0 text-muted">
                                                                        {new Date(user.created_at).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="border-0">
                                                                        <Badge bg="success">Active</Badge>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Custom Styles */}
            <style jsx>{`
                .stat-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border-radius: 12px !important;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                }
                
                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    line-height: 1;
                }
                
                .stat-title {
                    color: #4a5568;
                    font-weight: 600;
                }
                
                .chart-container {
                    padding: 1rem 0;
                }
                
                .chart-bar-container {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease forwards;
                }
                
                .chart-bar-container:nth-child(1) { animation-delay: 0.1s; }
                .chart-bar-container:nth-child(2) { animation-delay: 0.2s; }
                .chart-bar-container:nth-child(3) { animation-delay: 0.3s; }
                .chart-bar-container:nth-child(4) { animation-delay: 0.4s; }
                .chart-bar-container:nth-child(5) { animation-delay: 0.5s; }
                .chart-bar-container:nth-child(6) { animation-delay: 0.6s; }
                
                .custom-progress .progress-bar {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 4px;
                }
                
                .quick-stat-item {
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #edf2f7;
                }
                
                .quick-stat-item:last-child {
                    border-bottom: none;
                }
                
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .table th {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .table td {
                    vertical-align: middle;
                    padding: 1rem 0.75rem;
                }
                
                .card {
                    border-radius: 12px !important;
                }
                
                .bg-primary { background-color: #667eea !important; }
                .bg-success { background-color: #48bb78 !important; }
                .bg-warning { background-color: #ed8936 !important; }
                .bg-info { background-color: #4299e1 !important; }
            `}</style>
        </AuthenticatedLayout>
    );
}
