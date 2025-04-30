import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';
import SocialFooter from './SocialFooter';
import SubFooter from './SubFooter';
import { createContext, useEffect } from 'react';


export default function GuestLayout({ children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="">
            <Header auth={user}/>
                <AuthContext.Provider value={user}>
                {children}
                </AuthContext.Provider>
            <SubFooter/>
            <SocialFooter/>
            <Footer/>
        </div>
    );
}

export const AuthContext = createContext(null);