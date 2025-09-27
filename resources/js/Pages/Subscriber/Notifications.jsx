import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';

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
                        <Col sm={9}>
                            <div className='border px-3 py-4 rounded my-3'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h2 className='poppins-semibold m-0'>
                                        Notifications 
                                        {unreadCount > 0 && (
                                            <Badge bg="danger" className='ms-2'>{unreadCount}</Badge>
                                        )}
                                    </h2>
                                    <div className='d-flex gap-2'>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={markAllAsRead}
                                            disabled={unreadCount === 0}
                                        >
                                            <i className='bi bi-check-all me-1'></i>
                                            Mark All Read
                                        </Button>
                                    </div>
                                </div>

                                {/* Filter Buttons */}
                                <div className='mb-3'>
                                    <Button 
                                        variant={filter === 'all' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        className='me-2'
                                        onClick={() => setFilter('all')}
                                    >
                                        All
                                    </Button>
                                    <Button 
                                        variant={filter === 'unread' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        className='me-2'
                                        onClick={() => setFilter('unread')}
                                    >
                                        Unread ({unreadCount})
                                    </Button>
                                    <Button 
                                        variant={filter === 'read' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setFilter('read')}
                                    >
                                        Read
                                    </Button>
                                </div>
                                
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : notifications.length > 0 ? (
                                    <ListGroup>
                                        {notifications.map((notification) => (
                                            <ListGroup.Item 
                                                key={notification.id} 
                                                className={`d-flex justify-content-between align-items-start ${!notification.is_read ? 'bg-light border-start border-primary border-3' : ''}`}
                                            >
                                                <div className='d-flex align-items-start'>
                                                    <i className={`${getNotificationIcon(notification.type)} me-3 mt-1`} style={{fontSize: '1.2rem'}}></i>
                                                    <div className='flex-grow-1'>
                                                        <h6 className='mb-1 poppins-semibold'>
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
                                                            variant="outline-primary" 
                                                            size="sm"
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
                                    <div className='text-center py-5'>
                                        <i className='bi bi-bell text-muted' style={{fontSize: '3rem'}}></i>
                                        <h4 className='mt-3 text-muted'>No Notifications</h4>
                                        <p className='text-muted'>
                                            {filter === 'unread' ? 'No unread notifications.' : 'You have no notifications yet.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
