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
                return 'bi bi-check-circle-fill text-success';
            case 'warning':
                return 'bi bi-exclamation-triangle-fill text-warning';
            case 'error':
                return 'bi bi-x-circle-fill text-danger';
            default:
                return 'bi bi-info-circle-fill text-primary';
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

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
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h4 className='m-0' style={{fontWeight: 'normal'}}>
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
                                            <i className='bi bi-check-all me-1'></i>
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
                                    <ListGroup variant="flush">
                                        {notifications.map((notification) => (
                                            <ListGroup.Item 
                                                key={notification.id} 
                                                className={`d-flex justify-content-between align-items-start ${!notification.is_read ? 'border-start border-3' : ''}`}
                                                style={{
                                                    border: '1px solid #dee2e6',
                                                    borderLeft: !notification.is_read ? '3px solid #0d6efd' : '1px solid #dee2e6',
                                                    marginBottom: '0.5rem',
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                <div className='d-flex align-items-start'>
                                                    <i className={`${getNotificationIcon(notification.type)} me-3 mt-1`} style={{fontSize: '1.2rem'}}></i>
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
                                                            <i className='bi bi-arrow-right me-1'></i>
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
                                                            <i className='bi bi-check me-1'></i>
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className='text-center py-5 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <i className='bi bi-bell text-muted' style={{fontSize: '3rem'}}></i>
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
