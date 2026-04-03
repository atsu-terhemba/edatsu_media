import { Fragment, useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

const FixedAuthNav = () => {
  const { auth } = usePage().props;
  const currentPath = usePage().url;
  const user = auth?.user;
  const isAdmin = user?.role === 'admin';
  const [showDrawer, setShowDrawer] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (user?.id) {
      axios.get('/api/notifications?filter=unread')
        .then(res => {
          setNotifCount(Array.isArray(res.data) ? res.data.length : 0);
        })
        .catch(() => {});
    }
  }, [user?.id]);

  // Poll notifications
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      axios.get('/api/notifications?filter=unread')
        .then(res => setNotifCount(Array.isArray(res.data) ? res.data.length : 0))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  // Bottom bar tabs — different for admin vs subscriber
  const tabs = isAdmin ? [
    { id: 'home', icon: 'dashboard', label: 'Dashboard', path: '/admin-dashboard' },
    { id: 'users', icon: 'group', label: 'Users', path: '/all-users' },
    { id: 'notif', icon: 'notifications', label: 'Alerts', path: '/notifications', badge: notifCount },
    { id: 'ads', icon: 'ads_click', label: 'Ads', path: '/admin/ads' },
    { id: 'menu', icon: 'menu', label: 'Menu', action: () => setShowDrawer(true) },
  ] : [
    { id: 'home', icon: 'home', label: 'Home', path: '/' },
    { id: 'explore', icon: 'explore', label: 'Explore', path: '/opportunities' },
    { id: 'notif', icon: 'notifications', label: 'Alerts', path: '/notifications', badge: notifCount },
    { id: 'saved', icon: 'bookmark', label: 'Saved', path: '/bookmarked-opportunities' },
    { id: 'menu', icon: 'menu', label: 'Menu', action: () => setShowDrawer(true) },
  ];

  // Admin drawer sections with expandable submenus
  const adminDrawerSections = [
    {
      title: 'Admin',
      items: [
        { label: 'Dashboard', icon: 'dashboard', path: '/admin-dashboard' },
        { label: 'Users', icon: 'group', path: '/all-users' },
        { label: 'Ads', icon: 'ads_click', path: '/admin/ads' },
      ],
    },
    {
      title: 'Manage',
      expandable: [
        {
          key: 'general',
          icon: 'settings',
          label: 'General',
          items: [
            { label: 'Brand Labels', path: '/brand-labels' },
            { label: 'Tags', path: '/tags' },
            { label: 'Regions', path: '/regions' },
            { label: 'Continents', path: '/continent' },
            { label: 'Countries', path: '/country' },
          ],
        },
        {
          key: 'opportunities',
          icon: 'post_add',
          label: 'Opportunities',
          items: [
            { label: 'Create Post', path: '/admin-post-opportunity' },
            { label: 'All Posts', path: '/all-opp-post' },
            { label: 'Categories', path: '/categories' },
          ],
        },
        {
          key: 'toolshed',
          icon: 'build',
          label: 'Toolshed',
          items: [
            { label: 'Create Product', path: '/post-product' },
            { label: 'Bulk Upload', path: '/admin-bulk-upload-product' },
            { label: 'All Products', path: '/all-products' },
            { label: 'Categories', path: '/product-categories' },
          ],
        },
        {
          key: 'events',
          icon: 'event',
          label: 'Events',
          items: [
            { label: 'Create Event', path: '/admin-post-event' },
          ],
        },
        {
          key: 'feeds',
          icon: 'rss_feed',
          label: 'Feeds',
          items: [
            { label: 'Manage Channels', path: '/admin-post-feeds-category' },
          ],
        },
      ],
    },
    {
      title: 'Browse',
      items: [
        { label: 'Opportunities', icon: 'explore', path: '/opportunities' },
        { label: 'Toolshed', icon: 'handyman', path: '/toolshed' },
        { label: 'Feeds', icon: 'rss_feed', path: '/feeds' },
        { label: 'Events', icon: 'event', path: '/events' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: 'person', path: '/profile' },
        { label: 'Directory', icon: 'folder', path: '/admin-directory' },
      ],
    },
  ];

  // Subscriber drawer sections — matches desktop SideNav fully
  const subscriberDrawerSections = [
    {
      title: 'Account',
      items: [
        { label: 'Dashboard', icon: 'dashboard', path: '/subscriber-dashboard' },
        { label: 'Saved Opportunities', icon: 'event', path: '/bookmarked-opportunities' },
        { label: 'Saved Tools', icon: 'handyman', path: '/bookmarked-tools' },
        { label: 'Saved Articles', icon: 'article', path: '/saved-articles' },
        { label: 'My Feeds', icon: 'rss_feed', path: '/my-feeds' },
        { label: 'Notifications', icon: 'notifications', path: '/notifications' },
        { label: 'Messages', icon: 'mail', path: '/messages' },
        { label: 'Preferences', icon: 'tune', path: '/preferences' },
        { label: 'Notification Settings', icon: 'settings_suggest', path: '/notification-settings' },
        { label: 'Billing', icon: 'credit_card', path: '/billing' },
        { label: 'Profile', icon: 'person', path: '/profile' },
      ],
    },
    {
      title: 'Browse',
      items: [
        { label: 'Opportunities', icon: 'explore', path: '/opportunities' },
        { label: 'Toolshed', icon: 'handyman', path: '/toolshed' },
        { label: 'Feeds', icon: 'rss_feed', path: '/feeds' },
        { label: 'Events', icon: 'event', path: '/events' },
      ],
    },
    {
      title: 'More',
      items: [
        { label: 'Upgrade Plan', icon: 'diamond', path: '/upgrade-plan', accent: true },
        { label: 'Advertise', icon: 'campaign', path: '/advertise' },
        { label: 'Help', icon: 'help', path: '/help' },
      ],
    },
  ];

  const drawerSections = isAdmin ? adminDrawerSections : subscriberDrawerSections;

  return (
    <>
      {/* Drawer */}
      {showDrawer && (
        <div
          className="d-lg-none"
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowDrawer(false)}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              maxHeight: '90vh',
              background: '#1c1c1e',
              borderRadius: '20px 20px 0 0',
              overflowY: 'auto',
              animation: 'authDrawerUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 36, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* User card */}
            {user && (
              <Link
                href="/profile"
                onClick={() => setShowDrawer(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 20px 18px', textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 600, color: '#fff', flexShrink: 0,
                }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name || 'User'}
                    </span>
                    {isAdmin && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 7px',
                        borderRadius: 9999, background: 'rgba(249,115,22,0.15)', color: '#f97316',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.25)' }}>
                  chevron_right
                </span>
              </Link>
            )}

            {/* Sections */}
            <div style={{ padding: '8px 12px 12px' }}>
              {drawerSections.map((section) => (
                <Fragment key={section.title}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    padding: '14px 14px 6px',
                  }}>
                    {section.title}
                  </div>

                  {/* Regular items */}
                  {section.items && section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setShowDrawer(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 14px',
                          borderRadius: 12,
                          textDecoration: 'none',
                          background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 20,
                            color: item.accent ? '#f97316' : active ? '#f97316' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {item.icon}
                        </span>
                        <span style={{
                          fontSize: 15, fontWeight: 500, flex: 1,
                          color: item.accent ? '#f97316' : active ? '#fff' : 'rgba(255,255,255,0.85)',
                        }}>
                          {item.label}
                        </span>
                        {item.accent && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 8px',
                            borderRadius: 9999, background: 'rgba(249,115,22,0.15)', color: '#f97316',
                          }}>
                            PRO
                          </span>
                        )}
                        {active && (
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#f97316',
                          }} />
                        )}
                      </Link>
                    );
                  })}

                  {/* Expandable submenus (admin) */}
                  {section.expandable && section.expandable.map((menu) => {
                    const isOpen = openMenus[menu.key];
                    return (
                      <div key={menu.key}>
                        <button
                          onClick={() => toggleMenu(menu.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '12px 14px', width: '100%',
                            borderRadius: 12, border: 'none',
                            background: isOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'background 0.15s',
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 20, color: isOpen ? '#f97316' : 'rgba(255,255,255,0.5)' }}
                          >
                            {menu.icon}
                          </span>
                          <span style={{
                            fontSize: 15, fontWeight: 500, flex: 1,
                            color: isOpen ? '#fff' : 'rgba(255,255,255,0.85)',
                          }}>
                            {menu.label}
                          </span>
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: 18, color: 'rgba(255,255,255,0.3)',
                              transition: 'transform 0.2s ease',
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                            }}
                          >
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <div style={{ marginLeft: 48, display: 'flex', flexDirection: 'column', gap: 2, margin: '4px 0 4px 48px' }}>
                            {menu.items.map((sub) => {
                              const subActive = isActive(sub.path);
                              return (
                                <Link
                                  key={sub.path}
                                  href={sub.path}
                                  onClick={() => setShowDrawer(false)}
                                  style={{
                                    display: 'block',
                                    padding: '9px 14px',
                                    borderRadius: 10,
                                    textDecoration: 'none',
                                    fontSize: 13,
                                    fontWeight: subActive ? 500 : 400,
                                    color: subActive ? '#fff' : 'rgba(255,255,255,0.55)',
                                    background: subActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    transition: 'all 0.15s',
                                  }}
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
                </Fragment>
              ))}

              {/* Logout */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px' }} />
              <Link
                href="/logout"
                method="post"
                as="button"
                onClick={() => setShowDrawer(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12,
                  textDecoration: 'none', background: 'transparent',
                  border: 'none', width: '100%', textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ef4444' }}>
                  logout
                </span>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#ef4444' }}>
                  Logout
                </span>
              </Link>

              {/* Copyright */}
              <div style={{ textAlign: 'center', padding: '16px 0 8px', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                &copy; edatsu inc
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div
        className="d-lg-none"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px 4px' }}>
          {tabs.map((tab) => {
            const active = tab.path ? isActive(tab.path) : false;

            const content = (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '4px 0', minWidth: 52, position: 'relative',
              }}>
                <div style={{ position: 'relative' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 22,
                      color: active ? '#f97316' : 'rgba(255,255,255,0.5)',
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                      transition: 'color 0.15s',
                    }}
                  >
                    {tab.icon}
                  </span>
                  {tab.badge > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -8,
                      minWidth: 16, height: 16, borderRadius: 9999,
                      background: '#f97316', color: '#fff',
                      fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                      border: '2px solid rgba(0,0,0,0.9)',
                    }}>
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 600 : 500, letterSpacing: '0.01em',
                  color: active ? '#f97316' : 'rgba(255,255,255,0.45)',
                  transition: 'color 0.15s',
                }}>
                  {tab.label}
                </span>
              </div>
            );

            if (tab.action) {
              return (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.path}
                style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="d-lg-none" style={{ height: '72px' }} />

      <style>{`
        @keyframes authDrawerUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FixedAuthNav;
