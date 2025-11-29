import { Fragment, useState } from "react";
import { Link, usePage } from '@inertiajs/react';
import FlatButton from './FlatButton';

const FixedMobileNav = ({
  isAuthenticated = false,
  currentPath = '/',
  toggleSearch
}) => {
  const { auth } = usePage().props;
  const username = auth?.user?.name || auth?.user?.username || '';
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(true);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const toggleMenuModal = () => {
    setShowMenuModal(!showMenuModal);
  };

  const handleSearchClick = () => {
    // Toggle the search panel
    toggleSearch();
    
    // Scroll to top smoothly
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const getHighlightClass = (path) => {
    return currentPath === path;
  };

  // Navigation pages based on authentication
  const getNavigationPages = () => {
    const commonPages = [
      { 
        name: 'Opportunities', 
        path: '/opportunities', 
        icon: 'event',
        description: 'Browse latest opportunities',
        isSeparator: true
      },
      { 
        name: 'Toolshed', 
        path: '/toolshed', 
        icon: 'handyman',
        description: 'Discover useful tools' 
      },
      { 
        name: 'Help', 
        path: '/help', 
        icon: 'help',
        description: 'Find answers and support' 
      },
    ];

    if (isAuthenticated) {
      return [
        { 
          name: 'Dashboard', 
          path: '/subscriber-dashboard',
          icon: 'dashboard',
          description: 'Your personal dashboard' 
        },
        { 
          name: 'Profile', 
          path: '/profile',
          icon: 'person',
          description: 'Edit your profile' 
        },
        { 
          name: 'Saved Opportunities', 
          path: '/bookmarked-opportunities',
          icon: 'bookmark',
          description: 'Your saved opportunities' 
        },
        { 
          name: 'Saved Tools', 
          path: '/bookmarked-tools',
          icon: 'bookmark',
          description: 'Your saved tools' 
        },
        { 
          name: 'Notifications', 
          path: '/notifications',
          icon: 'notifications',
          description: 'Your notifications' 
        },
        ...commonPages,
      ];
    } else {
      return [
        ...commonPages,
        { 
          name: 'Login', 
          path: '/login', 
          icon: 'login',
          description: 'Sign in to your account' 
        },
        { 
          name: 'Register', 
          path: '/register', 
          icon: 'person_add',
          description: 'Create a new account' 
        },
      ];
    }
  };

  const navItems = [
    {
      id: 'menu',
      icon: 'menu',
      label: 'Menu',
      path: null,
      onClick: toggleMenuModal
    },
    {
      id: 'search',
      icon: 'search',
      label: 'Search',
      path: null,
      onClick: handleSearchClick
    },
    {
      id: 'toolshed',
      icon: 'handyman',
      label: 'Toolshed',
      path: '/toolshed',
      onClick: null
    },
    {
      id: 'profile',
      icon: 'person',
      label: isAuthenticated ? 'Profile' : 'Login',
      path: isAuthenticated ? '/profile' : '/login',
      onClick: null
    }
  ];

  return (
    <>
      {/* Menu Modal */}
      {showMenuModal && (
        <div 
          className="position-fixed w-100 d-md-none"
          style={{
            top: 0,
            left: 0,
            bottom: '80px', // Leave space for bottom nav
            zIndex: 1100, // Below the bottom nav (1000)
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={toggleMenuModal}
        >
          <div 
            className="position-absolute w-100 bg-white h-100"
            style={{
              top: 0,
              overflowY: 'auto',
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translateY(0)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="d-flex align-items-center justify-content-between p-4 border-bottom sticky-top"
              style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                zIndex: 10
              }}
            >
              <h5 className="mb-0 fw-bold text-dark">{isAuthenticated ? 'My Account' : 'Navigation'}</h5>
              <FlatButton 
                variant="outline-secondary"
                size="sm"
                onClick={toggleMenuModal}
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
              >
                ×
              </FlatButton>
            </div>

            {/* Profile Section (if logged in) */}
            {isAuthenticated && username && (
              <div 
                className="p-4 border-bottom"
                style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-semibold text-dark" style={{ fontSize: '16px' }}>
                      {username}
                    </div>
                    <span 
                      className="badge"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Logged in
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="pb-4">
              {getNavigationPages().map((page) => (
                <Fragment key={page.path}>
                  {page.isSeparator && (
                    <div 
                      className="px-4 py-2 text-muted fw-semibold"
                      style={{ 
                        fontSize: '12px', 
                        background: '#f8fafc',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Browse
                    </div>
                  )}
                  <Link
                    href={page.path}
                    className="text-decoration-none"
                    onClick={toggleMenuModal}
                  >
                    <div 
                      className="d-flex align-items-center justify-content-between p-4 border-bottom hover-list-item"
                      style={{
                        background: getHighlightClass(page.path) ? '#f0f9ff' : 'white',
                        borderLeft: getHighlightClass(page.path) ? '4px solid #3b82f6' : '4px solid transparent',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <span 
                          className="material-symbols-outlined me-3"
                          style={{ 
                            fontSize: '24px',
                            color: getHighlightClass(page.path) ? '#3b82f6' : '#6b7280'
                          }}
                        >
                          {page.icon}
                        </span>
                        <div>
                          <div 
                            className="fw-semibold"
                            style={{ 
                              color: getHighlightClass(page.path) ? '#1e40af' : '#374151',
                              fontSize: '16px'
                            }}
                          >
                            {page.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '13px' }}>
                            {page.description}
                          </div>
                        </div>
                      </div>
                      <div 
                        className="ms-3"
                        style={{
                          color: getHighlightClass(page.path) ? '#3b82f6' : '#9ca3af',
                          fontSize: '18px'
                        }}
                      >
                        →
                      </div>
                    </div>
                  </Link>
                </Fragment>
              ))}

              {/* Logout (if logged in) */}
              {isAuthenticated && (
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="text-decoration-none w-100 border-0 bg-transparent text-start"
                  onClick={toggleMenuModal}
                >
                  <div 
                    className="d-flex align-items-center justify-content-between p-4 border-bottom hover-list-item"
                    style={{
                      background: 'white',
                      borderLeft: '4px solid transparent',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <span 
                        className="material-symbols-outlined me-3"
                        style={{ fontSize: '24px', color: '#ef4444' }}
                      >
                        logout
                      </span>
                      <div>
                        <div className="fw-semibold" style={{ color: '#ef4444', fontSize: '16px' }}>
                          Logout
                        </div>
                        <div className="text-muted" style={{ fontSize: '13px' }}>
                          Sign out of your account
                        </div>
                      </div>
                    </div>
                    <div className="ms-3" style={{ color: '#9ca3af', fontSize: '18px' }}>
                      →
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Mobile Navigation */}
      <div 
        className="d-md-none position-fixed w-100"
        style={{
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '8px 0 20px 0'
        }}
      >
        <div className="container-fluid px-2">
          <div className="d-flex justify-content-between">
            {navItems.map((item) => {
              const isActive = item.path ? getHighlightClass(item.path) : false;
              
              const buttonContent = (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <div 
                    className={`d-flex align-items-center justify-content-center rounded-circle transition-all`}
                    style={{
                      width: '44px',
                      height: '44px',
                      background: isActive ? '#e5e7eb' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        color: isActive ? '#374151' : '#6b7280'
                      }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span 
                    className="mt-1"
                    style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      color: isActive ? '#374151' : '#9ca3af',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );

              return (
                <div key={item.id} className="flex-fill text-center">
                  {item.path ? (
                    <Link
                      href={item.path}
                      className="btn border-0 p-0 w-100 bg-transparent"
                      style={{ 
                        height: '60px',
                        textDecoration: 'none'
                      }}
                    >
                      {buttonContent}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="btn border-0 p-0 w-100 bg-transparent"
                      style={{ height: '60px' }}
                    >
                      {buttonContent}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="d-md-none" style={{ height: '80px' }}></div>

      {/* CSS for animations */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .hover-list-item:hover {
          background: #f8fafc !important;
          transform: translateX(4px);
        }
        
        .hover-list-item:hover div:last-child {
          transform: translateX(4px);
        }
        
        .hover-list-item:active {
          background: #e2e8f0 !important;
          transform: scale(0.98) translateX(4px);
        }
      `}</style>
    </>
  );
};

export default FixedMobileNav;