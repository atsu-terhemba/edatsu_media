import { Link, usePage } from '@inertiajs/react';

export default function SubscriberSideNav() {
    const { url } = usePage();

    const navItems = [
        { href: route('subscriber.dashboard'), icon: 'dashboard', label: 'Dashboard' },
        { href: route('subscriber.bookmarked_opportunities'), icon: 'event', label: 'Opportunities' },
        { href: route('subscriber.bookmarked_tools'), icon: 'handyman', label: 'Tools' },
        { href: route('subscriber.saved_articles'), icon: 'article', label: 'Saved Articles' },
        { href: route('subscriber.my_feeds'), icon: 'rss_feed', label: 'My Feeds' },
        { href: route('subscriber.notifications'), icon: 'notifications', label: 'Notifications' },
        { href: route('subscriber.preferences'), icon: 'tune', label: 'Preferences' },
        { href: route('subscriber.billing'), icon: 'credit_card', label: 'Billing' },
        { href: route('profile.edit'), icon: 'settings', label: 'Settings' },
    ];

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return url.startsWith(path);
        } catch { return false; }
    };

    const itemStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        color: active ? '#fff' : 'rgba(255,255,255,0.65)',
        background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
        border: active ? '1px solid rgba(249,115,22,0.25)' : '1px solid transparent',
        position: 'relative',
        transition: 'all 0.18s ease',
    });

    const iconWrapStyle = (active) => ({
        width: '34px',
        height: '34px',
        borderRadius: '10px',
        background: active ? '#f97316' : 'rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.18s ease',
    });

    return (
        <nav
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '14px',
                borderRadius: '18px',
                background: '#1c1c1e',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                position: 'sticky',
                top: '80px',
            }}
        >
            <div style={{
                fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '8px 12px 10px',
            }}>
                Account
            </div>

            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={itemStyle(active)}
                        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}}
                        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}}
                    >
                        <span style={iconWrapStyle(active)}>
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '18px',
                                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                                }}
                            >
                                {item.icon}
                            </span>
                        </span>
                        <span>{item.label}</span>
                        {active && (
                            <span style={{
                                marginLeft: 'auto',
                                width: 6, height: 6, borderRadius: '50%',
                                background: '#f97316',
                                boxShadow: '0 0 10px rgba(249,115,22,0.6)',
                            }} />
                        )}
                    </Link>
                );
            })}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 4px' }} />

            <Link
                href={route('logout')}
                method="post"
                as="button"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(239,68,68,0.9)',
                    background: 'transparent',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.9)'; }}
            >
                <span style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '18px', color: '#ef4444' }}
                    >
                        logout
                    </span>
                </span>
                <span>Logout</span>
            </Link>
        </nav>
    );
}
