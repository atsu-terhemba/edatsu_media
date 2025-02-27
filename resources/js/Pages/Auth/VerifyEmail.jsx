import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <Container>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={4}>
            <div className='my-3'>
            <div className="fs-9">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="fs-9 poppins-semibold text-success">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <button
                    className="px-3 btn btn-dark poppins-semibold d-block fs-9 py-2"
                    disabled={processing}>
                        Resend Email
                    </button>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="px-3 btn btn-danger poppins-semibold d-block fs-9 py-2"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
            </div>
                    </Col>
                    <Col sm={4}>
                    </Col>
                </Row>
            </Container>
        </GuestLayout>
    );
}
