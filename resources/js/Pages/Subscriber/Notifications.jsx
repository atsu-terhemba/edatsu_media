import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import NotificationsSkeleton from '@/Components/NotificationsSkeleton';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

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
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/notifications/mark-all-read');
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return { icon: 'check_circle', class: 'text-success', fill: true };
            case 'warning':
                return { icon: 'warning', class: 'text-warning', fill: true };
            case 'error':
                return { icon: 'cancel', class: 'text-danger', fill: true };
            default:
                return { icon: 'info', class: 'text-primary', fill: true };
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3} className="d-none d-md-block">
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6} xs={12}>
                            <div className='py-3 px-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h4 className='m-0 fw-bold' style={{fontWeight: 'normal'}}>
                                        Notifications 
                                        {unreadCount > 0 && (
                                            <Badge bg="danger" className='ms-2'>{unreadCount}</Badge>
                                        )}
                                    </h4>
                                    <div className='d-flex gap-2'>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={markAllAsRead}
                                            disabled={unreadCount === 0}
                                            style={{borderRadius: '6px'}}
                                        >
                                            <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>done_all</span>
                                            Mark All Read
                                        </Button>
                                    </div>
                                </div>

                                {/* Filter Buttons */}
                                <div className='mb-3'>
                                    <Button 
                                        variant={filter === 'all' ? 'secondary' : 'outline-secondary'}
                                        size="sm"
                                        className='me-2'
                                        onClick={() => setFilter('all')}
                                        style={{borderRadius: '6px'}}
                                    >
                                        All
                                    </Button>
                                    <Button 
                                        variant={filter === 'unread' ? 'secondary' : 'outline-secondary'}
                                        size="sm"
                                        className='me-2'
                                        onClick={() => setFilter('unread')}
                                        style={{borderRadius: '6px'}}
                                    >
                                        Unread ({unreadCount})
                                    </Button>
                                    <Button 
                                        variant={filter === 'read' ? 'secondary' : 'outline-secondary'}
                                        size="sm"
                                        onClick={() => setFilter('read')}
                                        style={{borderRadius: '6px'}}
                                    >
                                        Read
                                    </Button>
                                </div>
                                
                                {loading ? (
                                    <NotificationsSkeleton count={5} />
                                ) : notifications.length > 0 ? (
                                    <ListGroup variant="flush" className="border-0">
                                        {notifications.map((notification) => (
                                            <ListGroup.Item 
                                                key={notification.id} 
                                                className={`d-flex justify-content-between align-items-start ${!notification.is_read ? 'border-start border-3' : ''}`}
                                                style={{
                                                    border: 'none',
                                                    borderLeft: !notification.is_read ? '3px solid #0d6efd' : 'none',
                                                    marginBottom: '0.5rem',
                                                    borderRadius: '6px',
                                                    backgroundColor: 'transparent'
                                                }}
                                            >
                                                <div className='d-flex align-items-start'>
                                                    <span className={`material-symbols-outlined ${getNotificationIcon(notification.type).class} me-3 mt-1`} style={{fontSize: '1.2rem', fontVariationSettings: getNotificationIcon(notification.type).fill ? "'FILL' 1" : "'FILL' 0"}}>{ getNotificationIcon(notification.type).icon}</span>
                                                    <div className='flex-grow-1'>
                                                        <h6 className='mb-1'>
                                                            {notification.title}
                                                            {!notification.is_read && (
                                                                <Badge bg="primary" className='ms-2 fs-9'>New</Badge>
                                                            )}
                                                        </h6>
                                                        <p className='mb-1 fs-8'>{notification.message}</p>
                                                        <small className='text-muted'>
                                                            {formatDate(notification.created_at)}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column gap-1'>
                                                    {notification.action_url && (
                                                        <Button 
                                                            href={notification.action_url}
                                                            variant="outline-secondary" 
                                                            size="sm"
                                                            style={{borderRadius: '6px'}}
                                                        >
                                                            <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>arrow_forward</span>
                                                            View
                                                        </Button>
                                                    )}
                                                    {!notification.is_read && (
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            size="sm"
                                                            onClick={() => markAsRead(notification.id)}
                                                            style={{borderRadius: '6px'}}
                                                        >
                                                            <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>check</span>
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className='text-center py-5 rounded'>
                                        <span className='material-symbols-outlined text-muted' style={{fontSize: '3rem'}}>notifications</span>
                                        <h5 className='mt-3 text-muted'>No Notifications</h5>
                                        <p className='text-muted'>
                                            {filter === 'unread' ? 'No unread notifications.' : 'You have no notifications yet.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col sm={3}>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
