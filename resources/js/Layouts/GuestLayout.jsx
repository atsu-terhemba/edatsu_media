import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';
import SocialFooter from './SocialFooter';
import SubFooter from './SubFooter';
import PWAInstallPrompt from '@/Components/PWAInstallPrompt';
import { createContext, useEffect, useState } from 'react';


// Create the context at the top level
export const AuthContext = createContext(null);

export default function GuestLayout({ children }) {
    const user = usePage().props.auth.user || {};
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize dark mode on component mount
    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode');
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Use saved preference or system preference
        const shouldUseDarkMode = darkModePreference === 'true' || 
                                 (darkModePreference === null && systemDarkMode);
        
        setIsDarkMode(shouldUseDarkMode);
        
        if (shouldUseDarkMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e) => {
            if (localStorage.getItem('darkMode') === null) {
                setIsDarkMode(e.matches);
                if (e.matches) {
                    document.documentElement.classList.add('dark-mode');
                    document.body.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                    document.body.classList.remove('dark-mode');
                }
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    // Global dark mode toggle function
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
        
        if (newMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
    };

    return (
        <div className="">
            <Header auth={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <AuthContext.Provider value={{
                    user,
                    isDarkMode,
                    toggleDarkMode
                }}>
                {children}
                </AuthContext.Provider>
            <SubFooter isDarkMode={isDarkMode} />
            <SocialFooter isDarkMode={isDarkMode} />
            <Footer isDarkMode={isDarkMode} />
            <PWAInstallPrompt />
        </div>
    );
}
