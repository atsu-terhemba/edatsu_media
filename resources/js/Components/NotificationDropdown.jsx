import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './NotificationDropdown.css';

export default function NotificationDropdown({ count }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  const handleToggle = async () => {
    setShow((prev) => !prev);
    if (!show && notifications.length === 0) {
      setLoading(true);
      try {
        const res = await axios.get('/notifications?limit=5');
        setNotifications(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="notification-dropdown-wrapper position-relative" ref={dropdownRef}>
      <button
        className="btn btn-link nav-link text-light text-decoration-none position-relative d-inline-flex align-items-center notification-bell-btn"
        style={{ padding: '0.5rem' }}
        onClick={handleToggle}
        aria-label="Show notifications"
        type="button"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>notifications</span>
        {count > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute notification-badge"
            style={{ fontSize: '0.65rem', top: '0.2rem', right: '0.1rem', minWidth: '1.2rem', height: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', fontWeight: 'bold' }}
          >
            {count > 9 ? '9+' : count}
          </Badge>
        )}
      </button>
      {show && (
        <div className="notification-dropdown shadow-lg animate__animated animate__fadeIn">
          <div className="dropdown-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
            <span className="fw-bold">Notifications</span>
            {loading && <Spinner animation="border" size="sm" />}
          </div>
          <div className="dropdown-body px-3 py-2" style={{ minWidth: 320, maxWidth: 360, maxHeight: 350, overflowY: 'auto' }}>
            {(!loading && notifications.length === 0) && (
              <div className="text-center text-muted py-3 small">No notifications</div>
            )}
            {notifications.map((notif, idx) => (
              <div key={notif.id || idx} className="notification-item border-bottom py-2 d-flex align-items-start gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>notifications</span>
                <div style={{ flex: 1 }}>
                  <div className="fw-semibold small mb-1">{notif.title || 'Notification'}</div>
                  <div className="text-muted small">{notif.body || notif.message || ''}</div>
                  <div className="text-muted small mt-1" style={{ fontSize: '0.75em' }}>{notif.created_at ? new Date(notif.created_at).toLocaleString() : ''}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dropdown-footer border-top px-3 py-2 text-center">
            <Link href="/notifications" className="btn btn-sm btn-outline-primary w-100">See all notifications</Link>
          </div>
        </div>
      )}
    </div>
  );
}
