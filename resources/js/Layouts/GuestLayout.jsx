import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';
import SocialFooter from './SocialFooter';
import SubFooter from './SubFooter';

export default function GuestLayout({ children }) {
     const user = usePage().props.auth.user;
    return (
        <div className="">
            <Header auth={user}/>
            {children}
            <SubFooter/>
            <SocialFooter/>
            <Footer/>
        </div>
    );
}
