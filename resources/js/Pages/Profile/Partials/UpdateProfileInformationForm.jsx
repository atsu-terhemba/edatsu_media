import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

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
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>person</span>
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                        Profile Information
                    </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 0 42px' }}>
                    View your account's profile information.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#86868b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        disabled
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            background: '#f5f5f7',
                            fontSize: '14px',
                            color: '#000',
                            cursor: 'not-allowed',
                            outline: 'none',
                        }}
                    />
                    {errors.name && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.name}</p>}
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#86868b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        disabled
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            background: '#f5f5f7',
                            fontSize: '14px',
                            color: '#000',
                            cursor: 'not-allowed',
                            outline: 'none',
                        }}
                    />
                    {errors.email && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.email}</p>}
                </div>
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div style={{
                    marginTop: '16px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                }}>
                    <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                        Your email address is unverified.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#000',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                marginLeft: '4px',
                                fontSize: '13px',
                                padding: 0,
                            }}
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>
                    {status === 'verification-link-sent' && (
                        <p style={{ fontSize: '13px', color: '#16a34a', marginTop: '8px', marginBottom: 0 }}>
                            A new verification link has been sent to your email address.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
