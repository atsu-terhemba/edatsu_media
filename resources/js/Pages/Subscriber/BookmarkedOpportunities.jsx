import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Dropdown } from 'react-bootstrap';
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

    const getDeadlineStatus = (deadline) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        deadlineDate.setHours(0, 0, 0, 0);
        
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { status: 'expired', color: 'danger', icon: 'x-circle', text: 'Expired' };
        } else if (diffDays <= 7) {
            return { status: 'expiring', color: 'warning', icon: 'exclamation-triangle', text: 'Expiring Soon' };
        } else {
            return { status: 'active', color: 'success', icon: 'check-circle', text: 'Active' };
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookmarked Opportunities">
                <style dangerouslySetInnerHTML={{__html: `
                    .last-child-no-border:last-child {
                        border-bottom: none !important;
                    }
                `}} />
            </Head>

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9' style={{position: 'relative', zIndex: 1000}}>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className='mb-3 px-3 px-md-4 py-3'>
                                <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
                                    <div className='flex-grow-1'>
                                        <h2 className='poppins-semibold m-0 mb-1'>
                                            <i className='bi bi-bookmarks-fill text-primary me-2'></i>
                                            Bookmarked Opportunities
                                        </h2>
                                        <p className='text-muted mb-0'>Track and manage your saved opportunities</p>
                                    </div>
                                    <Badge bg="primary" className='px-3 py-2 fs-6'>
                                        <i className='bi bi-collection me-1'></i>
                                        {opportunities.total || 0} Total
                                    </Badge>
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
                                            <Card 
                                                key={bookmark.id} 
                                                className='mb-3 opportunity-card'
                                                style={{
                                                    border: '1px solid #dee2e6',
                                                    borderLeft: `3px solid ${
                                                        getDeadlineStatus(bookmark.opportunity?.deadline).status === 'expired' ? '#dc3545' :
                                                        getDeadlineStatus(bookmark.opportunity?.deadline).status === 'expiring' ? '#ffc107' :
                                                        '#28a745'
                                                    }`
                                                }}
                                            >
                                                <Card.Body className='p-3'>
                                                    <div className='d-flex align-items-start justify-content-between'>
                                                        <div className='flex-grow-1'>
                                                            <h5 className='mb-2 fw-bold'>
                                                                <Link 
                                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                    className='text-decoration-none text-dark'
                                                                >
                                                                    {bookmark.opportunity?.title}
                                                                </Link>
                                                            </h5>
                                                            <div className='d-flex align-items-center gap-2 flex-wrap mb-2'>
                                                                <Badge bg="light" text="dark" className='border'>
                                                                    <i className='bi bi-calendar3 me-1'></i>
                                                                    {formatDate(bookmark.opportunity?.deadline)}
                                                                </Badge>
                                                                <Badge bg={getDeadlineStatus(bookmark.opportunity?.deadline).color}>
                                                                    <i className={`bi bi-${getDeadlineStatus(bookmark.opportunity?.deadline).icon} me-1`}></i>
                                                                    {getDeadlineStatus(bookmark.opportunity?.deadline).text}
                                                                </Badge>
                                                                {bookmark.reminder_date && (
                                                                    <Badge bg="secondary">
                                                                        <i className='bi bi-bell-fill me-1'></i>
                                                                        Reminder
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <small className='text-muted'>
                                                                <i className='bi bi-bookmark-check me-1'></i>
                                                                {formatDate(bookmark.created_at)}
                                                                {bookmark.reminder_date && (
                                                                    <>
                                                                        <span className='mx-2'>•</span>
                                                                        <i className='bi bi-alarm me-1'></i>
                                                                        {new Date(bookmark.reminder_date).toLocaleDateString()}
                                                                    </>
                                                                )}
                                                            </small>
                                                        </div>
                                                        <Dropdown align="end">
                                                            <Dropdown.Toggle variant="light" size="sm" className='border-0'>
                                                                <i className='bi bi-three-dots-vertical'></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item 
                                                                    as={Link}
                                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                >
                                                                    <i className='bi bi-eye me-2'></i>
                                                                    View Details
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                {bookmark.reminder_date ? (
                                                                    <>
                                                                        <Dropdown.Item onClick={() => openReminderModal(bookmark)}>
                                                                            <i className='bi bi-pencil-square me-2'></i>
                                                                            Edit Reminder
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => removeReminder(bookmark)}>
                                                                            <i className='bi bi-bell-slash me-2'></i>
                                                                            Remove Reminder
                                                                        </Dropdown.Item>
                                                                    </>
                                                                ) : (
                                                                    <Dropdown.Item onClick={() => openReminderModal(bookmark)}>
                                                                        <i className='bi bi-bell-plus me-2'></i>
                                                                        Set Reminder
                                                                    </Dropdown.Item>
                                                                )}
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    onClick={() => removeBookmark(bookmark.id)}
                                                                    className='text-danger'
                                                                >
                                                                    <i className='bi bi-trash3 me-2'></i>
                                                                    Remove Bookmark
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
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
                                    <div className='text-center py-5 bg-light rounded'>
                                        <div className='mb-4'>
                                            <i className='bi bi-bookmark-x text-muted' style={{fontSize: '4rem'}}></i>
                                        </div>
                                        <h4 className='poppins-semibold text-muted mb-2'>No Bookmarked Opportunities Yet</h4>
                                        <p className='text-muted mb-4'>Start exploring and bookmarking opportunities to keep track of them here.</p>
                                        <Link href="/opportunities" className="btn btn-primary btn-lg">
                                            <i className='bi bi-search me-2'></i>
                                            Explore Opportunities
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Reminder Modal */}
            <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)} centered>
                <Modal.Header closeButton className='bg-light'>
                    <Modal.Title className='d-flex align-items-center'>
                        <i className={`bi bi-${selectedBookmark?.reminder_date ? 'pencil-square' : 'bell-plus'} me-2 text-primary`}></i>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    {selectedBookmark?.opportunity && (
                        <div className='mb-3 p-3 bg-light rounded'>
                            <h6 className='poppins-semibold mb-1'>{selectedBookmark.opportunity.title}</h6>
                            <small className='text-muted'>
                                <i className='bi bi-calendar-x me-1'></i>
                                Deadline: {formatDate(selectedBookmark.opportunity.deadline)}
                            </small>
                        </div>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-semibold'>
                                <i className='bi bi-clock me-1'></i>
                                Reminder Date & Time
                            </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className='py-2'
                            />
                            <Form.Text className="text-muted d-block mt-2">
                                <i className='bi bi-info-circle me-1'></i>
                                You'll receive a notification at the selected time.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='bg-light'>
                    <Button variant="outline-secondary" onClick={() => setShowReminderModal(false)}>
                        <i className='bi bi-x-circle me-1'></i>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={setReminder}>
                        <i className={`bi bi-${selectedBookmark?.reminder_date ? 'check-circle' : 'bell-fill'} me-1`}></i>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
