import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Dropdown, Alert } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';

export default function BookmarkedOpportunities({ opportunities: initialOpportunities }) {
    const [opportunities, setOpportunities] = useState(initialOpportunities || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const [reminderDate, setReminderDate] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'expired'

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
            console.log('Setting reminder:', { endpoint, bookmark_id: selectedBookmark.id, reminder_date: reminderDate });
            
            const response = await axios.post(endpoint, {
                bookmark_id: selectedBookmark.id,
                reminder_date: reminderDate
            });

            console.log('Reminder response:', response.data);

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
                    title: response.data.message || "Failed to set reminder"
                });
            }
        } catch (error) {
            console.error('Error setting reminder:', error);
            console.error('Error response:', error.response?.data);
            Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "Error setting reminder"
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
            return { status: 'expired', color: 'danger', icon: 'cancel', text: 'Expired' };
        } else if (diffDays <= 7) {
            return { status: 'expiring', color: 'warning', icon: 'warning', text: 'Expiring Soon' };
        } else {
            return { status: 'active', color: 'success', icon: 'check_circle', text: 'Active' };
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookmarked Opportunities">
                <style dangerouslySetInnerHTML={{__html: `
                    .last-child-no-border:last-child {
                        border-bottom: none !important;
                    }
                    .custom-dropdown-toggle::after {
                        display: none !important;
                    }
                    .opportunity-card {
                        position: relative;
                    }
                    .opportunity-card .dropdown.show {
                        z-index: 9999 !important;
                    }
                    .opportunity-card .dropdown-menu {
                        z-index: 10000 !important;
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
                        <Col sm={6}>
                            <div className='mb-3 py-3 rounded px-3 mt-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
                                    <div className='flex-grow-1'>
                                        <h4 className='m-0 mb-1 fw-bold' style={{fontWeight: 'normal'}}>
                                            Bookmarked Opportunities
                                        </h4>
                                        <small className='text-muted'>Track and manage your saved opportunities</small>
                                    </div>
                                    <Badge bg="light" text="dark" className='px-3 py-2' style={{border: '1px solid #dee2e6'}}>
                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>collections_bookmark</span>
                                        {opportunities.total || 0} Total
                                    </Badge>
                                </div>
                            </div>

                            <div className='mb-3 d-flex gap-2'>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setFilter('all')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>list</span>
                                    All
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'active' ? 'success' : 'outline-secondary'}
                                    onClick={() => setFilter('active')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>check_circle</span>
                                    Active
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'expired' ? 'danger' : 'outline-secondary'}
                                    onClick={() => setFilter('expired')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>cancel</span>
                                    Expired
                                </Button>
                            </div>
{/* 
                            <Alert variant="danger" className="mb-4">
                            <p className='fw-bold mb-0 fs-9 font-monospace'>Important</p>
                            <small className='font-monospace'>This page is currently under development. Some features may not be fully functional yet.</small>
                            </Alert> */}

                            <div>
                                {loading ? (
                                    <BookmarksSkeleton count={5} />
                                ) : opportunities.data && opportunities.data.length > 0 ? (
                                    <div>
                                        {opportunities.data
                                            .filter(bookmark => {
                                                if (filter === 'all') return true;
                                                const status = getDeadlineStatus(bookmark.opportunity?.deadline).status;
                                                if (filter === 'active') return status !== 'expired';
                                                if (filter === 'expired') return status === 'expired';
                                                return true;
                                            })
                                            .map((bookmark, index) => (
                                            <Card 
                                                key={bookmark.id} 
                                                className='mb-3 opportunity-card'
                                                style={{
                                                    border: '1px solid #dee2e6',
                                                    boxShadow: 'none',
                                                    position: 'relative',
                                                    zIndex: opportunities.data.length - index
                                                }}
                                            >
                                                <Card.Body className='p-3'>
                                                    <div className='d-flex align-items-start justify-content-between'>
                                                        <div className='flex-grow-1'>
                                                            <h6 className='mb-2' style={{fontSize: '0.9em'}}>
                                                                <Link 
                                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                    className='text-decoration-none text-dark'
                                                                >
                                                                    {bookmark.opportunity?.title}
                                                                </Link>
                                                            </h6>


                                                            <div className='d-flex align-items-center gap-2 flex-wrap mb-2'>
                                                                <span className='badge' style={{
                                                                    background: '#667eea',
                                                                    color: 'white',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>calendar_month</span>
                                                                    {formatDate(bookmark.opportunity?.deadline)}
                                                                </span>
                                                                <span className='badge' style={{
                                                                    background: getDeadlineStatus(bookmark.opportunity?.deadline).status === 'expired' 
                                                                        ? '#f5576c'
                                                                        : getDeadlineStatus(bookmark.opportunity?.deadline).status === 'expiring'
                                                                        ? '#ffc107'
                                                                        : '#10b981',
                                                                    color: 'white',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>{getDeadlineStatus(bookmark.opportunity?.deadline).icon}</span>
                                                                    {getDeadlineStatus(bookmark.opportunity?.deadline).text}
                                                                </span>
                                                                {bookmark.reminder_date && (
                                                                    <span className='badge' style={{
                                                                        background: '#8b5cf6',
                                                                        color: 'white',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '4px',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '500'
                                                                    }}>
                                                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle', fontVariationSettings: "'FILL' 1"}}>notifications</span>
                                                                        Reminder
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <small className='text-muted'>
                                                                <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>bookmark_check</span>
                                                                {formatDate(bookmark.created_at)}
                                                                {bookmark.reminder_date && (
                                                                    <>
                                                                        <span className='mx-2'>•</span>
                                                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>alarm</span>
                                                                        {new Date(bookmark.reminder_date).toLocaleDateString()}
                                                                    </>
                                                                )}
                                                            </small>
                                                        </div>
                                                        <Dropdown align="end" style={{position: 'relative', zIndex: 1000}}>
                                                            <Dropdown.Toggle 
                                                                variant="light" 
                                                                size="sm" 
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    border: 'none',
                                                                    padding: '6px 10px',
                                                                    background: 'transparent'
                                                                }}
                                                                bsPrefix="custom-dropdown-toggle"
                                                            >
                                                                <span className='material-symbols-outlined' style={{fontSize: '16px'}}>more_vert</span>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu style={{zIndex: 10000, position: 'absolute'}}>
                                                                <Dropdown.Item 
                                                                    as={Link}
                                                                    href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                >
                                                                    <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>visibility</span>
                                                                    View Details
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                {bookmark.reminder_date ? (
                                                                    <>
                                                                        <Dropdown.Item onClick={() => openReminderModal(bookmark)}>
                                                                            <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>edit</span>
                                                                            Edit Reminder
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => removeReminder(bookmark)}>
                                                                            <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>notifications_off</span>
                                                                            Remove Reminder
                                                                        </Dropdown.Item>
                                                                    </>
                                                                ) : (
                                                                    <Dropdown.Item onClick={() => openReminderModal(bookmark)}>
                                                                        <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>add_alert</span>
                                                                        Set Reminder
                                                                    </Dropdown.Item>
                                                                )}
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    onClick={() => removeBookmark(bookmark.id)}
                                                                    className='text-danger'
                                                                >
                                                                    <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>delete</span>
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
                                    <div className='text-center py-5 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <div className='mb-4'>
                                            <span className='material-symbols-outlined text-muted' style={{fontSize: '4rem'}}>bookmark_remove</span>
                                        </div>
                                        <h5 className='text-muted mb-2'>No Bookmarked Opportunities Yet</h5>
                                        <p className='text-muted mb-4'>Start exploring and bookmarking opportunities to keep track of them here.</p>
                                        <Link href="/opportunities" className="btn btn-outline-secondary" style={{borderRadius: '6px'}}>
                                            <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>search</span>
                                            Explore Opportunities
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col sm={3}>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Reminder Modal */}
            <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)} centered>
                <Modal.Header closeButton className='bg-light'>
                    <Modal.Title className='d-flex align-items-center'>
                        <span className={`material-symbols-outlined me-2 text-primary`} style={{fontSize: '20px'}}>{selectedBookmark?.reminder_date ? 'edit' : 'add_alert'}</span>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    {selectedBookmark?.opportunity && (
                        <div className='mb-3 p-3 bg-light rounded'>
                            <h6 className='poppins-semibold mb-1'>{selectedBookmark.opportunity.title}</h6>
                            <small className='text-muted'>
                                <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>event_busy</span>
                                Deadline: {formatDate(selectedBookmark.opportunity.deadline)}
                            </small>
                        </div>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-semibold'>
                                <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>schedule</span>
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
                                <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>info</span>
                                You'll receive a notification at the selected time.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='bg-light'>
                    <Button variant="outline-secondary" onClick={() => setShowReminderModal(false)}>
                        <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>cancel</span>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={setReminder}>
                        <span className={`material-symbols-outlined me-1`} style={{fontSize: '16px', verticalAlign: 'middle', fontVariationSettings: "'FILL' 1"}}>{selectedBookmark?.reminder_date ? 'check_circle' : 'notifications'}</span>
                        {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
