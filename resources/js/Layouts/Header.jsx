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
import useUnreadNotifications from '@/hooks/useUnreadNotifications';


function UserDropdown({ auth, isPro }) {
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
                {isPro && (
                    <span
                        title="Pro member"
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            background: '#f97316',
                            color: '#fff',
                            textTransform: 'uppercase',
                        }}
                    >
                        Pro
                    </span>
                )}
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
    const { vapidPublicKey, auth: authShared } = usePage().props;
    const isPro = !!authShared?.isPro;
    const { isSubscribed, permission, subscribe } = usePushNotifications(vapidPublicKey);
    const { notificationCount } = useUnreadNotifications(auth);

    const [showProBanner, setShowProBanner] = useState(false);
    useEffect(() => {
        if (isPro) return;
        if (typeof window === 'undefined') return;
        if (sessionStorage.getItem('pro_banner_dismissed') === '1') return;
        setShowProBanner(true);
    }, [isPro]);

    const isGuest = !auth?.id;
    const proBannerHref = isGuest ? '/login' : route('subscription');
    const proBannerSubtext = isGuest
        ? 'Log in to access the full Pro experience'
        : 'Upgrade to unlock the full Pro experience';
    const proBannerCtaLabel = isGuest ? 'Login' : 'Upgrade';

    const dismissProBanner = () => {
        setShowProBanner(false);
        try { sessionStorage.setItem('pro_banner_dismissed', '1'); } catch (e) {}
    };

    const [showCookieBanner, setShowCookieBanner] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (localStorage.getItem('edatsu_cookie_consent') === '1') return;
        const t = setTimeout(() => setShowCookieBanner(true), 600);
        return () => clearTimeout(t);
    }, []);
    const acceptCookies = () => {
        setShowCookieBanner(false);
        try { localStorage.setItem('edatsu_cookie_consent', '1'); } catch (e) {}
    };

    // Auto-prompt or auto-resubscribe for push notifications.
    // - permission === 'default': prompt once per session (sessionStorage gate)
    // - permission === 'granted' but no active subscription: silently re-subscribe
    //   so devices whose FCM endpoint expired or whose SW got cleared rejoin
    //   without the user having to do anything.
    useEffect(() => {
        if (!auth?.id || !vapidPublicKey || isSubscribed) return;

        if (permission === 'granted') {
            const timer = setTimeout(() => subscribe(), 1000);
            return () => clearTimeout(timer);
        }

        if (permission === 'default') {
            const prompted = sessionStorage.getItem('push_prompted');
            if (!prompted) {
                sessionStorage.setItem('push_prompted', '1');
                const timer = setTimeout(() => subscribe(), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [auth, isSubscribed, permission, vapidPublicKey]);

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

{/* Pro upsell banner — shown to non-Pro users until dismissed */}
{showProBanner && !isPro && (
    <div
        className="pro-upsell-banner"
        role="region"
        aria-label="Upgrade for Pro benefits"
        style={{
            position: 'fixed',
            top: '48px',
            left: 0,
            right: 0,
            zIndex: 49,
            padding: '10px 0',
            background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            color: '#fff',
            animation: 'proBannerSlideDown 0.35s ease-out',
        }}
    >
      <Container style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
            aria-hidden="true"
            style={{
                flexShrink: 0,
                width: '34px',
                height: '34px',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 4px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff', fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
                lock_open
            </span>
        </span>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Unlock Pro Features
            </div>
            <Link
                href={proBannerHref}
                style={{
                    fontSize: '11.5px',
                    color: 'rgba(255,255,255,0.92)',
                    textDecoration: 'none',
                    fontWeight: 400,
                }}
            >
                {proBannerSubtext} &rsaquo;
            </Link>
        </div>
        <Link
            href={proBannerHref}
            style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#b91c1c',
                background: '#fff',
                padding: '6px 12px',
                borderRadius: '9999px',
                textDecoration: 'none',
                flexShrink: 0,
            }}
        >
            {proBannerCtaLabel}
        </Link>
        <button
            type="button"
            onClick={dismissProBanner}
            aria-label="Dismiss"
            style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
            }}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>
      </Container>
        <style>{`
            @keyframes proBannerSlideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to   { transform: translateY(0); opacity: 1; }
            }
            @media (min-width: 992px) {
                .pro-upsell-banner { top: 56px !important; }
            }
        `}</style>
    </div>
)}

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
                <Link
                    href={route('forum')}
                    className={`nav-link me-3 ${ActiveLink('/forum')}`}
                    style={navLinkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                    Forum
                </Link>
            </Nav.Item>
            <Nav.Item>
                {auth?.id ? (
                    isPro ? (
                        <Link
                            href={route('subscription')}
                            className={`nav-link me-3 d-flex align-items-center gap-1 ${ActiveLink('/upgrade-plan')}`}
                            style={{ ...navLinkStyle, color: '#fff' }}
                            title="Manage your Pro plan"
                        >
                            <span
                                style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    padding: '2px 6px',
                                    borderRadius: '9999px',
                                    background: '#f97316',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Pro
                            </span>
                        </Link>
                    ) : (
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
                    )
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
                        <UserDropdown auth={auth} isPro={isPro} />
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

{/* Cookie + data policy notice — bottom of screen, dismissed via localStorage */}
{showCookieBanner && (
    <div
        role="region"
        aria-label="Cookie and data policy notice"
        style={{
            position: 'fixed',
            left: '16px',
            right: '16px',
            bottom: '16px',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
            zIndex: 1001,
            background: 'rgba(20,20,22,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'cookieBannerSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
    >
        <span
            aria-hidden="true"
            style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                background: 'rgba(249,115,22,0.18)',
                border: '1px solid rgba(249,115,22,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#f97316', fontVariationSettings: "'FILL' 1" }}>
                cookie
            </span>
        </span>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                We use cookies
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)' }}>
                To improve your experience. See our{' '}
                <Link
                    href={route('privacy')}
                    style={{ color: '#f97316', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(249,115,22,0.4)' }}
                >
                    Privacy &amp; Data Policy
                </Link>
                .
            </div>
        </div>
        <button
            type="button"
            onClick={acceptCookies}
            style={{
                flexShrink: 0,
                fontSize: '12px',
                fontWeight: 600,
                color: '#000',
                background: '#fff',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            Got it
        </button>
        <style>{`
            @keyframes cookieBannerSlideUp {
                from { transform: translateY(150%); opacity: 0; }
                to   { transform: translateY(0); opacity: 1; }
            }
        `}</style>
    </div>
)}
</Fragment>
    )
}
