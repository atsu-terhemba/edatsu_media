import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="mb-3">
                <h5 className="mb-1" style={{fontWeight: '600', color: '#1f2937'}}>
                    <i className="bi bi-lock me-2"></i>
                    Update Password
                </h5>
                <p className="text-muted mb-0" style={{fontSize: '0.875rem'}}>
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </div>

            <Form onSubmit={updatePassword} className="mt-4">
                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: '500', fontSize: '0.875rem'}}>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        style={{fontSize: '0.875rem', border: '1px solid #dee2e6'}}
                    />
                    {errors.current_password && (
                        <Form.Text className="text-danger" style={{fontSize: '0.875rem'}}>
                            {errors.current_password}
                        </Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: '500', fontSize: '0.875rem'}}>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        style={{fontSize: '0.875rem', border: '1px solid #dee2e6'}}
                    />
                    {errors.password && (
                        <Form.Text className="text-danger" style={{fontSize: '0.875rem'}}>
                            {errors.password}
                        </Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: '500', fontSize: '0.875rem'}}>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        style={{fontSize: '0.875rem', border: '1px solid #dee2e6'}}
                    />
                    {errors.password_confirmation && (
                        <Form.Text className="text-danger" style={{fontSize: '0.875rem'}}>
                            {errors.password_confirmation}
                        </Form.Text>
                    )}
                </Form.Group>

                <div className="d-flex align-items-center gap-3 mt-4">
                    <Button 
                        type="submit" 
                        disabled={processing}
                        style={{
                            backgroundColor: '#0d6efd',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            padding: '0.5rem 1.5rem'
                        }}
                    >
                        Save Changes
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-success mb-0" style={{fontSize: '0.875rem'}}>
                            <i className="bi bi-check-circle me-1"></i>
                            Password updated successfully.
                        </p>
                    </Transition>
                </div>
            </Form>
        </section>
    );
}
