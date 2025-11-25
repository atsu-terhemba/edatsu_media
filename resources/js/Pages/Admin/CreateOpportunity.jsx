import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Select from 'react-select'
import axios from 'axios';
import { swalConfig } from '@/utils/Index';
import { Toast } from '@/utils/Index';
import LexicalTextEditor from '@/Components/LexicalTextEditorComponent';
import EditorJS from '@editorjs/editorjs';
import QuillEditor from '@/Components/QuillEditorComponent';
import ImageCropCompress from '@/Components/ImageCropCompress';



export default function CreateOpportunity({ edits, categories, brand_label, countries, continents, selectedData}) {
   
    const [section, setSection] = useState('details'); 
    const [categoryOption, setCategoryOptions] = useState([]);
    const [brandLabelOption, setBrandLabelOptions] = useState([]);
    const [countryOption, setCountryOptions] = useState([]);
    const [continentOption, setContinentOptions] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    //..................................................
    // const [categoryEditOption, setEditCategoryOptions] = useState([]);
    // const [brandLabelEditOption, setEditBrandLabelOptions] = useState([]);
    // const [countryEditOption, setEditCountryOptions] = useState([]);
    // const [continentEditOption, setEditContinentOptions] = useState([]);

    useEffect(()=>{
        setStateFromData(categories, setCategoryOptions);
        setStateFromData(brand_label, setBrandLabelOptions);
        setStateFromData(countries, setCountryOptions);
        setStateFromData(continents, setContinentOptions);
        //..................................................
        setEditFromData(selectedData?.category, 'categories');
        setEditFromData(selectedData?.brand_labels, 'brand_labels');
        setEditFromData(selectedData?.continent, 'continents');
        setEditFromData(selectedData?.country, 'countries');
    }, []);

    const [formData, setFormData] = useState({
        cover_img: null,
        title: edits?.title || '',
        description: edits?.description || '',
        deadline: edits?.deadline || '',
        source_url: edits?.source_url || '',
        direct_link: edits?.direct_link || '',
        meta_keywords: edits?.meta_keywords || '',
        meta_description: edits?.meta_description || '',
        post_id: edits?.id || '',
        categories: [],
        brand_labels: [],
        countries: [],
        continents: [],
        signature: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    function setStateFromData(data, setOptions){
        if (data) {
            const options = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setOptions(options);
        }
    }

    function setEditFromData(data, fieldName){
        if (data) {
            const options = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
           // let updatedData = { ...formData, [fieldName]: options };
            setFormData((prevData)=>{
                return { ...prevData, [fieldName]: options };
            });
        }
    }

    function updateSelection( selectedOption, fieldName){
        if (selectedOption) {
            let updatedData = { ...formData, [fieldName]: selectedOption };
            setFormData(updatedData);
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;
        
        const allowedFileTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg'
        ];
        
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        // Check file size
        if (file.size > maxSize) {
            Toast.fire({
                icon: 'warning',
                title: 'File size exceeds 50MB limit',
                swalConfig
            });
            e.target.value = '';
            return;
        }
        
        // Check file type
        if (!allowedFileTypes.includes(file.type)) {
            Toast.fire({
                icon: 'warning',
                title: 'Invalid file type',
                swalConfig
            });
            e.target.value = '';
            return;
        }

        // Open crop/compress modal instead of directly setting the file
        setShowImageModal(true);
        e.target.value = ''; // Reset input so user can select same file again if needed
    };

    const handleImageProcessed = (processedFile) => {
        setFormData({...formData, cover_img: processedFile});
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(processedFile);
        setImagePreview(previewUrl);
        
        Toast.fire({
            icon: 'success',
            title: 'Image processed successfully',
            swalConfig
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Send the combined data to the server
        try {
            const response = await axios.post('/admin-store-opportunity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log(response.data);
    
            // Handle success response
            if (response.data.success) {
                Toast.fire({
                    icon: 'success',
                    title: response.data.message,
                    swalConfig, 
                });
            } else {
                Toast.fire({
                    icon: 'warning',
                    title: response.data.message,
                    swalConfig
                });
            }
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: 'error',
                title: 'An error occurred',
                swalConfig
            });
        }
    };

    return (
        <>
            <Head title="Opportunities" />
            <AuthenticatedLayout>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <AdminSideNav />
                            </div>
                        </Col>
                        <Col sm={5}>

                        <div className="px-3 py-2 rounded border text-center bg-white my-3">
                            <h2 className="poppins-semibold m-0 p-0 py-3">Opportunities</h2>
                        </div>

                        <div className="border rounded mb-3 py-3 px-3">
                            <button className= {`btn btn-dark fs-8  ${(section == 'details') ? 'bg-warning border-0 text-dark' : 'bg-dark'}`} id="jobDetailsBtn" onClick={()=>setSection('details')}>Job Details</button>&nbsp;
                            <button className={`btn btn-dark fs-8  ${(section == 'seo') ? 'bg-warning border-0 text-dark' : 'bg-dark'}`} id="seoBtn" onClick={()=>setSection('seo')}>SEO</button>&nbsp;
                        </div>

                        {edits && (
                            <Alert variant="warning" className="my-3">
                                <span className='d-block mb-2 fs-9'>You're currently in edit mode</span>
                                <a href="{{route('admin.opp')}}" className="btn btn-dark poppins-semibold fs-9 px-4">Create new post</a>
                            </Alert>
                        )}

                        <Form id="mainForm" onSubmit={handleSubmit} encType="multipart/form-data">
                            {/**begin details section */}
                            {(section == 'details') && 
                            <div id="jobDetailsSection" className="px-3 bg-white mb-3 py-3 rounded border">
                                <Form.Group className="mb-3">
                                    <Form.Label>Image:</Form.Label>
                                    <Form.Control type="file" name="cover_img" onChange={handleFileUpload} />
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                                            />
                                            <div className="mt-2">
                                                <small className="text-success">✓ Image processed and ready to upload</small>
                                            </div>
                                        </div>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                                    <Form.Text id="seo_title_feedback"></Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <span className="d-block text-secondary mb-2 fs-9">Provide detailed description for this opportunity</span>
                                    {/* <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} /> */}
                                    <QuillEditor 
                                        formData={formData} 
                                        setFormData={setFormData}  
                                        name='description'
                                    />
                                    <br/>
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Deadline</Form.Label>
                                    <span className="d-block text-secondary mb-2 fs-9">Add a deadline for this opportunity *</span>
                                    <Form.Control type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>URL/Reference Link</Form.Label>
                                    <span className="d-block text-secondary mb-2 fs-9">Provide a link to learn more or apply for this opportunity</span>
                                    <Form.Control type="text" name="source_url" placeholder="Enter source url" value={formData.source_url} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Link to Apply Directly</Form.Label>
                                    <Form.Control type="text" name="direct_link" placeholder="Enter source url" value={formData.direct_link} onChange={handleChange} />
                                </Form.Group>
                            </div>
                            }

                            {/* End Job Details Section */}

                            {/* SEO Optimization Section */}
                            {(section == 'seo') && 
                            <div id="seoSection" className="border px-3 py-3 rounded mb-3">
                                <h3 className="poppins-semibold">Seo Optimization</h3>
                                <p className="text-secondary m-0 p-0 fs-9">Add meta data and description for seo optimization and keywords</p>

                                <Form.Group className="mb-3">
                                    <Form.Label>Focus Keyphrase</Form.Label>
                                    <Form.Control type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Description</Form.Label>
                                    <Form.Control as="textarea" name="meta_description" rows={3} value={formData.meta_description} onChange={handleChange} />
                                </Form.Group>

                                <Row className="">
                                    <Form.Control type="text" name="post_id" value={formData.post_id} />
                                    <Form.Control type="text" name="signature" value={formData.signature} />
                                </Row>
                            </div>
                            }
                            {/* End SEO Optimization Section */}

                            <Button variant="dark" type="submit" className="btn py-3 w-100 d-block poppins-semibold mb-3">Create</Button>
                            </Form>
                        </Col>
                        <Col sm={4}>
                            <div className="px-3 py-3 border my-3 rounded">
                                <Form id="secondaryForm">
                                    <Row>
                                    <Col sm={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categories</Form.Label>
                                            <span className="d-block text-secondary mb-2 fs-9">Add categories</span>
                                            <Select
                                                isMulti
                                                value={formData?.categories}
                                                name="categories"
                                                options={categoryOption}
                                                className="fs-9"
                                                classNamePrefix="select"
                                                onChange={(e) => updateSelection(e, 'categories')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand Labels</Form.Label>
                                            <span className="d-block text-secondary mb-2 fs-9">Add Brand Labels</span>
                                            <Select
                                                isMulti
                                                value={formData?.brand_labels}
                                                name="brand_labels"
                                                options={brandLabelOption}
                                                className="fs-9"
                                                classNamePrefix="select"
                                                onChange={(e) => updateSelection(e, 'brand_labels')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Country</Form.Label>
                                            <span className="d-block text-secondary mb-2 fs-9">Select a country</span>
                                            <Select
                                                isMulti
                                                value={formData?.countries} 
                                                name="countries "
                                                options={countryOption}
                                                className="fs-9"
                                                classNamePrefix="select"
                                                onChange={(e) => updateSelection(e, 'countries')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Continent</Form.Label>
                                            <span className="d-block text-secondary mb-2 fs-9">Select a continent</span>
                                            <Select
                                                isMulti
                                                value={formData?.continents}
                                                name="continents"
                                                options={continentOption}
                                                className="fs-9"
                                                classNamePrefix="select"
                                                onChange={(e) => updateSelection(e, 'continents')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Image Crop & Compress Modal */}
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