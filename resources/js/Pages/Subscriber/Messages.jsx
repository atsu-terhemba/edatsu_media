import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('inbox'); // inbox, sent
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [composeForm, setComposeForm] = useState({
        recipient_email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/messages?type=${filter}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await axios.put(`/api/messages/${messageId}/read`);
            fetchMessages(); // Refresh messages
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/messages', composeForm);
            setShowComposeModal(false);
            setComposeForm({ recipient_email: '', subject: '', message: '' });
            if (filter === 'sent') {
                fetchMessages(); // Refresh if viewing sent messages
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await axios.delete(`/api/messages/${messageId}`);
            fetchMessages(); // Refresh messages
        } catch (error) {
            console.error('Error deleting message:', error);
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

    const unreadCount = messages.filter(m => !m.is_read && filter === 'inbox').length;

    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav/>
                        </Col>
                        <Col md={9} xs={12}>
                            <div className='border px-3 py-4 rounded'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h2 className='poppins-semibold m-0'>
                                        Messages 
                                        {unreadCount > 0 && filter === 'inbox' && (
                                            <Badge bg="danger" className='ms-2'>{unreadCount}</Badge>
                                        )}
                                    </h2>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setShowComposeModal(true)}
                                    >
                                        <i className='bi bi-plus me-1'></i>
                                        Compose
                                    </Button>
                                </div>

                                {/* Filter Buttons */}
                                <div className='mb-3'>
                                    <Button 
                                        variant={filter === 'inbox' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        className='me-2'
                                        onClick={() => setFilter('inbox')}
                                    >
                                        <i className='bi bi-inbox me-1'></i>
                                        Inbox {unreadCount > 0 && `(${unreadCount})`}
                                    </Button>
                                    <Button 
                                        variant={filter === 'sent' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setFilter('sent')}
                                    >
                                        <i className='bi bi-send me-1'></i>
                                        Sent
                                    </Button>
                                </div>
                                
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : messages.length > 0 ? (
                                    <ListGroup>
                                        {messages.map((message) => (
                                            <ListGroup.Item 
                                                key={message.id} 
                                                className={`${!message.is_read && filter === 'inbox' ? 'bg-light border-start border-primary border-3' : ''}`}
                                            >
                                                <div className='d-flex justify-content-between align-items-start'>
                                                    <div className='flex-grow-1'>
                                                        <div className='d-flex justify-content-between align-items-center mb-2'>
                                                            <h6 className='mb-0 poppins-semibold'>
                                                                {message.subject}
                                                                {!message.is_read && filter === 'inbox' && (
                                                                    <Badge bg="primary" className='ms-2 fs-9'>Unread</Badge>
                                                                )}
                                                                {message.message_type === 'system' && (
                                                                    <Badge bg="info" className='ms-2 fs-9'>System</Badge>
                                                                )}
                                                            </h6>
                                                            <small className='text-muted'>
                                                                {formatDate(message.created_at)}
                                                            </small>
                                                        </div>
                                                        <div className='d-flex justify-content-between align-items-start'>
                                                            <div>
                                                                <p className='mb-1 fs-8'>
                                                                    {filter === 'inbox' ? (
                                                                        <><strong>From:</strong> {message.sender?.name || 'System'}</>
                                                                    ) : (
                                                                        <><strong>To:</strong> {message.recipient?.name}</>
                                                                    )}
                                                                </p>
                                                                <p className='mb-0 fs-8 text-muted'>
                                                                    {message.message.substring(0, 100)}...
                                                                </p>
                                                            </div>
                                                            <div className='d-flex gap-1'>
                                                                <Button 
                                                                    variant="outline-primary" 
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedMessage(message);
                                                                        if (!message.is_read && filter === 'inbox') {
                                                                            markAsRead(message.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className='bi bi-eye me-1'></i>
                                                                    View
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm"
                                                                    onClick={() => deleteMessage(message.id)}
                                                                >
                                                                    <i className='bi bi-trash me-1'></i>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className='text-center py-5'>
                                        <i className='bi bi-envelope text-muted' style={{fontSize: '3rem'}}></i>
                                        <h4 className='mt-3 text-muted'>
                                            {filter === 'inbox' ? 'No Messages in Inbox' : 'No Sent Messages'}
                                        </h4>
                                        <p className='text-muted'>
                                            {filter === 'inbox' ? 'You have no messages yet.' : 'You haven\'t sent any messages yet.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Compose Message Modal */}
            <Modal show={showComposeModal} onHide={() => setShowComposeModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Compose Message</Modal.Title>
                </Modal.Header>
                <Form onSubmit={sendMessage}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Recipient Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={composeForm.recipient_email}
                                onChange={(e) => setComposeForm({...composeForm, recipient_email: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                value={composeForm.subject}
                                onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={composeForm.message}
                                onChange={(e) => setComposeForm({...composeForm, message: e.target.value})}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowComposeModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className='bi bi-send me-1'></i>
                            Send Message
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* View Message Modal */}
            {selectedMessage && (
                <Modal show={!!selectedMessage} onHide={() => setSelectedMessage(null)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedMessage.subject}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <strong>From:</strong> {selectedMessage.sender?.name || 'System'}<br/>
                            <strong>Date:</strong> {formatDate(selectedMessage.created_at)}
                        </div>
                        <div className='border-top pt-3'>
                            <p style={{whiteSpace: 'pre-wrap'}}>{selectedMessage.message}</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
                            Close
                        </Button>
                        {filter === 'inbox' && selectedMessage.sender && (
                            <Button 
                                variant="primary" 
                                onClick={() => {
                                    setComposeForm({
                                        ...composeForm,
                                        recipient_email: selectedMessage.sender.email,
                                        subject: `Re: ${selectedMessage.subject}`
                                    });
                                    setSelectedMessage(null);
                                    setShowComposeModal(true);
                                }}
                            >
                                <i className='bi bi-reply me-1'></i>
                                Reply
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
