import { useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function UpdateProfilePhotoForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const csrfToken = usePage().props.csrf_token;
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Please select an image file.',
                showConfirmButton: false,
                timer: 4000,
            });
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Image must be less than 2MB.',
                showConfirmButton: false,
                timer: 4000,
            });
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const uploadPhoto = () => {
        if (!selectedFile) return;

        setUploading(true);

        // Use FormData with axios for more reliable file uploads
        const formData = new FormData();
        formData.append('photo', selectedFile);
        formData.append('_token', csrfToken);

        axios.post(route('profile.photo.update'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': csrfToken,
            },
        })
        .then(() => {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Profile photo updated successfully!',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
            // Clear the preview and file
            setPhotoPreview(null);
            setSelectedFile(null);
            fileInputRef.current.value = '';
            // Reload to refresh user data
            router.reload({ only: ['auth'] });
        })
        .catch((error) => {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.errors?.photo?.[0] 
                || error.response?.data?.message 
                || 'Failed to update photo. Please try again.';
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 4000,
            });
        })
        .finally(() => {
            setUploading(false);
        });
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
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setDeleting(true);
                axios.delete(route('profile.photo.delete'), {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                    },
                })
                .then(() => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Profile photo removed successfully!',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                    });
                    // Reload to refresh user data
                    router.reload({ only: ['auth'] });
                })
                .catch((error) => {
                    console.error('Delete error:', error);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Failed to remove photo. Please try again.',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                })
                .finally(() => {
                    setDeleting(false);
                });
            }
        });
    };

    const getInitial = () => {
        if (!user?.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    const getBackgroundColor = () => {
        if (!user?.name) return '#6c757d';
        
        const colors = [
            '#007bff', '#28a745', '#17a2b8', '#ffc107',
            '#dc3545', '#6f42c1', '#fd7e14', '#20c997',
        ];
        
        const charCode = user.name.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    return (
        <section className={className}>
            <div className="text-center">
                <div className="position-relative d-inline-block mb-3">
                    {/* Show preview if selected, otherwise show current photo or initials */}
                    {photoPreview ? (
                        <div 
                            className="rounded-circle position-relative"
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '3px solid #0d6efd',
                                overflow: 'hidden'
                            }}
                        >
                            <img 
                                src={photoPreview} 
                                alt="Preview" 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    ) : user.profile_photo_path ? (
                        <div 
                            className="rounded-circle position-relative"
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                overflow: 'hidden'
                            }}
                        >
                            <img 
                                src={`/storage/${user.profile_photo_path}`} 
                                alt={user.name} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                backgroundColor: getBackgroundColor(),
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '67.5px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {getInitial()}
                        </div>
                    )}
                    
                    {!photoPreview && (
                        <Button
                            onClick={selectNewPhoto}
                            disabled={uploading}
                            className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: '45px',
                                height: '45px',
                                bottom: '5px',
                                right: '5px',
                                border: '3px solid white',
                                backgroundColor: '#0d6efd',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                padding: 0
                            }}
                        >
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '1.2rem' }}>photo_camera</span>
                        </Button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Show Save/Cancel buttons when there's a preview */}
                {photoPreview && (
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={uploadPhoto}
                            disabled={uploading}
                            style={{
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1.5rem'
                            }}
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined me-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>save</span>
                                    Save Photo
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={cancelPreview}
                            disabled={uploading}
                            style={{
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1.5rem'
                            }}
                        >
                            <span className="material-symbols-outlined me-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>close</span>
                            Cancel
                        </Button>
                    </div>
                )}

                <div className="mt-2">
                    <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                        <strong>{user.name}</strong>
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                        {user.email}
                    </p>
                </div>

                {user.profile_photo_path && !photoPreview && (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={deleteProfilePhoto}
                        disabled={deleting}
                        className="mt-3"
                        style={{
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            padding: '0.4rem 1rem'
                        }}
                    >
                        <span className="material-symbols-outlined me-1" style={{ fontSize: '14px', verticalAlign: 'middle' }}>delete</span>
                        Remove Photo
                    </Button>
                )}
            </div>
        </section>
    );
}
