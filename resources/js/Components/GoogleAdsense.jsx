import React, { useEffect, useState } from 'react';

const GoogleAdsense = ({
  client = 'ca-pub-7365396698208751',
  slot = '7889919728',
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  // Only render on the client to avoid SSR/hydration conflicts
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
      // AdSense not loaded or ad blocked
    }
  }, [isClient, client]);

  if (!isClient) return null;

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
