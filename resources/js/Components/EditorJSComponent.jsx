import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

export default function Editor() {
  const editorInstanceRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current && !editorInstanceRef.current) {
      const initEditor = async () => {
        editorInstanceRef.current = new EditorJS({
          holder: containerRef.current,
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
          },
          autofocus: true,
          onReady: () => {
            console.log('Editor.js is ready to work!');
          },
        });
      };
      
      initEditor().catch(err => console.error('EditorJS initialization failed:', err));
    }
    
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
          .catch(err => console.error('EditorJS destroy failed:', err));
        editorInstanceRef.current = null;
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}></div>
  );
}