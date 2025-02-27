import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Container fluid={true}>
    <Container>
        <Row>
        <Col sm={4}>
        {/**left side nav */}
        </Col>
        <Col sm={4}>
        <h3 className='poppins-semibold mt-3'>Forgot Password?</h3>
        <div className="fs-9 mt-2">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will
            allow you to choose a new one.
        </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className='my-3'>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full form-control shadow-none"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <button  className="px-3 btn btn-dark poppins-semibold d-block fs-9 py-2" disabled={processing}>
                        Email Reset Link
                    </button>
                </div>
            </form>
        </Col>
        <Col sm={4}>
        {/**right side nav */}
        </Col>
        </Row>
       </Container>
       </Container>
    </GuestLayout>
    );
}






