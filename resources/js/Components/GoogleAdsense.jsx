import React, { useEffect } from 'react';

const GoogleAdsense = ({
  client = 'ca-pub-7365396698208751',
  slot = '7889919728',
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = '',
}) => {
  
  useEffect(() => {
    // Load the AdSense script if it hasn't been loaded yet
    const hasScript = document.querySelector(`script[src*="adsbygoogle"][data-ad-client="${client}"]`);
    
    if (!hasScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.adClient = client;
      document.head.appendChild(script);
    }

    // Initialize this specific ad after component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
    
    // Cleanup function not strictly necessary for AdSense,
    // but good practice for component unmounting
    return () => {
      // No real cleanup needed for AdSense
    };
  }, [client]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default GoogleAdsense;