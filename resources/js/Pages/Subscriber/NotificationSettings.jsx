import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import usePushNotifications from '@/hooks/usePushNotifications';

export default function NotificationSettings() {
    const { vapidPublicKey } = usePage().props;
    const { isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications(vapidPublicKey);
    const [loading, setLoading] = useState(false);

    const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

    const handleToggle = async () => {
        setLoading(true);
        if (isSubscribed) {
            await unsubscribe();
        } else {
            await subscribe();
        }
        setLoading(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notification Settings" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            <div style={{ padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
                                    Notification Settings
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '32px' }}>
                                    Manage how you receive notifications from Edatsu.
                                </p>

                                {/* In-App Notifications */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>
                                                notifications
                                            </span>
                                            In-App Notifications
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#86868b', paddingLeft: '26px' }}>
                                            Get notified in the app when your reminders are due. Badge appears on the bell icon.
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 14px',
                                        borderRadius: '9999px',
                                        background: '#e8f5e9',
                                        color: '#2e7d32',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }}>
                                        Always on
                                    </div>
                                </div>

                                {/* Push Notifications */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>
                                                phone_android
                                            </span>
                                            Push Notifications
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#86868b', paddingLeft: '26px' }}>
                                            Receive push notifications on this device when reminders are due.
                                        </div>
                                        {!supported && (
                                            <div style={{ fontSize: '12px', color: '#d32f2f', paddingLeft: '26px', marginTop: '4px' }}>
                                                Push notifications are not supported in this browser.
                                            </div>
                                        )}
                                        {supported && permission === 'denied' && (
                                            <div style={{ fontSize: '12px', color: '#d32f2f', paddingLeft: '26px', marginTop: '4px' }}>
                                                Notifications are blocked. Please enable them in your browser settings.
                                            </div>
                                        )}
                                    </div>
                                    {supported && permission !== 'denied' && (
                                        <button
                                            onClick={handleToggle}
                                            disabled={loading}
                                            style={{
                                                position: 'relative',
                                                width: '48px',
                                                height: '28px',
                                                borderRadius: '9999px',
                                                border: 'none',
                                                cursor: loading ? 'wait' : 'pointer',
                                                background: isSubscribed ? '#f97316' : '#d1d1d6',
                                                transition: 'background 0.2s ease',
                                                padding: 0,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span style={{
                                                position: 'absolute',
                                                top: '2px',
                                                left: isSubscribed ? '22px' : '2px',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#fff',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                                transition: 'left 0.2s ease',
                                            }} />
                                        </button>
                                    )}
                                </div>

                                {/* Email Notifications */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px 0',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>
                                                mail
                                            </span>
                                            Email Notifications
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#86868b', paddingLeft: '26px' }}>
                                            Receive email reminders when your bookmark reminders are due.
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 14px',
                                        borderRadius: '9999px',
                                        background: '#e8f5e9',
                                        color: '#2e7d32',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }}>
                                        Always on
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
