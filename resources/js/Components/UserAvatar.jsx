import React from 'react';

export default function UserAvatar({ user, size = 40, className = '' }) {
    const getInitial = () => {
        if (!user?.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    const getBackgroundColor = () => {
        if (!user?.name) return '#6c757d';
        
        // Generate a consistent color based on the user's name
        const colors = [
            '#007bff', // Blue
            '#28a745', // Green
            '#17a2b8', // Cyan
            '#ffc107', // Yellow
            '#dc3545', // Red
            '#6f42c1', // Purple
            '#fd7e14', // Orange
            '#20c997', // Teal
        ];
        
        const charCode = user.name.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    const hasProfilePhoto = user?.profile_photo_path;

    const avatarStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hasProfilePhoto ? 'transparent' : getBackgroundColor(),
        color: 'white',
        fontWeight: '600',
        fontSize: `${size * 0.45}px`,
        flexShrink: 0,
        border: '2px solid rgba(255, 255, 255, 0.2)',
        textTransform: 'uppercase',
        overflow: 'hidden',
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    return (
        <div className={className} style={avatarStyle}>
            {hasProfilePhoto ? (
                <img 
                    src={`/storage/${user.profile_photo_path}`} 
                    alt={user.name}
                    style={imageStyle}
                />
            ) : (
                getInitial()
            )}
        </div>
    );
}
