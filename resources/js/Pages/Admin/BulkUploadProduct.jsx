import { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminSideNav from './Components/SideNav';
import axios from 'axios';

export default function BulkUploadProduct() {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (f) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ];
        if (!validTypes.includes(f.type) && !f.name.match(/\.xlsx?$/i)) {
            setResult({ success: false, message: 'Please upload a valid Excel file (.xlsx or .xls)' });
            return;
        }
        setFile(f);
        setResult(null);
        setPreview(null);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(route('admin.bulk_store_products'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
            if (response.data.success) setFile(null);
        } catch (error) {
            const data = error.response?.data;
            setResult({
                success: false,
                message: data?.message || 'An error occurred during upload.',
                errors: data?.errors || [],
            });
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <>
            <Head title="Bulk Upload Products" />
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
                                        Bulk Upload Products
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                        Upload multiple products at once using an Excel spreadsheet
                                    </p>
                                </div>

                                <Row className="g-4">
                                    {/* Left: Upload Area */}
                                    <Col lg={7}>
                                        {/* Step 1: Download Template */}
                                        <div style={{
                                            background: '#fff',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '16px',
                                            padding: '28px',
                                            marginBottom: '20px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#000',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                }}>
                                                    1
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Download Template</h3>
                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>Get the Excel template with the correct format</span>
                                                </div>
                                            </div>

                                            <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '16px', lineHeight: 1.6 }}>
                                                Download the template, fill in your product data, then upload it below. The template includes an instructions sheet with details about each column.
                                            </p>

                                            <a
                                                href={route('admin.bulk_product_template')}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '10px 24px',
                                                    borderRadius: '9999px',
                                                    border: '1px solid #e5e5e7',
                                                    background: '#fff',
                                                    color: '#000',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                                                Download Template (.xlsx)
                                            </a>
                                        </div>

                                        {/* Step 2: Upload File */}
                                        <div style={{
                                            background: '#fff',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '16px',
                                            padding: '28px',
                                            marginBottom: '20px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#000',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                }}>
                                                    2
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Upload File</h3>
                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>Upload your filled Excel template</span>
                                                </div>
                                            </div>

                                            {/* Drop Zone */}
                                            <div
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{
                                                    border: `2px dashed ${dragActive ? '#000' : '#e5e5e7'}`,
                                                    borderRadius: '16px',
                                                    padding: '48px 24px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    background: dragActive ? '#fafafa' : '#fff',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    onChange={handleFileChange}
                                                    style={{ display: 'none' }}
                                                />
                                                <span className="material-symbols-outlined" style={{
                                                    fontSize: '48px',
                                                    color: dragActive ? '#000' : '#d1d1d6',
                                                    display: 'block',
                                                    marginBottom: '12px',
                                                }}>
                                                    upload_file
                                                </span>
                                                <p style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                                                    {dragActive ? 'Drop your file here' : 'Drag & drop your Excel file here'}
                                                </p>
                                                <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                                    or click to browse — .xlsx, .xls up to 10MB
                                                </p>
                                            </div>

                                            {/* Selected File */}
                                            {file && (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginTop: '16px',
                                                    padding: '14px 18px',
                                                    background: '#f5f5f7',
                                                    borderRadius: '12px',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a', flexShrink: 0 }}>
                                                            description
                                                        </span>
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{
                                                                fontSize: '14px',
                                                                fontWeight: 500,
                                                                color: '#000',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}>
                                                                {file.name}
                                                            </div>
                                                            <span style={{ fontSize: '12px', color: '#86868b' }}>
                                                                {formatFileSize(file.size)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                                        style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '9999px',
                                                            border: 'none',
                                                            background: '#dc2626',
                                                            color: '#fff',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            flexShrink: 0,
                                                            transition: 'background 0.15s ease',
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Step 3: Submit */}
                                        <div style={{
                                            background: '#fff',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '16px',
                                            padding: '28px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#000',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                }}>
                                                    3
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Upload & Create</h3>
                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>Review and submit your products</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleUpload}
                                                disabled={!file || uploading}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    width: '100%',
                                                    padding: '14px 32px',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: !file || uploading ? '#d1d1d6' : '#000',
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    cursor: !file || uploading ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (file && !uploading) e.currentTarget.style.background = '#333';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (file && !uploading) e.currentTarget.style.background = '#000';
                                                }}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <span style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            border: '2px solid rgba(255,255,255,0.3)',
                                                            borderTopColor: '#fff',
                                                            borderRadius: '50%',
                                                            animation: 'spin 0.8s linear infinite',
                                                        }} />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cloud_upload</span>
                                                        Upload & Create Products
                                                    </>
                                                )}
                                            </button>

                                            {/* Result */}
                                            {result && (
                                                <div style={{
                                                    marginTop: '20px',
                                                    padding: '18px 20px',
                                                    borderRadius: '12px',
                                                    background: result.success ? '#f0fdf4' : '#fef2f2',
                                                    border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: result.errors?.length ? '12px' : 0 }}>
                                                        <span className="material-symbols-outlined" style={{
                                                            fontSize: '20px',
                                                            color: result.success ? '#16a34a' : '#dc2626',
                                                        }}>
                                                            {result.success ? 'check_circle' : 'error'}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: 500,
                                                            color: result.success ? '#166534' : '#991b1b',
                                                        }}>
                                                            {result.message}
                                                        </span>
                                                    </div>

                                                    {result.errors && result.errors.length > 0 && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <span style={{
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                color: '#86868b',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.08em',
                                                                display: 'block',
                                                                marginBottom: '8px',
                                                            }}>
                                                                Issues
                                                            </span>
                                                            {result.errors.map((err, i) => (
                                                                <div key={i} style={{
                                                                    fontSize: '13px',
                                                                    color: '#991b1b',
                                                                    padding: '4px 0',
                                                                }}>
                                                                    {err}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    {/* Right: Instructions */}
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
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>info</span>
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>Template Guide</h3>
                                                    <span style={{ fontSize: '12px', color: '#86868b' }}>Column reference</span>
                                                </div>
                                            </div>

                                            {[
                                                { col: 'title', desc: 'Product name', required: true },
                                                { col: 'description', desc: 'Product description', required: true },
                                                { col: 'image_url', desc: 'Public URL to product image (jpg, png, webp)', required: false },
                                                { col: 'direct_link', desc: 'Direct URL to product', required: false },
                                                { col: 'youtube_link', desc: 'YouTube video URL (auto-converted)', required: false },
                                                { col: 'categories', desc: 'Comma-separated category names', required: false },
                                                { col: 'tags', desc: 'Comma-separated tag names', required: false },
                                                { col: 'brand_labels', desc: 'Comma-separated brand names', required: false },
                                                { col: 'meta_keywords', desc: 'SEO keywords', required: false },
                                                { col: 'meta_description', desc: 'SEO description', required: false },
                                            ].map((item, i) => (
                                                <div
                                                    key={item.col}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'space-between',
                                                        padding: '10px 0',
                                                        borderBottom: i < 9 ? '1px solid #f5f5f7' : 'none',
                                                        gap: '12px',
                                                    }}
                                                >
                                                    <div style={{ minWidth: 0 }}>
                                                        <code style={{
                                                            fontSize: '13px',
                                                            fontWeight: 500,
                                                            color: '#000',
                                                            background: '#f5f5f7',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                        }}>
                                                            {item.col}
                                                        </code>
                                                        <div style={{ fontSize: '12px', color: '#86868b', marginTop: '4px' }}>
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                    {item.required && (
                                                        <span style={{
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            color: '#dc2626',
                                                            background: '#fef2f2',
                                                            padding: '2px 8px',
                                                            borderRadius: '9999px',
                                                            flexShrink: 0,
                                                        }}>
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Tips */}
                                            <div style={{
                                                marginTop: '20px',
                                                padding: '16px',
                                                background: '#fffbeb',
                                                borderRadius: '12px',
                                                border: '1px solid #fde68a',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#d97706' }}>lightbulb</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>Tips</span>
                                                </div>
                                                <ul style={{ fontSize: '12px', color: '#92400e', margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
                                                    <li>Delete the example row before uploading</li>
                                                    <li>Category/tag/brand names must match existing ones</li>
                                                    <li>Separate multiple values with commas</li>
                                                    <li>Empty rows are automatically skipped</li>
                                                    <li>Image URLs must be publicly accessible</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Container>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </AuthenticatedLayout>
        </>
    );
}
