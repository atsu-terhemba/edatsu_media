import { useEffect, useRef } from "react"
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillFontStyle = `
.ql-editor {
    font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 15px;
    line-height: 1.7;
    letter-spacing: -0.01em;
    color: #1d1d1f;
}
.ql-editor h1, .ql-editor h2, .ql-editor h3,
.ql-editor h4, .ql-editor h5, .ql-editor h6 {
    font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
    color: #1d1d1f;
}
/* Visually neutralize pasted inline color/font/background so the editor
   preview matches what the public page will render. */
.ql-editor *:not(a) {
    color: inherit !important;
    background-color: transparent !important;
    font-family: inherit !important;
}
`;

// Strip color/font/background from inline `style` attributes on pasted nodes.
// Returning the Delta untouched preserves structure (lists, headings, links)
// while the DOM mutation removes the offending styles before Quill parses it.
const STYLE_PROPS_TO_DROP = ['color', 'background-color', 'background', 'font-family', 'font-size'];

function stripInlineStyles(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.hasAttribute && node.hasAttribute('style')) {
        const style = node.getAttribute('style') || '';
        const cleaned = style
            .split(';')
            .map((decl) => decl.trim())
            .filter((decl) => {
                if (!decl) return false;
                const prop = decl.split(':')[0].trim().toLowerCase();
                return !STYLE_PROPS_TO_DROP.includes(prop);
            })
            .join('; ');
        if (cleaned) {
            node.setAttribute('style', cleaned);
        } else {
            node.removeAttribute('style');
        }
    }
    if (node.removeAttribute) {
        node.removeAttribute('color');
        node.removeAttribute('face');
        node.removeAttribute('bgcolor');
    }
}

export default function QuillEditor({ formData, setFormData, name }) {
    const quillRef = useRef(null);

    const handleChange = (value) => {
        setFormData({
            ...formData, [name]: value,
        });
    };

    // Register a clipboard matcher once per editor instance.
    useEffect(() => {
        const editor = quillRef.current && quillRef.current.getEditor && quillRef.current.getEditor();
        if (!editor) return;
        const clipboard = editor.clipboard;
        if (!clipboard || typeof clipboard.addMatcher !== 'function') return;

        const matcher = (node, delta) => {
            stripInlineStyles(node);
            return delta;
        };
        clipboard.addMatcher(Node.ELEMENT_NODE, matcher);
    }, []);

    return (
        <>
            <style>{quillFontStyle}</style>
            <div className="d-block mb-3">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData?.description}
                    onChange={handleChange}
                    style={{ height: '300px' }}
                />
            </div>
        </>
    )
}
