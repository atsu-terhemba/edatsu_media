import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';
import SocialFooter from './SocialFooter';
import SubFooter from './SubFooter';
import PWAInstallPrompt from '@/Components/PWAInstallPrompt';
import { createContext } from 'react';


// Create the context at the top level
export const AuthContext = createContext(null);

export default function GuestLayout({ children }) {
    const user = usePage().props.auth.user || {};

    return (
        <div className="">
            <Header auth={user} />
                <AuthContext.Provider value={{
                    user
                }}>
                {children}
                </AuthContext.Provider>
            <SubFooter />
            <SocialFooter />
            <Footer />
            <PWAInstallPrompt />
        </div>
    );
}
