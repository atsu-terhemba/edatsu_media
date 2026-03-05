import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

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
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#dc2626' }}>warning</span>
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                        Delete Account
                    </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 0 42px', lineHeight: 1.5 }}>
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                </p>
            </div>

            <button
                onClick={confirmUserDeletion}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 500,
                    background: 'transparent',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                Delete Account
            </button>

            <BootstrapModal
                show={confirmingUserDeletion}
                onHide={closeModal}
                centered
            >
                <div style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#fef2f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#dc2626' }}>warning</span>
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>
                            Delete Account
                        </h3>
                    </div>

                    <form onSubmit={deleteUser}>
                        <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.6, marginBottom: '20px' }}>
                            Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm.
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e5e7',
                                    background: '#fff',
                                    fontSize: '14px',
                                    color: '#000',
                                    outline: 'none',
                                    transition: 'border-color 0.15s ease',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                            />
                            {errors.password && (
                                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.password}</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={closeModal}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    background: 'transparent',
                                    color: '#000',
                                    border: '1px solid #e5e5e7',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    background: '#dc2626',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    opacity: processing ? 0.5 : 1,
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </BootstrapModal>
        </section>
    );
}
