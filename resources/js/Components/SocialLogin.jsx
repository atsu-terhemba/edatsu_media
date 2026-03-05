import React from 'react';
import { Images } from '@/utils/Images';

const SocialLogin = ({ className = '' }) => {
    const providers = [
        {
            name: 'Google',
            icon: Images.google_logo,
            id: 'my-signin2',
            url: '/auth/redirect/google',
        },
        {
            name: 'LinkedIn',
            icon: Images.linkedin_logo,
            id: 'linkedin-signin',
            url: '/auth/redirect/linkedin-openid',
        },
    ];

    return (
        <div className={`social-login ${className}`}>
            <div className="d-flex flex-column gap-2">
                {providers.map((provider) => (
                    <a
                        href={provider.url}
                        key={provider.name}
                        id={provider.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '12px 32px',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#000',
                            background: '#fff',
                            border: '1px solid #e5e5e7',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#000';
                            e.currentTarget.style.background = '#000';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e5e7';
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '#000';
                        }}
                    >
                        <img
                            src={provider.icon}
                            alt={`${provider.name} logo`}
                            style={{ width: '18px', height: '18px' }}
                        />
                        Continue with {provider.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SocialLogin;
