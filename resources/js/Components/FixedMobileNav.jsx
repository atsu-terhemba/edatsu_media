import { Fragment, useState } from "react";
import { Link, usePage } from '@inertiajs/react';
import { Images } from "@/utils/Images";

const FixedMobileNav = ({
  isAuthenticated = false,
  toggleSearch
}) => {
  const { auth, url: pageUrl } = usePage().props;
  const { url: inertiaUrl } = usePage();
  const currentPath = inertiaUrl || '/';
  const [showDrawer, setShowDrawer] = useState(false);

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const handleSearchClick = () => {
    toggleSearch();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // Bottom bar items for guest
  const guestTabs = [
    { id: 'feeds', icon: 'rss_feed', label: 'Feeds', path: '/feeds' },
    { id: 'opps', icon: 'explore', label: 'Explore', path: '/opportunities' },
    { id: 'tools', icon: 'handyman', label: 'Tools', path: '/toolshed' },
    { id: 'more', icon: 'menu', label: 'Menu', action: () => setShowDrawer(true) },
  ];

  // Bottom bar items for logged-in user (guest pages context)
  const authTabs = [
    { id: 'feeds', icon: 'rss_feed', label: 'Feeds', path: '/feeds' },
    { id: 'opps', icon: 'explore', label: 'Explore', path: '/opportunities' },
    { id: 'tools', icon: 'handyman', label: 'Tools', path: '/toolshed' },
    { id: 'more', icon: 'menu', label: 'Menu', action: () => setShowDrawer(true) },
  ];

  const tabs = isAuthenticated ? authTabs : guestTabs;

  // Drawer menu items
  const drawerItems = isAuthenticated ? [
    { label: 'Dashboard', icon: 'dashboard', path: '/subscriber-dashboard' },
    { label: 'Profile', icon: 'person', path: '/profile' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Saved Items', icon: 'bookmark', path: '/bookmarked-opportunities' },
    { type: 'divider' },
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Feeds', icon: 'rss_feed', path: '/feeds' },
    { label: 'Opportunities', icon: 'explore', path: '/opportunities' },
    { label: 'Toolshed', icon: 'handyman', path: '/toolshed' },
    { type: 'divider' },
    { label: 'Pricing', icon: 'diamond', path: '/subscription' },
    { label: 'Advertise', icon: 'campaign', path: '/advertise' },
    { label: 'Help', icon: 'help', path: '/help' },
    { type: 'divider' },
    { label: 'Logout', icon: 'logout', path: '/logout', method: 'post', danger: true },
  ] : [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Feeds', icon: 'rss_feed', path: '/feeds' },
    { label: 'Opportunities', icon: 'explore', path: '/opportunities' },
    { label: 'Toolshed', icon: 'handyman', path: '/toolshed' },
    { type: 'divider' },
    { label: 'Pricing', icon: 'diamond', path: '/subscription' },
    { label: 'Advertise', icon: 'campaign', path: '/advertise' },
    { label: 'Help', icon: 'help', path: '/help' },
    { type: 'divider' },
    { label: 'Login', icon: 'login', path: '/login' },
    { label: 'Sign Up', icon: 'person_add', path: '/sign-up' },
  ];

  return (
    <>
      {/* Drawer overlay */}
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
              maxHeight: '85vh',
              background: '#1c1c1e',
              borderRadius: '20px 20px 0 0',
              overflowY: 'auto',
              animation: 'mobileDrawerUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* User info (auth only) */}
            {isAuthenticated && auth?.user && (
              <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 600, color: '#fff',
                }}>
                  {(auth.user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                    {auth.user.name || 'User'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    {auth.user.email || 'Subscriber'}
                  </div>
                </div>
              </div>
            )}

            {/* Menu items */}
            <div style={{ padding: '0 12px 20px' }}>
              {drawerItems.map((item, idx) => {
                if (item.type === 'divider') {
                  return <div key={`d-${idx}`} style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 8px' }} />;
                }

                const linkProps = item.method === 'post'
                  ? { href: item.path, method: 'post', as: 'button' }
                  : { href: item.path };

                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    {...linkProps}
                    onClick={() => setShowDrawer(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 14px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                      transition: 'background 0.15s',
                      border: 'none', width: '100%', textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 20,
                        color: item.danger ? '#ef4444' : active ? '#f97316' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span style={{
                      fontSize: 15, fontWeight: 500,
                      color: item.danger ? '#ef4444' : active ? '#fff' : 'rgba(255,255,255,0.85)',
                    }}>
                      {item.label}
                    </span>
                    {active && (
                      <span style={{
                        marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                        background: '#f97316',
                      }} />
                    )}
                  </Link>
                );
              })}
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
                gap: 2, padding: '4px 0', minWidth: 52,
              }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    color: active ? '#f97316' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.15s',
                  }}
                >
                  {tab.icon}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.01em',
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
        @keyframes mobileDrawerUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FixedMobileNav;
