import { Link, usePage } from "@inertiajs/react";
import { useState } from 'react';

export default function AdminSideNav() {
    const { url } = usePage();

    const [openMenus, setOpenMenus] = useState({
        generalOptions: false,
        opportunityPosts: false,
        toolshedPosts: false,
        forum: false,
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return url.startsWith(path);
        } catch { return false; }
    };

    const navItems = [
        { href: route('admin.dashboard'), icon: 'dashboard', label: 'Dashboard' },
        { href: route('admin.engagement'), icon: 'analytics', label: 'Engagement' },
        { href: route('admin.users'), icon: 'group', label: 'Users' },
        { href: route('admin.subscriptions'), icon: 'payments', label: 'Subscriptions' },
        { href: route('admin.mail_subscribers'), icon: 'mail', label: 'Mailing List' },
        { href: route('admin.feedback'), icon: 'rate_review', label: 'Feedback' },
        { href: route('admin.ads'), icon: 'ads_click', label: 'Ads' },
        { href: route('admin.pro_gating'), icon: 'workspace_premium', label: 'Pro Gating' },
    ];

    const expandableMenus = [
        {
            key: 'generalOptions',
            icon: 'settings',
            label: 'General',
            items: [
                { href: route('admin.brand-labels'), label: 'Brand Labels' },
                { href: route('admin.tag'), label: 'Tags' },
                { href: route('admin.regions'), label: 'Regions' },
                { href: route('admin.continent'), label: 'Continents' },
                { href: route('admin.countries'), label: 'Countries' },
            ],
        },
        {
            key: 'opportunityPosts',
            icon: 'post_add',
            label: 'Opportunities',
            items: [
                { href: route('admin.opp'), label: 'Create Post' },
                { href: route('admin.all_opp_post'), label: 'All Posts' },
                { href: route('admin.categories'), label: 'Categories' },
            ],
        },
        {
            key: 'toolshedPosts',
            icon: 'build',
            label: 'Toolshed',
            items: [
                { href: route('admin.products'), label: 'Create Product' },
                { href: route('admin.bulk_upload_product'), label: 'Bulk Upload' },
                { href: route('admin.all_products'), label: 'All Products' },
                { href: route('admin.product_categories'), label: 'Categories' },
            ],
        },
        {
            key: 'forum',
            icon: 'forum',
            label: 'Forum',
            items: [
                { href: route('admin.forum_threads'), label: 'All Threads' },
                { href: route('admin.forum_reports'), label: 'Reports' },
            ],
        },
    ];

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

    const sectionLabel = (text) => (
        <div style={{
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '12px 12px 8px',
        }}>
            {text}
        </div>
    );

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
            {sectionLabel('Admin')}

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
                            <span className="material-symbols-outlined" style={{
                                fontSize: '18px',
                                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                            }}>
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

            {sectionLabel('Manage')}

            {expandableMenus.map((menu) => {
                const isOpen = openMenus[menu.key];
                return (
                    <div key={menu.key}>
                        <button
                            onClick={() => toggleMenu(menu.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '12px',
                                border: '1px solid transparent',
                                background: isOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: isOpen ? '#fff' : 'rgba(255,255,255,0.65)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.18s ease',
                            }}
                            onMouseEnter={(e) => { if (!isOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}}
                            onMouseLeave={(e) => { if (!isOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={iconWrapStyle(isOpen)}>
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: '18px',
                                        color: isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                                    }}>
                                        {menu.icon}
                                    </span>
                                </span>
                                <span>{menu.label}</span>
                            </div>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '18px',
                                color: 'rgba(255,255,255,0.35)',
                                transition: 'transform 0.2s ease',
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                            }}>
                                expand_more
                            </span>
                        </button>

                        {isOpen && (
                            <div style={{
                                marginLeft: '46px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                marginTop: '4px',
                                marginBottom: '6px',
                                paddingLeft: '10px',
                                borderLeft: '1px solid rgba(255,255,255,0.08)',
                            }}>
                                {menu.items.map((sub) => {
                                    const subActive = isActive(sub.href);
                                    return (
                                        <Link
                                            key={sub.label}
                                            href={sub.href}
                                            style={{
                                                display: 'block',
                                                padding: '7px 12px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                fontSize: '13px',
                                                fontWeight: subActive ? 500 : 400,
                                                color: subActive ? '#f97316' : 'rgba(255,255,255,0.5)',
                                                background: subActive ? 'rgba(249,115,22,0.08)' : 'transparent',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { if (!subActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; }}}
                                            onMouseLeave={(e) => { if (!subActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}
                                        >
                                            {sub.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
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
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ef4444' }}>logout</span>
                </span>
                <span>Logout</span>
            </Link>
        </nav>
    );
}
