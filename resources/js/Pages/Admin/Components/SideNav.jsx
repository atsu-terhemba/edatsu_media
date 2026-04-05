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
        { href: route('admin.users'), icon: 'group', label: 'Users' },
        { href: route('admin.ads'), icon: 'ads_click', label: 'Ads' },
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

    const linkStyle = (active) => ({
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
    });

    const iconWrapStyle = (active) => ({
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: active ? '#000' : '#f5f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
    });

    return (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={linkStyle(active)}
                        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}}
                        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6e6e73'; }}}
                    >
                        <span style={iconWrapStyle(active)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: active ? '#fff' : '#6e6e73' }}>
                                {item.icon}
                            </span>
                        </span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}

            <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />

            {expandableMenus.map((menu) => (
                <div key={menu.key}>
                    <button
                        onClick={() => toggleMenu(menu.key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: openMenus[menu.key] ? '#f5f5f7' : 'transparent',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: openMenus[menu.key] ? '#000' : '#6e6e73',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={(e) => { if (!openMenus[menu.key]) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6e6e73'; }}}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={iconWrapStyle(openMenus[menu.key])}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: openMenus[menu.key] ? '#fff' : '#6e6e73' }}>
                                    {menu.icon}
                                </span>
                            </span>
                            <span>{menu.label}</span>
                        </div>
                        <span className="material-symbols-outlined" style={{
                            fontSize: '18px',
                            transition: 'transform 0.2s ease',
                            transform: openMenus[menu.key] ? 'rotate(180deg)' : 'rotate(0)',
                        }}>
                            expand_more
                        </span>
                    </button>

                    {openMenus[menu.key] && (
                        <div style={{ marginLeft: '48px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', marginBottom: '4px' }}>
                            {menu.items.map((sub) => {
                                const subActive = isActive(sub.href);
                                return (
                                    <Link
                                        key={sub.label}
                                        href={sub.href}
                                        style={{
                                            display: 'block',
                                            padding: '8px 14px',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            fontSize: '13px',
                                            fontWeight: subActive ? 500 : 400,
                                            color: subActive ? '#000' : '#86868b',
                                            background: subActive ? '#f5f5f7' : 'transparent',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                                        onMouseLeave={(e) => { if (!subActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#86868b'; }}}
                                    >
                                        {sub.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}

            <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />

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
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6e6e73'; }}
            >
                <span style={iconWrapStyle(false)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>logout</span>
                </span>
                <span>Logout</span>
            </Link>
        </nav>
    );
}
