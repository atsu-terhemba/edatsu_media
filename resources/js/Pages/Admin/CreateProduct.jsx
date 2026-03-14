import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Select from 'react-select';
import axios from 'axios';
import { swalConfig } from '@/utils/Index';
import { Toast } from '@/utils/Index';
import QuillEditor from '@/Components/QuillEditorComponent';
import ImageCropCompress from '@/Components/ImageCropCompress';

const selectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '12px',
        border: state.isFocused ? '1px solid #000' : '1px solid #e5e5e7',
        boxShadow: 'none',
        fontSize: '14px',
        padding: '2px 4px',
        minHeight: '44px',
        '&:hover': { borderColor: '#000' },
    }),
    multiValue: (base) => ({
        ...base,
        borderRadius: '8px',
        background: '#f5f5f7',
    }),
    multiValueLabel: (base) => ({
        ...base,
        fontSize: '13px',
        color: '#000',
        padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
        ...base,
        borderRadius: '0 8px 8px 0',
        color: '#86868b',
        '&:hover': { background: '#e5e5e7', color: '#000' },
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '14px',
        background: state.isSelected ? '#000' : state.isFocused ? '#f5f5f7' : '#fff',
        color: state.isSelected ? '#fff' : '#000',
        '&:active': { background: '#e5e5e7' },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: '14px',
        color: '#b0b0b5',
    }),
};

const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e5e5e7',
    fontSize: '14px',
    background: '#fff',
    color: '#000',
    outline: 'none',
    transition: 'border-color 0.15s ease',
};

const hintStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#b0b0b5',
    marginTop: '4px',
};

