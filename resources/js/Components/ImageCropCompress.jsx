import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

export default function ImageCropCompress({ show, onHide, onImageProcessed, aspectRatio = 16 / 9 }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [quality, setQuality] = useState(80);
    const [originalFile, setOriginalFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (PNG, JPEG, JPG, WEBP)');
            return;
        }

        setOriginalFile(file);
        setFileName(file.name);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageSrc(reader.result);
        };
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set maximum dimensions to 800x800
        const maxWidth = 800;
        const maxHeight = 800;
        let width = pixelCrop.width;
        let height = pixelCrop.height;

        // Calculate scaling to fit within 800x800 while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            width,
            height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', quality / 100);
        });
    };

    const handleApply = async () => {
        try {
            if (!croppedAreaPixels || !imageSrc) return;

            // Crop the image
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Compress the cropped image
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800, // Enforce 800px maximum
                useWebWorker: true,
                initialQuality: quality / 100,
            };

            const compressedFile = await imageCompression(croppedBlob, compressionOptions);

            // Convert blob to File object with original filename
            const fileExtension = fileName.split('.').pop();
            const baseName = fileName.replace(`.${fileExtension}`, '');
            const finalFile = new File(
                [compressedFile],
                `${baseName}_processed.jpg`,
                { type: 'image/jpeg' }
            );

            onImageProcessed(finalFile);
            handleClose();
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    const handleClose = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setQuality(80);
        setOriginalFile(null);
        setFileName('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Crop & Compress Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!imageSrc ? (
                    <div className="text-center py-5">
                        <Form.Group>
                            <Form.Label className="btn btn-primary">
                                Select Image
                                <Form.Control
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleFileSelect}
                                    className="d-none"
                                />
                            </Form.Label>
                        </Form.Group>
                        <p className="text-muted mt-3">Supported formats: PNG, JPEG, JPG, WEBP</p>
                    </div>
                ) : (
                    <>
                        <div style={{ position: 'relative', width: '100%', height: '400px', background: '#333' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <Row className="mt-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Zoom: {zoom.toFixed(2)}x</Form.Label>
                                    <Form.Range
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quality: {quality}%</Form.Label>
                                    <Form.Range
                                        min={10}
                                        max={100}
                                        step={5}
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-muted small">
                            <p className="mb-1">
                                <strong>Original:</strong> {originalFile ? (originalFile.size / 1024 / 1024).toFixed(2) : 0} MB
                            </p>
                            <p className="mb-1">
                                <strong>Max Dimensions:</strong> 800 x 800 pixels
                            </p>
                            <p className="mb-0">
                                <strong>Compression:</strong> Image will be compressed and optimized before upload
                            </p>
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {imageSrc && (
                    <>
                        <Button variant="outline-primary" onClick={() => setImageSrc(null)}>
                            Choose Different Image
                        </Button>
                        <Button variant="primary" onClick={handleApply}>
                            Apply & Compress
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
