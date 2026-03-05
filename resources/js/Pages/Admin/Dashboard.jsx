import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSideNav from './Components/SideNav';

function StatCard({ icon, label, value, subtitle }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Col md={6} lg={3}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: '24px',
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
                        <div style={{
                            marginTop: '10px',
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#000',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                        }}>
                            {value.toLocaleString()}
                        </div>
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
                {subtitle && (
                    <div style={{ marginTop: '12px' }}>
                        <span style={{
                            fontSize: '12px',
                            color: '#86868b',
                        }}>
                            {subtitle}
                        </span>
                    </div>
                )}
            </div>
        </Col>
    );
}

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
        recent_users: 0,
    });

    useEffect(() => {
        const duration = 1500;
        const steps = 50;
        const interval = duration / steps;
        const targets = { total_users, total_events, total_oppty, recent_users };

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const t = step / steps;
            const ease = 1 - Math.pow(1 - t, 3);
            setAnimatedCounts({
                total_users: Math.floor(targets.total_users * ease),
                total_events: Math.floor(targets.total_events * ease),
                total_oppty: Math.floor(targets.total_oppty * ease),
                recent_users: Math.floor(targets.recent_users * ease),
            });
            if (step >= steps) { clearInterval(timer); setAnimatedCounts(targets); }
        }, interval);

        return () => clearInterval(timer);
    }, [total_users, total_events, total_oppty, recent_users]);

    const maxTrend = Math.max(...user_trend.map(m => m.count), 1);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const getInitialColor = (name) => {
        const colors = ['#000', '#374151', '#1e3a5f', '#3f3f46', '#44403c', '#1e293b', '#27272a', '#292524'];
        return colors[name.charCodeAt(0) % colors.length];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '6px',
                                }}>
                                    Dashboard
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                    Overview of your platform's performance
                                </p>
                            </div>

                            {/* Stat Cards */}
                            <Row className="g-3 mb-4">
                                <StatCard icon="group" label="Users" value={animatedCounts.total_users} subtitle="Registered subscribers" />
                                <StatCard icon="event" label="Opportunities" value={animatedCounts.total_oppty} subtitle="Total posted" />
                                <StatCard icon="calendar_month" label="Events" value={animatedCounts.total_events} subtitle="Total created" />
                                <StatCard icon="person_add" label="New (30d)" value={animatedCounts.recent_users} subtitle="Recent signups" />
                            </Row>

                            {/* Trend + Quick Stats */}
                            <Row className="g-3 mb-4">
                                {/* User Registration Trend */}
                                <Col lg={8}>
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '16px',
                                        padding: '28px',
                                        height: '100%',
                                    }}>
                                        <div style={{ marginBottom: '24px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                                Registration Trend
                                            </h3>
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>Last 6 months</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {user_trend.map((month, index) => (
                                                <div key={index}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>{month.month}</span>
                                                        <span style={{
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: '#000',
                                                            background: '#f5f5f7',
                                                            padding: '2px 10px',
                                                            borderRadius: '9999px',
                                                        }}>
                                                            {month.count}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        height: '6px',
                                                        background: '#f5f5f7',
                                                        borderRadius: '9999px',
                                                        overflow: 'hidden',
                                                    }}>
                                                        <div style={{
                                                            height: '100%',
                                                            width: `${(month.count / maxTrend) * 100}%`,
                                                            background: '#000',
                                                            borderRadius: '9999px',
                                                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Col>

                                {/* Quick Stats */}
                                <Col lg={4}>
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '16px',
                                        padding: '28px',
                                        height: '100%',
                                    }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 20px' }}>
                                            Quick Stats
                                        </h3>

                                        {[
                                            { label: 'Today', value: daily_users, icon: 'today' },
                                            { label: 'This Week', value: weekly_users, icon: 'date_range' },
                                            { label: 'Admins', value: total_admins, icon: 'admin_panel_settings' },
                                            { label: 'All Users', value: all_users_count, icon: 'groups' },
                                        ].map((stat, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '12px 0',
                                                    borderBottom: i < 3 ? '1px solid #f5f5f7' : 'none',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '10px',
                                                        background: '#f5f5f7',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6e6e73' }}>
                                                            {stat.icon}
                                                        </span>
                                                    </span>
                                                    <span style={{ fontSize: '14px', color: '#86868b' }}>{stat.label}</span>
                                                </div>
                                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>
                                                    {stat.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>

                            {/* Recent Users */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '28px',
                            }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                        Recent Users
                                    </h3>
                                    <span style={{ fontSize: '13px', color: '#86868b' }}>Latest registered subscribers</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {/* Header row */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 2fr 1fr 80px',
                                        gap: '16px',
                                        padding: '8px 14px',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: '#86868b',
                                    }}>
                                        <span>Name</span>
                                        <span>Email</span>
                                        <span>Joined</span>
                                        <span>Status</span>
                                    </div>

                                    {recent_user_list.map((user) => (
                                        <div
                                            key={user.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '2fr 2fr 1fr 80px',
                                                gap: '16px',
                                                padding: '12px 14px',
                                                borderRadius: '12px',
                                                alignItems: 'center',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: getInitialColor(user.name),
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    flexShrink: 0,
                                                }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {user.name}
                                                </span>
                                            </div>
                                            <span style={{
                                                fontSize: '13px',
                                                color: '#86868b',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {user.email}
                                            </span>
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                {formatDate(user.created_at)}
                                            </span>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: '#16a34a',
                                                background: '#f0fdf4',
                                                padding: '3px 10px',
                                                borderRadius: '9999px',
                                                width: 'fit-content',
                                            }}>
                                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} />
                                                Active
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