export default function CreateProduct({ edits, categories, brand_label, tags, selectedData }) {
    const [section, setSection] = useState('details');
    const [categoryOption, setCategoryOptions] = useState([]);
    const [tagOption, setTagOptions] = useState([]);
    const [brandLabelOption, setBrandLabelOptions] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);

    const [formData, setFormData] = useState({
        cover_img: null,
        title: edits?.product_name || '',
        description: edits?.product_description || '',
        source_url: edits?.source_url || '',
        direct_link: edits?.direct_link || '',
        youtube_link: edits?.youtube_link || '',
        meta_keywords: edits?.meta_keywords || '',
        meta_description: edits?.meta_description || '',
        post_id: edits?.id || '',
        categories: [],
        brand_labels: [],
        tags: [],
        signature: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(edits?.cover_img || null);

    useEffect(() => {
        setStateFromData(categories, setCategoryOptions);
        setStateFromData(brand_label, setBrandLabelOptions);
        setStateFromData(tags, setTagOptions);
        setEditFromData(selectedData?.category, 'categories');
        setEditFromData(selectedData?.brand_labels, 'brand_labels');
        setEditFromData(selectedData?.tags, 'tags');
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let processedValue = value;
        if (name === 'youtube_link' && value) {
            processedValue = convertToYouTubeEmbed(value);
        }
        setFormData({ ...formData, [name]: files ? files[0] : processedValue });
    };

    const convertToYouTubeEmbed = (url) => {
        if (!url) return url;
        if (url.includes('youtube.com/embed/')) return url;
        if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        return url;
    };

    function setStateFromData(data, setOptions) {
        if (data) {
            const options = data.map((item) => ({ value: item.id, label: item.name }));
            setOptions(options);
        }
    }

    function setEditFromData(data, fieldName) {
        if (data) {
            const options = data.map((item) => ({ value: item.id, label: item.name }));
            setFormData((prevData) => ({ ...prevData, [fieldName]: options }));
        }
    }

    function updateSelection(selectedOption, fieldName) {
        if (selectedOption) {
            setFormData({ ...formData, [fieldName]: selectedOption });
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
            setFormData({ ...formData, cover_img: null });
            return;
        }
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            Toast.fire({ icon: 'warning', title: 'File size exceeds 50MB limit', swalConfig });
            e.target.value = '';
            return;
        }
        if (!allowedFileTypes.includes(file.type)) {
            Toast.fire({ icon: 'warning', title: 'Invalid file type', swalConfig });
            e.target.value = '';
            return;
        }
        setShowImageModal(true);
        e.target.value = '';
    };

    const handleImageProcessed = (processedFile) => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const previewUrl = URL.createObjectURL(processedFile);
        setImagePreview(previewUrl);
        setFormData({ ...formData, cover_img: processedFile });
        Toast.fire({ icon: 'success', title: 'Image processed successfully', swalConfig });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEditing = edits?.id;
        const url = isEditing ? `/admin-update-product/${edits.id}` : '/admin-store-product';
        try {
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                Toast.fire({ icon: 'success', title: response.data.message, swalConfig });
            } else {
                Toast.fire({ icon: 'warning', title: response.data.message, swalConfig });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            Toast.fire({ icon: 'error', title: errorMessage, swalConfig });
        }
    };

    const isEditing = !!edits?.id;

    return (
        <>
            <Head title={isEditing ? "Edit Product" : "Create Product"} />
            <AuthenticatedLayout>
                <Container fluid={true}>
                    <Container>
                        <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                            <Col md={3} className="d-none d-md-block">
                                <AdminSideNav />
                            </Col>
                            <Col md={9} xs={12}>
                                {/* Header */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h2 style={{
                                        fontSize: 'clamp(24px, 4vw, 28px)',
                                        fontWeight: 600,
                                        color: '#000',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '6px',
                                    }}>
                                        {isEditing ? 'Edit Product' : 'Create Product'}
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                        {isEditing ? 'Update your product details below' : 'Add a new product to the toolshed'}
                                    </p>
                                </div>

                                {/* Edit Mode Alert */}
                                {isEditing && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        background: '#fffbeb',
                                        border: '1px solid #fde68a',
                                        borderRadius: '12px',
                                        padding: '14px 20px',
                                        marginBottom: '24px',
                                        flexWrap: 'wrap',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#d97706' }}>edit_note</span>
                                            <span style={{ fontSize: '13px', color: '#92400e' }}>You're currently in edit mode</span>
                                        </div>
                                        <a
                                            href={route('admin.products')}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: '9999px',
                                                background: '#000',
                                                color: '#fff',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                textDecoration: 'none',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                        >
                                            Create new post
                                        </a>
                                    </div>
                                )}

                                {/* Section Tabs */}
                                <div style={{
                                    display: 'flex',
                                    gap: '6px',
                                    marginBottom: '24px',
                                    background: '#f5f5f7',
                                    borderRadius: '12px',
                                    padding: '4px',
                                    width: 'fit-content',
                                }}>
                                    {[
                                        { key: 'details', label: 'Product Details', icon: 'inventory_2' },
                                        { key: 'seo', label: 'SEO', icon: 'search' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setSection(tab.key)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 18px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: section === tab.key ? '#000' : 'transparent',
                                                color: section === tab.key ? '#fff' : '#6e6e73',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <Row className="g-4">
                                    {/* Main Form Column */}
                                    <Col lg={7}>
                                        <form id="mainForm" onSubmit={handleSubmit} encType="multipart/form-data">
                                            {/* Details Section */}
                                            {section === 'details' && (
                                                <div style={{
                                                    background: '#fff',
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: '16px',
                                                    padding: '28px',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                                        <span style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: '#f5f5f7',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>inventory_2</span>
                                                        </span>
                                                        <div>
                                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Product Details</h3>
                                                            <span style={{ fontSize: '12px', color: '#86868b' }}>Fill in the product information</span>
                                                        </div>
                                                    </div>

                                                    {/* Cover Image */}
                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Cover Image</label>
                                                        {(imagePreview || existingImage) && (
                                                            <div style={{ marginBottom: '12px' }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    marginBottom: '8px',
                                                                }}>
                                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>
                                                                        {imagePreview ? 'New image preview' : 'Current image'}
                                                                    </span>
                                                                    {imagePreview && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (imagePreview) URL.revokeObjectURL(imagePreview);
                                                                                setImagePreview(null);
                                                                                setFormData({ ...formData, cover_img: null });
                                                                            }}
                                                                            style={{
                                                                                padding: '4px 12px',
                                                                                borderRadius: '9999px',
                                                                                border: 'none',
                                                                                background: '#dc2626',
                                                                                color: '#fff',
                                                                                fontSize: '12px',
                                                                                fontWeight: 500,
                                                                                cursor: 'pointer',
                                                                                transition: 'background 0.15s ease',
                                                                            }}
                                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div style={{
                                                                    borderRadius: '12px',
                                                                    overflow: 'hidden',
                                                                    border: '1px solid #f0f0f0',
                                                                    display: 'inline-block',
                                                                    maxWidth: '200px',
                                                                }}>
                                                                    <img
                                                                        src={imagePreview || `${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${existingImage}`}
                                                                        alt="Preview"
                                                                        style={{ maxHeight: '150px', maxWidth: '100%', display: 'block' }}
                                                                        onError={(e) => { e.target.src = '/img/logo/main_2.png'; }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            name="cover_img"
                                                            onChange={handleFileUpload}
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            style={{
                                                                ...inputStyle,
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                            }}
                                                        />
                                                        <span style={hintStyle}>Accepted: PNG, JPEG, JPG. Max: 50MB</span>
                                                    </div>

                                                    {/* Title */}
                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Title</label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            placeholder="Enter product title"
                                                            value={formData.title}
                                                            onChange={handleChange}
                                                            style={inputStyle}
                                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                                        />
                                                    </div>

                                                    {/* Description */}
                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Description</label>
                                                        <span style={{ ...hintStyle, marginTop: 0, marginBottom: '8px' }}>
                                                            Provide detailed description for this product
                                                        </span>
                                                        <QuillEditor
                                                            formData={formData}
                                                            setFormData={setFormData}
                                                            name="description"
                                                        />
                                                    </div>

                                                    {/* Direct Link */}
                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Direct Link</label>
                                                        <span style={{ ...hintStyle, marginTop: 0, marginBottom: '8px' }}>
                                                            Provide a direct link to the product (optional)
                                                        </span>
                                                        <input
                                                            type="text"
                                                            name="direct_link"
                                                            placeholder="https://example.com/product"
                                                            value={formData.direct_link}
                                                            onChange={handleChange}
                                                            style={inputStyle}
                                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                                        />
                                                    </div>

                                                    {/* YouTube Link */}
                                                    <div>
                                                        <label style={labelStyle}>YouTube Embed Link</label>
                                                        <span style={{ ...hintStyle, marginTop: 0, marginBottom: '8px' }}>
                                                            Regular YouTube URLs will be automatically converted
                                                        </span>
                                                        <input
                                                            type="url"
                                                            name="youtube_link"
                                                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                                            value={formData.youtube_link}
                                                            onChange={handleChange}
                                                            style={inputStyle}
                                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                                        />
                                                        {formData.youtube_link && (
                                                            <span style={hintStyle}>
                                                                The video will be embedded as an iframe on the product page
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SEO Section */}
                                            {section === 'seo' && (
                                                <div style={{
                                                    background: '#fff',
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: '16px',
                                                    padding: '28px',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                                        <span style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: '#f5f5f7',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>search</span>
                                                        </span>
                                                        <div>
                                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>SEO Optimization</h3>
                                                            <span style={{ fontSize: '12px', color: '#86868b' }}>Meta data for search engine visibility</span>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Focus Keyphrase</label>
                                                        <input
                                                            type="text"
                                                            name="meta_keywords"
                                                            placeholder="Enter focus keyphrase"
                                                            value={formData.meta_keywords}
                                                            onChange={handleChange}
                                                            style={inputStyle}
                                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                                        />
                                                    </div>

                                                    <div style={{ marginBottom: '24px' }}>
                                                        <label style={labelStyle}>Meta Description</label>
                                                        <textarea
                                                            name="meta_description"
                                                            rows={3}
                                                            placeholder="Enter meta description for search engines"
                                                            value={formData.meta_description}
                                                            onChange={handleChange}
                                                            style={{
                                                                ...inputStyle,
                                                                resize: 'vertical',
                                                                minHeight: '80px',
                                                            }}
                                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                                        />
                                                    </div>

                                                    <input type="hidden" name="post_id" value={formData.post_id} />
                                                    <input type="hidden" name="signature" value={formData.signature} />
                                                </div>
                                            )}

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '14px 32px',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: '#000',
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    marginTop: '20px',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                            >
                                                {isEditing ? 'Update Product' : 'Create Product'}
                                            </button>
                                        </form>
                                    </Col>

                                    {/* Sidebar - Taxonomies */}
                                    <Col lg={5}>
                                        <div style={{
                                            background: '#fff',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '16px',
                                            padding: '28px',
                                            position: 'sticky',
                                            top: '112px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                                <span style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '10px',
                                                    background: '#f5f5f7',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>category</span>
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Taxonomies</h3>
                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>Organize your product</span>
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={labelStyle}>Product Categories</label>
                                                <Select
                                                    isMulti
                                                    value={formData?.categories}
                                                    name="categories"
                                                    options={categoryOption}
                                                    styles={selectStyles}
                                                    placeholder="Select categories..."
                                                    onChange={(e) => updateSelection(e, 'categories')}
                                                />
                                            </div>

                                            {/* Tags */}
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={labelStyle}>Tags</label>
                                                <Select
                                                    isMulti
                                                    value={formData?.tags}
                                                    name="tags"
                                                    options={tagOption}
                                                    styles={selectStyles}
                                                    placeholder="Select tags..."
                                                    onChange={(e) => updateSelection(e, 'tags')}
                                                />
                                            </div>

                                            {/* Brand Labels */}
                                            <div>
                                                <label style={labelStyle}>Brand Labels</label>
                                                <Select
                                                    isMulti
                                                    value={formData?.brand_labels}
                                                    name="brand_labels"
                                                    options={brandLabelOption}
                                                    styles={selectStyles}
                                                    placeholder="Select brand labels..."
                                                    onChange={(e) => updateSelection(e, 'brand_labels')}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Container>

                <ImageCropCompress
                    show={showImageModal}
                    onHide={() => setShowImageModal(false)}
                    onImageProcessed={handleImageProcessed}
                    aspectRatio={1}
                />
            </AuthenticatedLayout>
        </>
    );
}
