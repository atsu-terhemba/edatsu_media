import { Fragment } from "react"
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import NotificationDropdown from '@/Components/NotificationDropdown';
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import { truncateText, ActiveLink } from "@/utils/Index";
import { Images } from "@/utils/Images";
import axios from 'axios';
import UserAvatar from '@/Components/UserAvatar';
import usePushNotifications from '@/hooks/usePushNotifications';


function UserDropdown({ auth }) {
    const [show, setShow] = useState(false);
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

    const dashboardRoute = auth?.role === 'subscriber'
        ? route('subscriber.dashboard')
        : route('admin.dashboard');

    const menuItems = [
        { label: 'Dashboard', href: dashboardRoute, icon: 'dashboard' },
        { label: 'Profile', href: route('profile.edit'), icon: 'person' },
        { label: 'Settings', href: route('settings'), icon: 'settings' },
    ];

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <button
                onClick={() => setShow(!show)}
                type="button"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 4px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
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
                <UserAvatar user={auth} size={28} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {truncateText(auth?.name, 10)}
                </span>
                <span className="material-symbols-outlined" style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                    transition: 'transform 0.2s ease',
                    transform: show ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                    expand_more
                </span>
            </button>

            {show && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '200px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0',
                    zIndex: 1002,
                    overflow: 'hidden',
                    padding: '6px',
                }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setShow(false)}
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
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#86868b' }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}

                    <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        onClick={() => setShow(false)}
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
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#86868b' }}>
                            logout
                        </span>
                        Logout
                    </Link>

                    <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                    <div style={{ padding: '6px 12px', fontSize: '11px', color: '#b0b0b5' }}>
                        &copy; edatsu inc
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Header({auth}){
    const { vapidPublicKey } = usePage().props;
    const { isSubscribed, permission, subscribe } = usePushNotifications(vapidPublicKey);
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        if (auth?.id && auth?.role === 'subscriber') {
            fetchCounts();
        }
    }, [auth]);

    // Auto-prompt for push notifications once (if not yet subscribed)
    useEffect(() => {
        if (auth?.id && vapidPublicKey && !isSubscribed && permission === 'default') {
            const prompted = sessionStorage.getItem('push_prompted');
            if (!prompted) {
                sessionStorage.setItem('push_prompted', '1');
                const timer = setTimeout(() => subscribe(), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [auth, isSubscribed, permission, vapidPublicKey]);

    const fetchCounts = async () => {
        try {
            const notificationsResponse = await axios.get('/api/notifications?filter=unread');
            const notifCount = Array.isArray(notificationsResponse.data) ? notificationsResponse.data.length : 0;
            setNotificationCount(notifCount);

            const messagesResponse = await axios.get('/messages?type=inbox');
            const unreadMessages = Array.isArray(messagesResponse.data) ? messagesResponse.data.filter(msg => !msg.is_read) : [];
            setMessageCount(unreadMessages.length);
        } catch (error) {
            console.error('Error fetching counts:', error);
            setNotificationCount(0);
            setMessageCount(0);
        }
    };

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!auth?.id || auth?.role !== 'subscriber') return;
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, [auth]);

    const navLinkStyle = {
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.6)',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        padding: '8px 0',
    };

return(
<Fragment>
{/* Mobile-only minimal top bar */}
<div
    className="d-lg-none"
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}
>
    <Link href={route('home')} style={{ display: 'flex', alignItems: 'center' }}>
        <Image src={Images.app_logo_trans} width={28} className="img-fluid" alt="Edatsu" />
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginLeft: '8px', letterSpacing: '-0.02em' }}>
            edatsu<span style={{ color: '#f97316' }}>.</span>media
        </span>
    </Link>
</div>

{/* Desktop-only header - hidden on mobile */}
<Navbar
    expand="lg"
    className="header border-0 align-middle d-none d-lg-flex"
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        height: '56px',
        padding: 0,
    }}
    variant="dark"
>
<Container className="align-middle" style={{ height: '100%' }}>
    {/* Logo */}
    <Link href={route('home')} className="d-flex align-items-center" style={{ height: '100%' }}>
        <Image src={Images.app_logo_trans} width={36} className="img-fluid" alt="logo" />
    </Link>

    {/* Desktop Nav Links */}
    <div className="d-flex justify-content-between w-100" style={{ height: '100%' }}>
        <form className="d-flex" role="search"></form>
        <Nav className="m-0 p-0 d-flex flex-row align-items-center" style={{ height: '100%' }}>
            <Nav.Item>
                <Link
                    href={route('feeds')}
                    className={`nav-link me-3 ${ActiveLink('/feeds')}`}
                    style={navLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                    Feeds
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link
                    href={route('opportunities')}
                    className={`nav-link me-3 ${ActiveLink('/opportunities')}`}
                    style={navLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                    Opportunities
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link
                    href={route('toolshed')}
                    className={`nav-link me-3 ${ActiveLink('/toolshed')}`}
                    style={navLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                    Toolshed
                </Link>
            </Nav.Item>
            <Nav.Item>
                {auth?.id ? (
                    <Link
                        href={route('subscription')}
                        className={`nav-link me-3 d-flex align-items-center gap-1 ${ActiveLink('/upgrade-plan')}`}
                        style={navLinkStyle}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                    >
                        Upgrade
                        <span
                            style={{
                                fontSize: '10px',
                                padding: '2px 7px',
                                borderRadius: '9999px',
                                background: '#f97316',
                                color: '#fff',
                                fontWeight: 500,
                            }}
                        >
                            PRO
                        </span>
                    </Link>
                ) : (
                    <Link
                        href={route('pricing')}
                        className={`nav-link me-3 ${ActiveLink('/subscription')}`}
                        style={navLinkStyle}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                    >
                        Subscription
                    </Link>
                )}
            </Nav.Item>
            <Nav.Item>
                <Link
                    href={route('advertise')}
                    className={`nav-link me-3 ${ActiveLink('/advertise')}`}
                    style={navLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                    Advertise
                </Link>
            </Nav.Item>

            {/* User Authenticated */}
            {(auth?.id) ?
                <>
                    {auth?.role === 'subscriber' && (
                        <Nav.Item className="d-flex align-items-center me-2">
                            <NotificationDropdown count={notificationCount} />
                        </Nav.Item>
                    )}

                    <Nav.Item className="d-flex align-items-center">
                        <UserDropdown auth={auth} />
                    </Nav.Item>
                </>
                :
                <>
                    <Nav.Item className="d-flex flex-row gap-2 align-items-center">
                        <Link
                            href="/login"
                            style={{
                                fontSize: '13px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                                padding: '6px 16px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            style={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#000',
                                backgroundColor: '#fff',
                                padding: '6px 16px',
                                borderRadius: '9999px',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            Sign Up
                        </Link>
                    </Nav.Item>
                </>
            }
        </Nav>
    </div>
</Container>
</Navbar>
</Fragment>
    )
}
