import { useEffect } from "react"
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillFontStyle = `
.ql-editor {
    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: -0.011em;
}
.ql-editor h1, .ql-editor h2, .ql-editor h3,
.ql-editor h4, .ql-editor h5, .ql-editor h6 {
    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}
`;

export default function QuillEditor({formData, setFormData, name}){

    const handleChange = (value) => {
        setFormData({
            ...formData,[name]: value,
        });
    };

    return(
        <>
        <style>{quillFontStyle}</style>
        <div className="d-block mb-3">
            <ReactQuill theme="snow" value={formData?.description} onChange={handleChange} style={{ height: '300px'}} />
        </div>
        </>
    )
}
