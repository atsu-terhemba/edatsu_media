import { Link, usePage } from '@inertiajs/react';

export default function SubscriberSideNav() {
    const { url } = usePage();

    const navItems = [
        { href: route('subscriber.dashboard'), icon: 'dashboard', label: 'Dashboard' },
        { href: route('subscriber.bookmarked_opportunities'), icon: 'event', label: 'Opportunities' },
        { href: route('subscriber.bookmarked_tools'), icon: 'handyman', label: 'Tools' },
        { href: route('subscriber.notifications'), icon: 'notifications', label: 'Notifications' },
        { href: route('subscriber.preferences'), icon: 'tune', label: 'Preferences' },
        { href: route('subscriber.billing'), icon: 'credit_card', label: 'Billing' },
        { href: route('profile.edit'), icon: 'settings', label: 'Settings' },
    ];

    const isActive = (href) => {
        const path = new URL(href, window.location.origin).pathname;
        return url.startsWith(path);
    };

    return (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: active ? '#000' : '#6e6e73',
                            background: active ? '#f5f5f7' : 'transparent',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (!active) {
                                e.currentTarget.style.background = '#f5f5f7';
                                e.currentTarget.style.color = '#000';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!active) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#6e6e73';
                            }
                        }}
                    >
                        <span style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: active ? '#000' : '#f5f5f7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '18px',
                                color: active ? '#fff' : '#6e6e73',
                            }}>
                                {item.icon}
                            </span>
                        </span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}

            {/* Separator */}
            <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />

            {/* Logout */}
            <Link
                href={route('logout')}
                method="post"
                as="button"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#6e6e73',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f7';
                    e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6e6e73';
                }}
            >
                <span style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>
                        logout
                    </span>
                </span>
                <span>Logout</span>
            </Link>
        </nav>
    );
}
