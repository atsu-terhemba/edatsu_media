import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import Header from './Header';
import FixedAuthNav from '@/Components/FixedAuthNav';


export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    return (
        <Fragment>
        <Header auth={user}/>
        {children}
        <FixedAuthNav />
        </Fragment>
    );
}
