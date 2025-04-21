import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Select from 'react-select'
import axios from 'axios';
import { swalConfig } from '@/utils/Index';
import { Link } from "@inertiajs/react";
import { getDaysLeft, toggleShare, bookmark, pageLink, renderLabels, dateStringFormat} from "@/utils/Index";
import DefaultPagination from '@/Components/DefaultPagination';
import { Toast } from '@/utils/Index';


export default function AllOppty() {

    const [pagination, setPagination] = useState([]);
    const [opp_data, setData] = useState([]); // Set Data
    const [isloading, setIsLoading] = useState('');
    const [current_page, setCurrentPage ] = useState(0);
    const [per_page, setPerPage ] = useState(0);
    const paginationContainerRef = useRef(null);


      // Then in your triggerPagination function:
  function triggerPagination(url) {
    // Store the current position of the pagination container
    const container = paginationContainerRef.current;
    const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
    setIsLoading(true);
    axios.get(url)
    .then((response) => {
        const  {data, links, current_page, total, per_page, last_page} = response.data;
        setData(data); 
        setPagination(links);
        setCurrentPage(current_page); 
        setPerPage(per_page);
        setTimeout(() => {
            window.scrollTo({
                top: containerPosition,
                behavior: 'instant'
            });
        }, 100);
    })
    .catch((error) => {
        // Handle error
    })
    .finally(() => {
        setIsLoading(false);
    });
}


    useEffect(() => {
        axios.get('/fetch-all-opp')
        .then((response) => {
            // console.log(response); 
            // Destructure the pagination data for easier access
            const  {data, links, current_page, total, per_page, last_page} = response.data;
     
            setData(data);
            setPagination(links);
            setCurrentPage(current_page); 
            setPerPage(per_page);

            // Now you can work with the items and pagination info
            //   console.log('Items:', items);
            //   console.log('Page:', current_page, 'of', last_page);
            //   console.log('Total items:', total);
        })
        .catch((error) => {
          // More specific error handling
          if (error.response) {
            // The request was made, but the server responded with an error status
            console.error('Server error:', error.response.status, error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Network error - no response received');
          } else {
            // Something happened in setting up the request
            console.error('Request error:', error.message);
          }
        });

    }, []);

    const toggleStatus = (status) => {
        switch (status) {
            case 'published':
                return <span className='badge rounded-pill text-bg-success'>Published</span>;
            case 'draft':
                return <span className='badge rounded-pill text-bg-secondary'>Draft</span>;
            case 'archived':
                return <span className='badge rounded-pill text-bg-danger'>Archived</span>;
            default:
                return <span className='badge rounded-pill text-bg-danger'>Error</span>;
        }
    }

    const initCrud = async (e)  => {
        e?.preventDefault();
        const url = e.target.href;
        axios.get(url).then((res)=>{
            console.log(res);
            if(res.data.status == 'success'){
                Toast.fire({
                    icon: "success",
                    title: res.data.message
                });
            }
        }).catch((err)=>{
            console.log(err);
            Toast.fire({
                icon: "error",
                title: 'Ops! something went wrong.'
            });
        })  
    }

    return (
        <>
            <Head title="Publish Opportunities" />
            <AuthenticatedLayout>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <AdminSideNav />
                            </div>
                        </Col>
                        <Col sm={9}>

                        <div className="px-3 py-2 rounded border text-center bg-white my-3">
                            <h2 className="poppins-semibold m-0 p-0 py-3">All Opportunities</h2>
                        </div>

                        <div className='table table-responsive fs-9'>
                            <table className='table table-bordered table-hover'>
                                <thead className='table-dark poppins-semibold'>
                                    <tr>
                                        <th scope='col' className=' poppins-regular'>#</th>
                                        <th scope='col' className=' poppins-regular'>Title</th>
                                        <th scope='col' className=' poppins-regular'>Status</th> 
                                        <th scope='col' className=' poppins-regular'>Views</th> 
                                        <th scope='col' className=' poppins-regular'>Created</th>
                                        <th scope='col' className=' poppins-regular'>Updated</th>
                                        <th scope='col' className=' poppins-regular'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {opp_data?.map((oppty, index) => (
                                        <tr key={index}>
                                            <td>{(current_page - 1) * per_page + index + 1}</td>
                                            <td>{oppty.title}</td>
                                            <td>{toggleStatus(oppty.status)}</td>
                                            <td>{oppty.views}</td>
                                            <td>{new Date(oppty.created_at).toLocaleDateString()}</td>
                                            <td>{new Date(oppty.updated_at).toLocaleDateString()}</td>
                                            <td className='text-center'>
                                            <div class="dropdown">
                                            <button class="btn fs-9" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span class="material-symbols-outlined align-middle">
                                                    more_vert
                                                </span>
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-dark fs-9">
                                                <li><Link class="dropdown-item" href={`/admin-edit-opportunity/`+oppty.id}>Edit</Link></li>
                                                <li><a class="dropdown-item"  href={`/admin-draft-opportunity/`+oppty.id} onClick={(e)=> initCrud(e)}>Draft</a></li>
                                                <li><a class="dropdown-item"  href={`/admin-publish-opportunity/`+oppty.id} onClick={(e)=> initCrud(e)}>Publish</a></li>
                                                <li><a class="dropdown-item"  href={`/admin-archive-opportunity/`+oppty.id} onClick={(e)=> initCrud(e)}>Archive</a></li>
                                                <li><Link class="dropdown-item"  href={`/op/${oppty.id}/${oppty.slug}`}>Preview</Link></li>
                                                <li><a class="dropdown-item" href={`/admin-delete-opportunity/${oppty.id}`} onClick={(e)=> initCrud(e)}>Delete</a></li>
                                            </ul>
                                            </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>    
                            </table>
                            </div>

                        {(pagination.length > 0) &&
                            <DefaultPagination 
                                pagination={pagination} 
                                triggerPagination={triggerPagination}
                            />
                        }
                        </Col>
                    </Row>
                </Container>
            </AuthenticatedLayout>
        </>
    );
}