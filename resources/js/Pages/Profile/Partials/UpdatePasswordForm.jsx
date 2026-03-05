import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
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
                if (errors.password) { reset('password', 'password_confirmation'); passwordInput.current.focus(); }
                if (errors.current_password) { reset('current_password'); currentPasswordInput.current.focus(); }
            },
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #e5e5e7',
        background: '#fff',
        fontSize: '14px',
        color: '#000',
        outline: 'none',
        transition: 'border-color 0.15s ease',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: 500,
        color: '#86868b',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    return (
        <section className={className}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>lock</span>
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                        Update Password
                    </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 0 42px' }}>
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </div>

            <form onSubmit={updatePassword}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Current Password</label>
                        <input
                            type="password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            autoComplete="current-password"
                            style={inputStyle}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                        />
                        {errors.current_password && (
                            <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.current_password}</p>
                        )}
                    </div>

                    <div>
                        <label style={labelStyle}>New Password</label>
                        <input
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            style={inputStyle}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                        />
                        {errors.password && (
                            <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            style={inputStyle}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                        />
                        {errors.password_confirmation && (
                            <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.password_confirmation}</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 24px',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: 500,
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            opacity: processing ? 0.5 : 1,
                        }}
                    >
                        Save Changes
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: '#16a34a',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                            Password updated.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
