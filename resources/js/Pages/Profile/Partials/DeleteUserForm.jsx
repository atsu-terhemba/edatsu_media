import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Form, Button, Modal as BootstrapModal } from 'react-bootstrap';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <div className="mb-3">
                <h5 className="mb-1" style={{fontWeight: '600', color: '#1f2937'}}>
                    <i className="bi bi-trash me-2"></i>
                    Delete Account
                </h5>
                <p className="text-muted mb-0" style={{fontSize: '0.875rem'}}>
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                </p>
            </div>

            <Button
                variant="danger"
                onClick={confirmUserDeletion}
                className="mt-3"
                style={{
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1.5rem'
                }}
            >
                <i className="bi bi-trash me-2"></i>
                Delete Account
            </Button>

            <BootstrapModal 
                show={confirmingUserDeletion} 
                onHide={closeModal}
                centered
            >
                <BootstrapModal.Header closeButton style={{borderBottom: '1px solid #dee2e6'}}>
                    <BootstrapModal.Title style={{fontSize: '1.125rem', fontWeight: '600'}}>
                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                        Delete Account
                    </BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                    <Form onSubmit={deleteUser}>
                        <p className="text-muted mb-3" style={{fontSize: '0.875rem'}}>
                            Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm.
                        </p>

                        <Form.Group className="mb-3">
                            <Form.Label className="visually-hidden">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
                                style={{fontSize: '0.875rem', border: '1px solid #dee2e6'}}
                            />
                            {errors.password && (
                                <Form.Text className="text-danger" style={{fontSize: '0.875rem'}}>
                                    {errors.password}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="outline-secondary"
                                onClick={closeModal}
                                style={{
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    padding: '0.5rem 1.5rem'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="danger"
                                type="submit"
                                disabled={processing}
                                style={{
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    padding: '0.5rem 1.5rem'
                                }}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </Form>
                </BootstrapModal.Body>
            </BootstrapModal>
        </section>
    );
}
