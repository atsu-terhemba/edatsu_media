import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';
import Footer from '@/Components/Footer';

export default function BookmarkedOpportunities({ opportunities: initialOpportunities }) {
    const [opportunities, setOpportunities] = useState(initialOpportunities || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const [reminderDate, setReminderDate] = useState('');
    const [filter, setFilter] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const menuRef = useRef(null);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const removeBookmark = async (bookmarkId) => {
        try {
            const response = await axios.put('/remove-bookmark-feed', { id: bookmarkId });
            if (response.data.status === 'success') {
                setOpportunities(prev => ({
                    ...prev,
                    data: prev.data.filter(b => b.id !== bookmarkId),
                    total: prev.total - 1
                }));
                Toast.fire({ icon: "success", title: "Bookmark removed" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing bookmark" });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const visibleIds = filteredOpportunities.map(b => b.id);
        if (selectedIds.length === visibleIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(visibleIds);
        }
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds([]);
    };

    const bulkRemove = async () => {
        if (selectedIds.length === 0) return;
        try {
            const response = await axios.put('/remove-bookmarks-bulk', { ids: selectedIds });
            if (response.data.status === 'success') {
                setOpportunities(prev => ({
                    ...prev,
                    data: prev.data.filter(b => !selectedIds.includes(b.id)),
                    total: prev.total - selectedIds.length
                }));
                Toast.fire({ icon: "success", title: response.data.message });
                exitSelectMode();
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing bookmarks" });
        }
    };

    const openReminderModal = (bookmark) => {
        setSelectedBookmark(bookmark);
        setReminderDate(bookmark.reminder_date
            ? new Date(bookmark.reminder_date).toISOString().slice(0, 16)
            : '');
        setShowReminderModal(true);
        setOpenMenuId(null);
    };

    const setReminder = async () => {
        if (!reminderDate) {
            Toast.fire({ icon: "warning", title: "Please select a reminder date" });
            return;
        }
        try {
            const endpoint = selectedBookmark.reminder_date ? '/update-bookmark-reminder' : '/set-bookmark-reminder';
            const response = await axios.post(endpoint, {
                bookmark_id: selectedBookmark.id,
                reminder_date: reminderDate
            });
            if (response.data.status === 'success') {
                setOpportunities(prev => ({
                    ...prev,
                    data: prev.data.map(b =>
                        b.id === selectedBookmark.id
                            ? { ...b, reminder_date: reminderDate, reminder_sent: false }
                            : b
                    )
                }));
                Toast.fire({ icon: "success", title: response.data.message });
                setShowReminderModal(false);
                setSelectedBookmark(null);
                setReminderDate('');
            } else {
                Toast.fire({ icon: "error", title: response.data.message || "Failed to set reminder" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: error.response?.data?.message || "Error setting reminder" });
        }
    };

    const removeReminder = async (bookmark) => {
        try {
            const response = await axios.post('/remove-bookmark-reminder', { bookmark_id: bookmark.id });
            if (response.data.status === 'success') {
                setOpportunities(prev => ({
                    ...prev,
                    data: prev.data.map(b =>
                        b.id === bookmark.id ? { ...b, reminder_date: null, reminder_sent: false } : b
                    )
                }));
                Toast.fire({ icon: "success", title: "Reminder removed" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing reminder" });
        }
        setOpenMenuId(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getDeadlineStatus = (deadline) => {
        if (!deadline) return { status: 'unknown', text: 'Unknown', color: '#86868b' };
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'expired', text: 'Expired', color: '#dc3545' };
        if (diffDays <= 7) return { status: 'expiring', text: 'Expiring Soon', color: '#f97316' };
        return { status: 'active', text: 'Active', color: '#16a34a' };
    };

    const syncToCalendar = (bookmark, type = 'google') => {
        const opp = bookmark.opportunity;
        if (!opp) return;

        const title = opp.title || 'Opportunity Deadline';
        const deadlineDate = opp.deadline ? new Date(opp.deadline) : null;
        const reminderDateObj = bookmark.reminder_date ? new Date(bookmark.reminder_date) : null;
        const eventDate = deadlineDate || reminderDateObj;
        if (!eventDate) {
            Toast.fire({ icon: 'warning', title: 'No deadline or reminder date to sync' });
            return;
        }

        const slug = opp.slug || '';
        const oppUrl = `${window.location.origin}/op/${opp.id}/${slug}`;
        const description = `Opportunity deadline reminder from Edatsu Media.\n\nView details: ${oppUrl}`;

        if (type === 'google') {
            // Format: YYYYMMDD for all-day event
            const formatGCal = (d) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}${m}${day}`;
            };
            const start = formatGCal(eventDate);
            // All-day event: end = next day
            const endDate = new Date(eventDate);
            endDate.setDate(endDate.getDate() + 1);
            const end = formatGCal(endDate);

            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
            window.open(url, '_blank');
        } else {
            // .ics file download
            const pad = (n) => String(n).padStart(2, '0');
            const formatICS = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
            const endDate = new Date(eventDate);
            endDate.setDate(endDate.getDate() + 1);

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Edatsu Media//EN',
                'BEGIN:VEVENT',
                `DTSTART;VALUE=DATE:${formatICS(eventDate)}`,
                `DTEND;VALUE=DATE:${formatICS(endDate)}`,
                `SUMMARY:${title}`,
                `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
                `URL:${oppUrl}`,
                'END:VEVENT',
                'END:VCALENDAR',
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.ics`;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        Toast.fire({ icon: 'success', title: type === 'google' ? 'Opening Google Calendar' : 'Calendar file downloaded' });
        setOpenMenuId(null);
    };

    const filteredOpportunities = opportunities.data?.filter(bookmark => {
        if (!bookmark.opportunity) return false;
        if (filter === 'all') return true;
        const status = getDeadlineStatus(bookmark.opportunity?.deadline).status;
        if (filter === 'active') return status !== 'expired';
        if (filter === 'expired') return status === 'expired';
        return true;
    }) || [];

    const filters = [
        { key: 'all', label: 'All', icon: 'list' },
        { key: 'active', label: 'Active', icon: 'check_circle' },
        { key: 'expired', label: 'Expired', icon: 'cancel' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Saved Opportunities" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        {/* Sidebar */}
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>

                        {/* Main Content */}
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <h1 style={{
                                            fontSize: '28px',
                                            fontWeight: 600,
                                            color: '#000',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                        }}>
                                            Saved Opportunities
                                        </h1>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0' }}>
                                            Track and manage your bookmarked opportunities
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {opportunities.data && opportunities.data.length > 0 && (
                                            <a
                                                href="/export-bookmarked-opportunities"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '7px 16px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    border: '1px solid #e0e0e0',
                                                    background: '#fff',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                                                Export
                                            </a>
                                        )}
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '9999px',
                                            background: '#f5f5f7',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#000',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bookmark</span>
                                            {opportunities.total || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters + Select */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                {selectMode ? (
                                    /* Bulk action bar */
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                        <button
                                            onClick={toggleSelectAll}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '7px 16px',
                                                borderRadius: '9999px',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                border: '1px solid #e0e0e0',
                                                background: selectedIds.length === filteredOpportunities.length && filteredOpportunities.length > 0 ? '#000' : '#fff',
                                                color: selectedIds.length === filteredOpportunities.length && filteredOpportunities.length > 0 ? '#fff' : '#000',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                                {selectedIds.length === filteredOpportunities.length && filteredOpportunities.length > 0 ? 'deselect' : 'select_all'}
                                            </span>
                                            {selectedIds.length === filteredOpportunities.length && filteredOpportunities.length > 0 ? 'Deselect All' : 'Select All'}
                                        </button>

                                        {selectedIds.length > 0 && (
                                            <button
                                                onClick={bulkRemove}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '7px 16px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    background: '#dc3545',
                                                    color: '#fff',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                                                Remove ({selectedIds.length})
                                            </button>
                                        )}

                                        <span style={{ fontSize: '13px', color: '#86868b', marginLeft: '4px' }}>
                                            {selectedIds.length} selected
                                        </span>
                                    </div>
                                ) : (
                                    /* Normal filter bar */
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {filters.map((f) => (
                                            <button
                                                key={f.key}
                                                onClick={() => setFilter(f.key)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '7px 16px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    border: filter === f.key ? 'none' : '1px solid #e0e0e0',
                                                    background: filter === f.key ? '#000' : '#fff',
                                                    color: filter === f.key ? '#fff' : '#000',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{f.icon}</span>
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Select mode toggle */}
                                {opportunities.data && opportunities.data.length > 0 && (
                                    <button
                                        onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '7px 16px',
                                            borderRadius: '9999px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            border: selectMode ? 'none' : '1px solid #e0e0e0',
                                            background: selectMode ? '#000' : '#fff',
                                            color: selectMode ? '#fff' : '#000',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                            {selectMode ? 'close' : 'checklist'}
                                        </span>
                                        {selectMode ? 'Cancel' : 'Select'}
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            {loading ? (
                                <BookmarksSkeleton count={5} />
                            ) : opportunities.data && opportunities.data.length > 0 ? (
                                <div>
                                    {filteredOpportunities.length > 0 ? (
                                        filteredOpportunities.map((bookmark) => {
                                            const deadline = getDeadlineStatus(bookmark.opportunity?.deadline);
                                            return (
                                                <div
                                                    key={bookmark.id}
                                                    style={{
                                                        padding: '20px',
                                                        borderRadius: '16px',
                                                        border: '1px solid #f0f0f0',
                                                        background: '#fff',
                                                        marginBottom: '12px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                        {/* Checkbox in select mode */}
                                                        {selectMode && (
                                                            <button
                                                                onClick={() => toggleSelect(bookmark.id)}
                                                                style={{
                                                                    width: '22px',
                                                                    height: '22px',
                                                                    borderRadius: '6px',
                                                                    border: selectedIds.includes(bookmark.id) ? 'none' : '2px solid #d1d1d6',
                                                                    background: selectedIds.includes(bookmark.id) ? '#000' : '#fff',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                    marginTop: '2px',
                                                                    transition: 'all 0.15s ease',
                                                                    padding: 0,
                                                                }}
                                                            >
                                                                {selectedIds.includes(bookmark.id) && (
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>check</span>
                                                                )}
                                                            </button>
                                                        )}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            {/* Title */}
                                                            <Link
                                                                href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                style={{
                                                                    fontSize: '15px',
                                                                    fontWeight: 500,
                                                                    color: '#000',
                                                                    textDecoration: 'none',
                                                                    display: 'block',
                                                                    marginBottom: '10px',
                                                                    lineHeight: 1.4,
                                                                }}
                                                            >
                                                                {bookmark.opportunity?.title}
                                                            </Link>

                                                            {/* Badges */}
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                                                                {/* Deadline date */}
                                                                <span style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '9999px',
                                                                    background: '#f5f5f7',
                                                                    fontSize: '12px',
                                                                    fontWeight: 500,
                                                                    color: '#000',
                                                                }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_month</span>
                                                                    {formatDate(bookmark.opportunity?.deadline)}
                                                                </span>

                                                                {/* Status */}
                                                                <span style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '9999px',
                                                                    fontSize: '12px',
                                                                    fontWeight: 500,
                                                                    color: deadline.color,
                                                                    background: `${deadline.color}10`,
                                                                }}>
                                                                    <span style={{
                                                                        width: '6px',
                                                                        height: '6px',
                                                                        borderRadius: '50%',
                                                                        background: deadline.color,
                                                                    }} />
                                                                    {deadline.text}
                                                                </span>

                                                                {/* Reminder badge */}
                                                                {bookmark.reminder_date && (
                                                                    <span style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '9999px',
                                                                        fontSize: '12px',
                                                                        fontWeight: 500,
                                                                        color: '#f97316',
                                                                        background: 'rgba(249,115,22,0.08)',
                                                                    }}>
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>notifications</span>
                                                                        {new Date(bookmark.reminder_date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Meta */}
                                                            <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bookmark_added</span>
                                                                Saved {formatDate(bookmark.created_at)}
                                                            </span>
                                                        </div>

                                                        {/* Actions menu */}
                                                        <div style={{ position: 'relative' }} ref={openMenuId === bookmark.id ? menuRef : null}>
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === bookmark.id ? null : bookmark.id)}
                                                                style={{
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '10px',
                                                                    background: '#f5f5f7',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'background 0.15s ease',
                                                                    flexShrink: 0,
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8ed'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>more_horiz</span>
                                                            </button>

                                                            {openMenuId === bookmark.id && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    right: 0,
                                                                    top: 'calc(100% + 6px)',
                                                                    width: '200px',
                                                                    background: '#fff',
                                                                    borderRadius: '14px',
                                                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                                    border: '1px solid #f0f0f0',
                                                                    zIndex: 100,
                                                                    overflow: 'hidden',
                                                                    padding: '6px',
                                                                }}>
                                                                    <MenuLink
                                                                        href={`/op/${bookmark.opportunity?.id}/${bookmark.opportunity?.slug}`}
                                                                        icon="visibility"
                                                                        label="View Details"
                                                                        onClick={() => setOpenMenuId(null)}
                                                                    />
                                                                    <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                                    {bookmark.reminder_date ? (
                                                                        <>
                                                                            <MenuButton icon="edit" label="Edit Reminder" onClick={() => openReminderModal(bookmark)} />
                                                                            <MenuButton icon="notifications_off" label="Remove Reminder" onClick={() => removeReminder(bookmark)} />
                                                                        </>
                                                                    ) : (
                                                                        <MenuButton icon="add_alert" label="Set Reminder" onClick={() => openReminderModal(bookmark)} />
                                                                    )}
                                                                    <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                                    <MenuButton icon="event" label="Google Calendar" onClick={() => syncToCalendar(bookmark, 'google')} />
                                                                    <MenuButton icon="download" label="Download .ics" onClick={() => syncToCalendar(bookmark, 'ics')} />
                                                                    <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                                    <MenuButton
                                                                        icon="delete"
                                                                        label="Remove"
                                                                        danger
                                                                        onClick={() => { removeBookmark(bookmark.id); setOpenMenuId(null); }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <EmptyState
                                            icon="filter_list_off"
                                            title={`No ${filter === 'active' ? 'Active' : 'Expired'} Opportunities`}
                                            description={`There are no ${filter === 'active' ? 'active' : 'expired'} opportunities in your bookmarks.`}
                                            buttonLabel="Show All"
                                            onButtonClick={() => setFilter('all')}
                                        />
                                    )}

                                    {/* Pagination */}
                                    {opportunities.last_page > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', marginBottom: '32px' }}>
                                            <PaginationButton
                                                label="Previous"
                                                icon="chevron_left"
                                                disabled={opportunities.current_page === 1}
                                                onClick={() => router.visit(`/bookmarked-opportunities?page=${opportunities.current_page - 1}`)}
                                            />
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 16px',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#86868b',
                                            }}>
                                                {opportunities.current_page} of {opportunities.last_page}
                                            </span>
                                            <PaginationButton
                                                label="Next"
                                                icon="chevron_right"
                                                iconAfter
                                                disabled={opportunities.current_page === opportunities.last_page}
                                                onClick={() => router.visit(`/bookmarked-opportunities?page=${opportunities.current_page + 1}`)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="bookmark_remove"
                                    title="No Saved Opportunities Yet"
                                    description="Start exploring and saving opportunities to keep track of them here."
                                    buttonLabel="Explore Opportunities"
                                    buttonHref="/opportunities"
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Reminder Modal */}
            {showReminderModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowReminderModal(false); }}
                >
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '420px',
                        margin: '0 16px',
                        overflow: 'hidden',
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>
                                    {selectedBookmark?.reminder_date ? 'Update Reminder' : 'Set Reminder'}
                                </h3>
                                <button
                                    onClick={() => setShowReminderModal(false)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#f5f5f7',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '20px 24px' }}>
                            {selectedBookmark?.opportunity && (
                                <div style={{
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: '#f5f5f7',
                                    marginBottom: '20px',
                                }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                                        {selectedBookmark.opportunity.title}
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>event_busy</span>
                                        Deadline: {formatDate(selectedBookmark.opportunity.deadline)}
                                    </span>
                                </div>
                            )}

                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#86868b',
                                marginBottom: '6px',
                            }}>
                                Reminder Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e5e7',
                                    fontSize: '14px',
                                    color: '#000',
                                    outline: 'none',
                                    marginBottom: '8px',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                            <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>info</span>
                                You'll receive a notification at the selected time.
                            </span>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '0 24px 20px',
                            justifyContent: 'flex-end',
                        }}>
                            <button
                                onClick={() => setShowReminderModal(false)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    background: '#fff',
                                    color: '#000',
                                    border: '1px solid #e0e0e0',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={setReminder}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    background: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                            >
                                {selectedBookmark?.reminder_date ? 'Update' : 'Set Reminder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </AuthenticatedLayout>
    );
}

// --- Sub-components ---

function MenuLink({ href, icon, label, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                color: '#000',
                transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>{icon}</span>
            {label}
        </Link>
    );
}

function MenuButton({ icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 500,
                color: danger ? '#dc3545' : '#000',
                background: 'transparent',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                textAlign: 'left',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = danger ? '#fef2f2' : '#f5f5f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: danger ? '#dc3545' : '#86868b' }}>{icon}</span>
            {label}
        </button>
    );
}

function EmptyState({ icon, title, description, buttonLabel, onButtonClick, buttonHref }) {
    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 24px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 500,
        background: '#000',
        color: '#fff',
        border: 'none',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
    };

    return (
        <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            borderRadius: '16px',
            border: '1px solid #f0f0f0',
            marginBottom: '32px',
        }}>
            <span style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f5f5f7',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#86868b' }}>{icon}</span>
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>{description}</p>
            {buttonHref ? (
                <Link href={buttonHref} style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    {buttonLabel}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </Link>
            ) : (
                <button onClick={onButtonClick} style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    {buttonLabel}
                </button>
            )}
        </div>
    );
}

function PaginationButton({ label, icon, iconAfter, disabled, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 500,
                background: disabled ? '#f5f5f7' : '#fff',
                color: disabled ? '#b0b0b5' : '#000',
                border: disabled ? 'none' : '1px solid #e0e0e0',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; } }}
            onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e0e0e0'; } }}
        >
            {!iconAfter && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>}
            {label}
            {iconAfter && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>}
        </button>
    );
}
