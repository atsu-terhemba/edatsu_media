import React from 'react';
import { Button } from 'react-bootstrap';
import { Head, Link, useForm } from '@inertiajs/react';
import { Images } from '@/utils/Images';

const SocialLogin = ({ className='' }) => {
  return (
    <div className={`social-login ${className}`}>
      <p className="text-center mb-3 fs-9">
        Continue with Social Login
      </p>
      
      <div className="d-grid gap-2">
        {[{
          name: 'Google',
          icon: Images.google_logo,
          backgroundColor: '#fff',
          textColor: '#757575',
          id: 'my-signin2',
          url: '/auth/redirect/google'
        }, {
          name: 'Linkedin',
          icon: Images.linkedin_logo,
          backgroundColor: '#fff',
          textColor: '#737373',
          id: 'linkedin-signin',
          url: '/auth/redirect/linkedin-openid'
        }].map((provider) => (
          <a
            href={provider.url}
            key={provider.name}
            className="d-flex align-items-center py-2 btn"
            id={provider.id || `${provider.name.toLowerCase()}-login`}
            style={{
              backgroundColor: provider.backgroundColor || 'white',
              color: provider.textColor || 'black',
              borderColor: '#ced4da'
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
