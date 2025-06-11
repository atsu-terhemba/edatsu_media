import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const FixedMobileNav = ({
  isAuthenticated = false,
  currentPath = '/',
  username = '', 
  toggleSearch
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
    <div className="fixed-footer-bar text-center d-sm-none d-md-none d-lg-none shadow-sm">
      <div className="container-fluid">
        <div className="row d-flex align-items-center">
          <div className="col-3">
            <Link
              href="/"
              className={`w-full btn py-3 px-0 rounded-0 w-100 block text-center no-underline ${getHighlightClass(
                '/',
                'text-orange-500 font-semibold',
                'text-gray-400 dark:text-gray-300'
              )}`}
            >
              <span class="material-symbols-outlined align-middle mb-1 d-block text-light">
                  full_coverage
              </span>
            </Link>
              {/* <button
                  className="btn bg-transparent py-3 rounded-0 w-100 px-0 block text-center no-underline text-gray-400 dark:text-gray-300"
                  onClick={toggleMode}
                  id="darkModeToggle"
                >
                <span class="material-symbols-outlined align-middle text-light mb-1 d-block">
                apps
                </span>
              </button> */}
          </div>

          <div className="col-3">
              <button
                className="btn bg-transparent py-3 w-full rounded-0 w-100  px-0 block text-center no-underline text-gray-400 dark:text-gray-300"
                onClick={toggleMode}
                id="darkModeToggle"
              >
              <span class="material-symbols-outlined align-middle text-light mb-1 d-block">
                dark_mode
              </span>
            </button>
          </div>

          <div className="col-3">
            <button
              className="btn bg-transparent  rounded-0 w-100  py-3 w-full px-0 block text-center no-underline text-gray-400 dark:text-gray-300"
              onClick={toggleSearch}
              id="darkModeToggle"
              >
              <span class="material-symbols-outlined align-middle text-light mb-1 d-block">
              search
              </span>
            </button>
          </div>
          
          <div className="col-3">
            <div className="relative">
              {isAuthenticated && (
                <div className="login-access-status"></div>
              )}
              {!isAuthenticated && (
                <div className="logout-access-status"></div>
              )}
              <a
                href="/login"
                className={`btn w-full px-0 block  rounded-0 w-100  text-center py-3 no-underline ${getHighlightClass(
                  '/subscribe',
                  'text-orange-500 font-semibold',
                  'text-gray-400 dark:text-gray-300'
                )}`}
              >
                <span class="material-symbols-outlined align-middle mb-1 d-block text-light">
                  person
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