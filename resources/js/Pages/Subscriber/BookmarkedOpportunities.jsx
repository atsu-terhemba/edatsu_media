import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function BookmarkedOpportunities({ opportunities: initialOpportunities }) {
    const [opportunities, setOpportunities] = useState(initialOpportunities || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const [reminderDate, setReminderDate] = useState('');

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const removeBookmark = async (bookmarkId) => {
        try {
            const response = await axios.put('/remove-bookmark-feed', { id: bookmarkId });
            if (response.data.status === 'success') {
                // Update the local state to remove the bookmark immediately
                setOpportunities(prevData => ({
                    ...prevData,
                    data: prevData.data.filter(bookmark => bookmark.id !== bookmarkId),
                    total: prevData.total - 1
                }));
                
                Toast.fire({
                    icon: "success",
                    title: "Bookmark removed successfully"
                });
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
            Toast.fire({
                icon: "error", 
                title: "Error removing bookmark"
            });
        }
    };

    const openReminderModal = (bookmark) => {
        setSelectedBookmark(bookmark);
        // If bookmark already has a reminder, pre-fill the date
        if (bookmark.reminder_date) {
            const date = new Date(bookmark.reminder_date);
            setReminderDate(date.toISOString().slice(0, 16)); // Format for datetime-local input
        } else {
            setReminderDate('');
        }
        setShowReminderModal(true);
    };

    const setReminder = async () => {
        if (!reminderDate) {
            Toast.fire({
                icon: "warning",
                title: "Please select a reminder date"
            });
            return;
        }

        try {
            const endpoint = selectedBookmark.reminder_date ? '/update-bookmark-reminder' : '/set-bookmark-reminder';
            const response = await axios.post(endpoint, {
                bookmark_id: selectedBookmark.id,
                reminder_date: reminderDate
            });

            if (response.data.status === 'success') {
                // Update the local state
                setOpportunities(prevData => ({
                    ...prevData,
                    data: prevData.data.map(bookmark => 
                        bookmark.id === selectedBookmark.id 
                            ? { ...bookmark, reminder_date: reminderDate, reminder_sent: false }
                            : bookmark
                    )
                }));

                Toast.fire({
                    icon: "success",
                    title: response.data.message
                });

                setShowReminderModal(false);
                setSelectedBookmark(null);
                setReminderDate('');
            } else {
                Toast.fire({
                    icon: "error",
                    title: response.data.message
                });
            }
        } catch (error) {
            console.error('Error setting reminder:', error);
            Toast.fire({
                icon: "error",
                title: "Error setting reminder"
            });
        }
    };

    const removeReminder = async (bookmark) => {
        try {
            const response = await axios.post('/remove-bookmark-reminder', {
                bookmark_id: bookmark.id
            });

            if (response.data.status === 'success') {
                // Update the local state
                setOpportunities(prevData => ({
                    ...prevData,
                    data: prevData.data.map(b => 
                        b.id === bookmark.id 
                            ? { ...b, reminder_date: null, reminder_sent: false }
                            : b
                    )
                }));

                Toast.fire({
                    icon: "success",
                    title: "Reminder removed successfully"
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: response.data.message
                });
            }
        } catch (error) {
            console.error('Error removing reminder:', error);
            Toast.fire({
                icon: "error",
                title: "Error removing reminder"
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isExpiringSoon = (deadline) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookmarked Opportunities" />

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
                                    <h2 className='poppins-semibold m-0'>Bookmarked Opportunities</h2>
                                    <Badge bg="primary">{opportunities.total || 0} Total</Badge>
                                </div>
                                
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : opportunities.data && opportunities.data.length > 0 ? (
                                    <div>
                                        {opportunities.data.map((bookmark) => (
                                            <Card key={bookmark.id} className='mb-3 shadow-sm'>
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={8}>
                                                            <div className='d-flex align-items-start mb-2'>
                                                                <img 
                                                                    src={bookmark.opportunity?.cover_img || '/img/default-opportunity.jpg'} 
                                                                    alt={bookmark.opportunity?.title}
                                                                    className='me-3 rounded'
                                                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                                                />
                                                                <div className='flex-grow-1'>
                                                                    <h5 className='poppins-semibold mb-1'>
                                                                        {bookmark.opportunity?.title}
                                                                    </h5>
                                                                    <p className='text-muted fs-8 mb-2'>
                                                                        {bookmark.opportunity?.description?.substring(0, 150)}...
                                                                    </p>
                                                                    <div className='d-flex align-items-center gap-2'>
                                                                        <Badge bg={isExpiringSoon(bookmark.opportunity?.deadline) ? 'warning' : 'info'}>
                                                                            <i className='bi bi-calendar me-1'></i>
                                                                            Deadline: {formatDate(bookmark.opportunity?.deadline)}
                                                                        </Badge>
                                                                        {isExpiringSoon(bookmark.opportunity?.deadline) && (
                                                                            <Badge bg="danger">
                                                                                <i className='bi bi-exclamation-triangle me-1'></i>
                                                                                Expiring Soon!
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className='text-end'>
                                                            <div className='d-flex flex-column gap-2'>
                                                                <small className='text-muted'>
                                                                    Bookmarked: {formatDate(bookmark.created_at)}
                                                                </small>
                                                                {bookmark.reminder_date && (
                                                                    <small className='text-info'>
                                                                        <i className='bi bi-bell me-1'></i>
                                                                        Reminder: {formatDate(bookmark.reminder_date)}
                                                                    </small>
                                                                )}
                                                                <div className='d-flex flex-wrap gap-1'>
                                                                    <Button 
                                                                        href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                        variant="outline-primary" 
                                                                        size="sm"
                                                                    >
                                                                        <i className='bi bi-eye me-1'></i>
                                                                        View
                                                                    </Button>
                                                                    
                                                                    {bookmark.reminder_date ? (
                                                                        <>
                                                                            <Button 
                                                                                variant="outline-warning" 
                                                                                size="sm"
                                                                                onClick={() => openReminderModal(bookmark)}
                                                                                title="Update reminder"
                                                                            >
                                                                                <i className='bi bi-bell'></i>
                                                                            </Button>
                                                                            <Button 
                                                                                variant="outline-secondary" 
                                                                                size="sm"
                                                                                onClick={() => removeReminder(bookmark)}
                                                                                title="Remove reminder"
                                                                            >
                                                                                <i className='bi bi-bell-slash'></i>
                                                                            </Button>
                                                                        </>
                                                                    ) : (
                                                                        <Button 
                                                                            variant="outline-info" 
                                                                            size="sm"
                                                                            onClick={() => openReminderModal(bookmark)}
                                                                            title="Set reminder"
                                                                        >
                                                                            <i className='bi bi-bell-plus'></i>
                                                                        </Button>
                                                                    )}
                                                                    
                                                                    <Button 
                                                                        variant="outline-danger" 
                                                                        size="sm"
                                                                        onClick={() => removeBookmark(bookmark.id)}
                                                                        title="Remove bookmark"
                                                                    >
                                                                        <i className='bi bi-bookmark-dash'></i>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                        
                                        {/* Pagination */}
                                        {opportunities.last_page > 1 && (
                                            <div className='d-flex justify-content-center mt-4'>
                                                <nav>
                                                    <ul className="pagination">
                                                        <li className={`page-item ${opportunities.current_page === 1 ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => router.visit(`/bookmarked-opportunities?page=${opportunities.current_page - 1}`)}
                                                                disabled={opportunities.current_page === 1}
                                                            >
                                                                Previous
                                                            </Button>
                                                        </li>
                                                        <li className="page-item active">
                                                            <span className="page-link">
                                                                {opportunities.current_page} of {opportunities.last_page}
                                                            </span>
                                                        </li>
                                                        <li className={`page-item ${opportunities.current_page === opportunities.last_page ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => router.visit(`/bookmarked-opportunities?page=${opportunities.current_page + 1}`)}
                                                                disabled={opportunities.current_page === opportunities.last_page}
                                                            >
                                                                Next
                                                            </Button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className='text-center py-5'>
                                        <i className='bi bi-bookmark text-muted' style={{fontSize: '3rem'}}></i>
                                        <h4 className='mt-3 text-muted'>No Bookmarked Opportunities</h4>
                                        <p className='text-muted'>Start bookmarking opportunities to see them here.</p>
                                        <Link href="/opportunities" className="btn btn-primary">
                                            Browse Opportunities
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Reminder Modal */}
            <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Remind me on:</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            <Form.Text className="text-muted">
                                Choose when you'd like to be reminded about this opportunity.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReminderModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={setReminder}>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
