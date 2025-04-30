import { useEffect } from "react"
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillEditor({formData, setFormData, name}){

    // const [value, setValue] = useState('');

    const handleChange = (value) => {
        setFormData({
            ...formData,[name]: value,
        });
    };

    return(
        <>
        <div className="d-block mb-3">
            <ReactQuill theme="snow" value={formData?.description} onChange={handleChange} style={{ height: '300px'}} />
        </div>
        </>
    )
}


