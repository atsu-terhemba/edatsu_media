import { Fragment, useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import FlatButton from './FlatButton';

const FixedMobileNav = ({
  isAuthenticated = false,
  currentPath = '/',
  username = '', 
  toggleSearch
}) => {
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

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
        name: 'Home', 
        path: '/', 
        description: 'Back to main page' 
      },
      { 
        name: 'Opportunities', 
        path: '/opportunities', 
        description: 'Browse latest opportunities' 
      },
      { 
        name: 'Toolshed', 
        path: '/toolshed', 
        description: 'Discover useful tools' 
      },
      { 
        name: 'About', 
        path: '/about', 
        description: 'Learn more about us' 
      },
      { 
        name: 'Contact', 
        path: '/contact', 
        description: 'Get in touch with us' 
      },
      { 
        name: 'Help', 
        path: '/help', 
        description: 'Find answers and support' 
      },
      { 
        name: 'Terms & Conditions', 
        path: '/terms', 
        description: 'Our terms of service' 
      },
      { 
        name: 'Privacy Policy', 
        path: '/privacy', 
        description: 'How we protect your data' 
      },
    ];

    if (isAuthenticated) {
      return [
        ...commonPages,
        { 
          name: 'Profile', 
          path: '/profile', 
          description: 'Manage your profile' 
        },
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          description: 'Your personal dashboard' 
        },
        { 
          name: 'Settings', 
          path: '/settings', 
          description: 'Account preferences' 
        },
        { 
          name: 'Logout', 
          path: '/logout', 
          description: 'Sign out securely' 
        },
      ];
    } else {
      return [
        ...commonPages,
        { 
          name: 'Login', 
          path: '/login', 
          description: 'Sign in to your account' 
        },
        { 
          name: 'Register', 
          path: '/register', 
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
      id: 'theme',
      icon: isDarkMode ? 'light_mode' : 'dark_mode',
      label: isDarkMode ? 'Light' : 'Dark',
      path: null,
      onClick: toggleMode
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
              <h5 className="mb-0 fw-bold text-dark">Navigation</h5>
              <FlatButton 
                variant="outline-secondary"
                size="sm"
                onClick={toggleMenuModal}
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
              >
                ×
              </FlatButton>
            </div>

            {/* Navigation Links */}
            <div className="pb-4">
              {getNavigationPages().map((page, index) => (
                <Link
                  key={page.path}
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
                    <div className="flex-grow-1">
                      <div 
                        className="fw-semibold mb-1"
                        style={{ 
                          color: getHighlightClass(page.path) ? '#1e40af' : '#374151',
                          fontSize: '16px',
                          lineHeight: '1.2'
                        }}
                      >
                        {page.name}
                      </div>
                      <div 
                        className="text-muted"
                        style={{ 
                          fontSize: '13px',
                          lineHeight: '1.3'
                        }}
                      >
                        {page.description}
                      </div>
                    </div>
                    <div 
                      className="ms-3"
                      style={{
                        color: getHighlightClass(page.path) ? '#3b82f6' : '#9ca3af',
                        fontSize: '18px',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer Info */}
            {isAuthenticated && (
              <div 
                className="p-4 text-center border-top mt-auto"
                style={{ background: '#f8fafc' }}
              >
                <small className="text-muted">
                  Welcome back, {username || 'User'}!
                </small>
              </div>
            )}
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
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '8px 0 20px 0',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="container-fluid px-4">
          <div className="row g-0">
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
                <div key={item.id} className="col-3">
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
      <style jsx>{`
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