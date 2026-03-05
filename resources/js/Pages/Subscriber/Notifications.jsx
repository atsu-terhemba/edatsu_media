import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import NotificationsSkeleton from '@/Components/NotificationsSkeleton';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/notifications?filter=${filter}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/notifications/mark-all-read');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return { icon: 'check_circle', bg: '#f0fdf4', color: '#16a34a' };
            case 'warning':
                return { icon: 'warning', bg: '#fffbeb', color: '#d97706' };
            case 'error':
                return { icon: 'cancel', bg: '#fef2f2', color: '#dc2626' };
            default:
                return { icon: 'info', bg: '#f5f5f7', color: '#000' };
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
        { id: 'read', label: 'Read' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ marginBottom: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                border: '1px solid #e5e5e7',
                                                borderRadius: '9999px',
                                                background: '#fff',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#000',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>done_all</span>
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginTop: '12px',
                                    marginBottom: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            background: '#000',
                                            color: '#fff',
                                            padding: '2px 10px',
                                            borderRadius: '9999px',
                                            lineHeight: '20px',
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </h2>
                            </div>

                            {/* Filter pills */}
                            <div style={{
                                display: 'inline-flex',
                                background: '#f5f5f7',
                                borderRadius: '9999px',
                                padding: '3px',
                                marginBottom: '24px',
                            }}>
                                {filters.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id)}
                                        style={{
                                            padding: '7px 18px',
                                            border: 'none',
                                            borderRadius: '9999px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: filter === f.id ? '#fff' : 'transparent',
                                            color: filter === f.id ? '#000' : '#86868b',
                                            boxShadow: filter === f.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Notifications list */}
                            {loading ? (
                                <NotificationsSkeleton count={5} />
                            ) : notifications.length > 0 ? (
                                <div>
                                    {notifications.map((notification) => {
                                        const iconData = getNotificationIcon(notification.type);
                                        const isUnread = !notification.is_read;

                                        return (
                                            <div
                                                key={notification.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '14px',
                                                    padding: '18px 20px',
                                                    borderRadius: '16px',
                                                    background: isUnread ? '#fafafa' : '#fff',
                                                    border: `1px solid ${isUnread ? '#e8e8ed' : '#f0f0f0'}`,
                                                    marginBottom: '8px',
                                                    transition: 'all 0.2s ease',
                                                    position: 'relative',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = isUnread ? '#e8e8ed' : '#f0f0f0';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                {/* Unread indicator dot */}
                                                {isUnread && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '22px',
                                                        left: '8px',
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: '#f97316',
                                                    }} />
                                                )}

                                                {/* Icon */}
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: iconData.bg,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <span className="material-symbols-outlined" style={{
                                                        fontSize: '20px',
                                                        color: iconData.color,
                                                        fontVariationSettings: "'FILL' 1",
                                                    }}>
                                                        {iconData.icon}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: isUnread ? 600 : 500,
                                                        color: '#000',
                                                        marginBottom: '4px',
                                                        lineHeight: 1.4,
                                                    }}>
                                                        {notification.title}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#86868b',
                                                        lineHeight: 1.5,
                                                        marginBottom: '8px',
                                                    }}>
                                                        {notification.message}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                    }}>
                                                        <span style={{
                                                            fontSize: '12px',
                                                            color: '#b0b0b5',
                                                        }}>
                                                            {formatDate(notification.created_at)}
                                                        </span>

                                                        {notification.action_url && (
                                                            <a
                                                                href={notification.action_url}
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 500,
                                                                    color: '#000',
                                                                    textDecoration: 'none',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '3px',
                                                                    transition: 'color 0.15s ease',
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.color = '#f97316'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.color = '#000'; }}
                                                            >
                                                                View
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                                            </a>
                                                        )}

                                                        {isUnread && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 500,
                                                                    color: '#86868b',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: 0,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '3px',
                                                                    transition: 'color 0.15s ease',
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.color = '#000'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.color = '#86868b'; }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                                                                Mark read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '80px 24px',
                                    background: '#f5f5f7',
                                    borderRadius: '20px',
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: '#e8e8ed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#86868b' }}>
                                            notifications
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#000',
                                        marginBottom: '8px',
                                    }}>
                                        No notifications
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#86868b',
                                        margin: 0,
                                        maxWidth: '320px',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}>
                                        {filter === 'unread'
                                            ? "You're all caught up. No unread notifications."
                                            : "You don't have any notifications yet. They'll show up here."}
                                    </p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
