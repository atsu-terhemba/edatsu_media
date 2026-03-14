import { useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function UpdateProfilePhotoForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef();
    const [photoPreview, setPhotoPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const selectNewPhoto = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Please select an image file.', showConfirmButton: false, timer: 4000 });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Image must be less than 2MB.', showConfirmButton: false, timer: 4000 });
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const uploadPhoto = () => {
        if (!selectedFile) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('photo', selectedFile);

        axios.post('/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(() => {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Profile photo updated successfully!', showConfirmButton: false, timer: 4000, timerProgressBar: true });
            setPhotoPreview(null);
            setSelectedFile(null);
            fileInputRef.current.value = '';
            router.reload({ only: ['auth'] });
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.errors?.photo?.[0] || error.response?.data?.message || 'Failed to update photo. Please try again.';
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: errorMessage, showConfirmButton: false, timer: 4000 });
        })
        .finally(() => setUploading(false));
    };

    const cancelPreview = () => {
        setPhotoPreview(null);
        setSelectedFile(null);
        fileInputRef.current.value = '';
    };

    const deleteProfilePhoto = () => {
        Swal.fire({
            title: 'Remove profile photo?',
            text: "Are you sure you want to remove your profile photo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#86868b',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setDeleting(true);
                axios.delete('/profile/photo')
                .then(() => {
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Profile photo removed successfully!', showConfirmButton: false, timer: 4000, timerProgressBar: true });
                    router.reload({ only: ['auth'] });
                })
                .catch(() => {
                    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Failed to remove photo. Please try again.', showConfirmButton: false, timer: 4000 });
                })
                .finally(() => setDeleting(false));
            }
        });
    };

    const getInitial = () => {
        if (!user?.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    const getBackgroundColor = () => {
        if (!user?.name) return '#86868b';
        const colors = ['#000', '#374151', '#1e3a5f', '#3f3f46', '#44403c', '#1e293b', '#27272a', '#292524'];
        return colors[user.name.charCodeAt(0) % colors.length];
    };

    return (
        <section className={className}>
            <div className="text-center">
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    {/* Photo / Preview / Initials */}
                    {photoPreview ? (
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '2px solid #f97316',
                            overflow: 'hidden',
                        }}>
                            <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : user.profile_photo_path ? (
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '2px solid #f0f0f0',
                            overflow: 'hidden',
                        }}>
                            <img
                                src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/${user.profile_photo_path.startsWith('profile-photos/') ? user.profile_photo_path : `profile-photos/${user.profile_photo_path}`}`}
                                alt={user.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '2px solid #f0f0f0',
                            backgroundColor: getBackgroundColor(),
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'uppercase',
                        }}>
                            {getInitial()}
                        </div>
                    )}

                    {/* Camera button */}
                    {!photoPreview && (
                        <button
                            onClick={selectNewPhoto}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#000',
                                border: '3px solid #fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>photo_camera</span>
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Save / Cancel preview buttons */}
                {photoPreview && (
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <button
                            onClick={uploadPhoto}
                            disabled={uploading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 20px',
                                borderRadius: '9999px',
                                fontSize: '13px',
                                fontWeight: 500,
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                opacity: uploading ? 0.5 : 1,
                            }}
                        >
                            {uploading ? (
                                <><span className="spinner-border spinner-border-sm" /> Saving...</>
                            ) : (
                                <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> Save Photo</>
                            )}
                        </button>
                        <button
                            onClick={cancelPreview}
                            disabled={uploading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 20px',
                                borderRadius: '9999px',
                                fontSize: '13px',
                                fontWeight: 500,
                                background: 'transparent',
                                color: '#86868b',
                                border: '1px solid #e5e5e7',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* User info */}
                <div style={{ marginTop: '4px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 2px' }}>
                        {user.name}
                    </p>
                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                        {user.email}
                    </p>
                </div>

                {/* Remove photo */}
                {user.profile_photo_path && !photoPreview && (
                    <button
                        onClick={deleteProfilePhoto}
                        disabled={deleting}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '14px',
                            padding: '8px 18px',
                            borderRadius: '9999px',
                            fontSize: '13px',
                            fontWeight: 500,
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            cursor: deleting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            opacity: deleting ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.background = '#b91c1c'; }}
                        onMouseLeave={(e) => { if (!deleting) e.currentTarget.style.background = '#dc2626'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                        Remove Photo
                    </button>
                )}
            </div>
        </section>
    );
}
