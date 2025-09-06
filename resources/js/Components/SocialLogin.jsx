import React from 'react';
import { Button } from 'react-bootstrap';
import { Head, Link, useForm } from '@inertiajs/react';
import { Images } from '@/utils/Images';

const SocialLogin = ({ className='' }) => {
  return (
    <div className={`social-login ${className}`}>
      <div className="d-grid gap-2">
        {[{
          name: 'Google',
          icon: Images.google_logo,
          backgroundColor: '#fff',
          textColor: '#757575',
          id: 'my-signin2',
          url: '/auth/redirect/google'
        }, 
        {
          name: 'LinkedIn',
          icon: Images.linkedin_logo,
          backgroundColor: '#fff',
          textColor: '#737373',
          id: 'linkedin-signin',
          url: '/auth/redirect/linkedin-openid'
        }
      ].map((provider) => (
          <a
            href={provider.url}
            key={provider.name}
            className="d-flex align-items-center justify-content-center py-3 btn text-decoration-none"
            id={provider.id || `${provider.name.toLowerCase()}-login`}
            style={{
              backgroundColor: provider.backgroundColor || 'white',
              color: provider.textColor || 'black',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <img 
              src={provider.icon} 
              alt={`${provider.name} logo`} 
              className="me-3"
              style={{ width: '20px', height: '20px' }}
            />
            Continue with {provider.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;
