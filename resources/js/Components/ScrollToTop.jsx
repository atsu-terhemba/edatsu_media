import { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const halfPage = document.documentElement.scrollHeight / 2;
            setVisible(window.scrollY > halfPage);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes scrollBtnIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.8); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    zIndex: 1000,
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#000',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease',
                    animation: 'scrollBtnIn 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f97316';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#000';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    keyboard_arrow_up
                </span>
            </button>
        </>
    );
};

export default ScrollToTop;
