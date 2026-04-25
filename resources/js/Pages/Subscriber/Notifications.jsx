import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import NotificationsSkeleton from '@/Components/NotificationsSkeleton';

// Toast for momentary feedback (success / error). Matches the app-wide
// pattern used in Admin/ForumReports, Admin/AllProducts_New, etc.
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2400,
    timerProgressBar: true,
});

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [confirmClear, setConfirmClear] = useState(null); // { count, scopeLabel } | null
    const [clearing, setClearing] = useState(false);

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

    const deleteNotification = async (notificationId) => {
        // Optimistic update — feels instant; reconcile on error.
        const prev = notifications;
        setNotifications((list) => list.filter((n) => n.id !== notificationId));
        try {
            await axios.delete(`/api/notifications/${notificationId}`);
        } catch (error) {
            console.error('Error deleting notification:', error);
            setNotifications(prev);
        }
    };

    const openClearConfirm = () => {
        const scopeLabel = filter === 'unread' ? 'unread'
            : filter === 'read' ? 'read'
            : 'all';
        const count = filter === 'unread'
            ? notifications.filter((n) => !n.is_read).length
            : filter === 'read'
            ? notifications.filter((n) => n.is_read).length
            : notifications.length;
        if (count === 0) return;
        setConfirmClear({ count, scopeLabel });
    };

    const performClear = async () => {
        setClearing(true);
        try {
            await axios.delete('/api/notifications/clear', { params: { filter } });
            setConfirmClear(null);
            fetchNotifications();
            Toast.fire({ icon: 'success', title: 'Notifications cleared' });
        } catch (error) {
            console.error('Error clearing notifications:', error);
            Toast.fire({ icon: 'error', title: 'Could not clear — please try again' });
        } finally {
            setClearing(false);
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
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
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
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={openClearConfirm}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                border: '1px solid #fecaca',
                                                borderRadius: '9999px',
                                                background: '#fff',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_sweep</span>
                                            {filter === 'unread' ? 'Clear unread'
                                                : filter === 'read' ? 'Clear read'
                                                : 'Clear all'}
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

                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            aria-label="Delete notification"
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                color: '#b0b0b5',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: 0,
                                                                marginLeft: 'auto',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '3px',
                                                                transition: 'color 0.15s ease',
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#b0b0b5'; }}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                                                        </button>
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

            {confirmClear && (
                <ConfirmClearModal
                    count={confirmClear.count}
                    scopeLabel={confirmClear.scopeLabel}
                    onCancel={() => !clearing && setConfirmClear(null)}
                    onConfirm={performClear}
                    busy={clearing}
                />
            )}
        </AuthenticatedLayout>
    );
}

function ConfirmClearModal({ count, scopeLabel, onCancel, onConfirm, busy }) {
    // Lock background scroll while open and route Escape → cancel.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [busy, onCancel]);

    const scopeText = scopeLabel === 'all'
        ? 'all your notifications'
        : `your ${scopeLabel} notifications`;

    return (
        <div
            onClick={() => !busy && onCancel()}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="clear-confirm-title"
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.18)',
                    textAlign: 'center',
                }}
            >
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: '28px',
                        color: '#dc2626',
                        fontVariationSettings: "'FILL' 1",
                    }}>
                        delete_sweep
                    </span>
                </div>

                <h3
                    id="clear-confirm-title"
                    style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#000',
                        letterSpacing: '-0.01em',
                        margin: '0 0 8px',
                    }}
                >
                    Clear {scopeLabel === 'all' ? 'all notifications' : `${scopeLabel} notifications`}?
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: '#86868b',
                    lineHeight: 1.55,
                    margin: '0 0 24px',
                    maxWidth: '320px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    This permanently removes {count} {count === 1 ? 'notification' : 'notifications'} from {scopeText}. This can&apos;t be undone.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        style={{
                            padding: '11px 22px',
                            borderRadius: '9999px',
                            border: '1px solid #e5e5e7',
                            background: '#fff',
                            color: '#000',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: busy ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            fontFamily: 'inherit',
                            opacity: busy ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = '#f5f5f7'; }}
                        onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = '#fff'; }}
                    >
                        Keep them
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '11px 22px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: busy ? '#9ca3af' : '#dc2626',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: busy ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            fontFamily: 'inherit',
                            boxShadow: busy ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.25)',
                        }}
                        onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = '#b91c1c'; }}
                        onMouseLeave={(e) => { if (!busy) e.currentTarget.style.background = '#dc2626'; }}
                    >
                        {busy ? (
                            <>
                                <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }} />
                                Clearing
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_sweep</span>
                                Clear {count}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
