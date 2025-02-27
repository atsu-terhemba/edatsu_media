
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import Metadata from '@/Components/Metadata';
import RegisterForm from './RegisterForm';

export default function Register({role}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: role,
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <Fragment>
           <Metadata
            title="Sign Up - Edatsu Media"
            description="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            keywords="sign up, create account, business opportunities, funding resources, finance tools, entrepreneur support, grants and investments, Edatsu Media"
            canonicalUrl="https://www.edatsu.com/signup"
            ogTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            ogDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            ogImage="/img/logo/default_logo.jpg"
            ogUrl="https://www.edatsu.com/signup"
            twitterTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            twitterDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            twitterImage="/img/logo/default_logo.jpg"
            />

        <GuestLayout>

        </GuestLayout>
        </Fragment>
    );
}
