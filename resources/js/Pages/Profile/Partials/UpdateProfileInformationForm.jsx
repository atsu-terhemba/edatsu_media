import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Form } from 'react-bootstrap';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    // const submit = (e) => {
    //     e.preventDefault();
    //     patch(route('profile.update'));
    // };

    return (
        <section className={className}>
            <div className="mb-3">
                <h5 className="mb-1" style={{fontWeight: '600', color: '#1f2937'}}>
                    <i className="bi bi-person me-2"></i>
                    Profile Information
                </h5>
                <p className="text-muted mb-0" style={{fontSize: '0.875rem'}}>
                    View your account's profile information.
                </p>
            </div>

            <Form className="mt-4">
                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: '500', fontSize: '0.875rem'}}>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.name}
                        disabled
                        style={{
                            backgroundColor: '#f3f4f6',
                            cursor: 'not-allowed',
                            border: '1px solid #dee2e6',
                            fontSize: '0.875rem'
                        }}
                    />
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: '500', fontSize: '0.875rem'}}>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={data.email}
                        disabled
                        style={{
                            backgroundColor: '#f3f4f6',
                            cursor: 'not-allowed',
                            border: '1px solid #dee2e6',
                            fontSize: '0.875rem'
                        }}
                    />
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                </Form.Group>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="alert alert-warning" role="alert">
                        <p className="mb-2" style={{fontSize: '0.875rem'}}>
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="btn btn-link p-0 ms-1"
                                style={{fontSize: '0.875rem'}}
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="text-success" style={{fontSize: '0.875rem'}}>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {/* <div className="d-flex align-items-center gap-3">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-muted mb-0" style={{fontSize: '0.875rem'}}>
                            Saved.
                        </p>
                    </Transition>
                </div> */}
            </Form>
        </section>
    );
}
