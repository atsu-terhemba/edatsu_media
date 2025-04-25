import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import Metadata from '@/Components/Metadata';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SocialLogin from '@/Components/SocialLogin';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Fragment>
            <Metadata
            title="Login - Edatsu Media"
            description="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
            keywords="login, sign in, business insights, funding opportunities, finance tools, entrepreneur support, grants and investments, Edatsu Media"
            canonicalUrl="https://www.edatsu.com/login"
            ogTitle="Login to Edatsu Media - Business Insights & Funding Opportunities"
            ogDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
            ogImage="/img/logo/default_logo.jpg"
            ogUrl="https://www.edatsu.com/login"
            twitterTitle="Login to Edatsu Media - Business Insights & Funding Opportunities"
            twitterDescription="Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!"
            twitterImage="/img/logo/default_logo.jpg"
            />

        <GuestLayout>
            <Container fluid={true}>
                <Container>
                    <Row>
                    <Col sm={4}>
                    {/**left side nav */}
                    </Col>
                    <Col sm={4}>
                    {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className='border rounded px-3 py-3 my-3'>
                <div>
                    <h3 className='poppins-semibold'>Login</h3>
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email " className='fs-9' />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" className='fs-9' />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 fs-9">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="fs-9 d-block"
                        >
                            Forgot password?
                        </Link>
                    )}
                    <button className="px-3 btn btn-dark poppins-semibold d-block fs-9 py-2" disabled={processing}>
                    Log in
                    </button >
                </div>
            </form>

            {/* <div className='mb-3'>
            <SocialLogin/>
            </div> */}
            
                    </Col>
                    <Col sm={4}>
                    {/**left side nav */}
                    </Col>
                    </Row>
                </Container>
            </Container>
        </GuestLayout>
         </Fragment>
    );
}
