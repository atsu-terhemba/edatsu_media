import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
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
        const res = await axios.get('/api/notifications?limit=5');
        setNotifications(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={handleToggle}
        aria-label="Show notifications"
        type="button"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>
          notifications
        </span>
        {count > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '18px',
            height: '18px',
            borderRadius: '9999px',
            background: '#f97316',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid rgba(0, 0, 0, 0.8)',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {show && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: '340px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          zIndex: 1002,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid #f0f0f0',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>Notifications</span>
            {loading && (
              <span className="material-symbols-outlined" style={{
                fontSize: '16px',
                color: '#86868b',
                animation: 'spin 1s linear infinite',
              }}>
                progress_activity
              </span>
            )}
          </div>

          {/* Body */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {(!loading && notifications.length === 0) && (
              <div style={{
                padding: '32px 16px',
                textAlign: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#d1d1d6', display: 'block', marginBottom: '8px' }}>
                  notifications_off
                </span>
                <span style={{ fontSize: '13px', color: '#86868b' }}>No notifications yet</span>
              </div>
            )}
            {notifications.map((notif, idx) => (
              <div
                key={notif.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  borderBottom: idx < notifications.length - 1 ? '1px solid #f5f5f7' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f5f5f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#000' }}>
                    notifications
                  </span>
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#000', marginBottom: '2px' }}>
                    {notif.title || 'Notification'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#86868b', lineHeight: 1.4 }}>
                    {notif.body || notif.message || ''}
                  </div>
                  {notif.created_at && (
                    <div style={{ fontSize: '11px', color: '#b0b0b5', marginTop: '4px' }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
          }}>
            <Link
              href="/notifications"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#000',
                textDecoration: 'none',
                padding: '6px 20px',
                borderRadius: '9999px',
                border: '1px solid #e0e0e0',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              View all
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
