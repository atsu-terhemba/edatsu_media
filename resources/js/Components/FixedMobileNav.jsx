import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const FixedMobileNav = ({
  isAuthenticated = false,
  currentPath = '/',
  username = ''
}) => {
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const getHighlightClass = (path, activeClass, inactiveClass) => {
    return currentPath === path ? activeClass : inactiveClass;
  };

  return (
    <div className="fixed-footer-bar rounded text-center d-sm-none d-md-none d-lg-none shadow-sm">
      <div className="container-fluid">
        <div className="row d-flex align-items-center">
          <div className="col-4">
            <Link
              href="/"
              className={`w-full px-0 block text-center no-underline ${getHighlightClass(
                '/',
                'text-orange-500 font-semibold',
                'text-gray-400 dark:text-gray-300'
              )}`}
            >
                <span class="material-symbols-outlined align-middle mb-1 d-block text-light">
                    full_coverage
                </span>
              <span className="block text-xs uppercase font-semibold mx-auto text-light fw-bold">Home</span>
            </Link>
          </div>

          <div className="col-4">
            <button
              className="btn bg-transparent  w-full px-0 block text-center no-underline text-gray-400 dark:text-gray-300"
              onClick={toggleMode}
              id="darkModeToggle"
            >
              <span class="material-symbols-outlined align-middle text-light mb-1 d-block">
                dark_mode
              </span>
              <span className="block text-xs uppercase font-semibold mx-auto text-light fw-bold">Mode</span>
            </button>
          </div>
          
          <div className="col-4">
            <div className="relative">
              {isAuthenticated && (
                <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 right-1/4"></div>
              )}
              {!isAuthenticated && (
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-1/4"></div>
              )}
              <a
                href="/login"
                className={`w-full px-0 block text-center no-underline ${getHighlightClass(
                  '/subscribe',
                  'text-orange-500 font-semibold',
                  'text-gray-400 dark:text-gray-300'
                )}`}
              >
                <span class="material-symbols-outlined align-middle mb-1 d-block text-light">
                  person
                </span>
                <span className="block text-xs uppercase font-semibold mx-auto text-light fw-bold">
                  {isAuthenticated ? "🟢 Online" : "🔴 Login"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedMobileNav;