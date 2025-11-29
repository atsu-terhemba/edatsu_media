import React from 'react';
import { Helmet } from 'react-helmet';

const Metadata = ({
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    author = "Edatsu Media",
    siteName = "Edatsu Media",
    locale = "en_US",
    type = "website",
    publishedTime,
    modifiedTime,
    section,
}) => {
  // Ensure title includes brand name
  const fullTitle = title?.includes('Edatsu') ? title : `${title} | Edatsu Media`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locale} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={ogTitle || fullTitle} />
        <meta property="og:description" content={ogDescription || description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={ogUrl || canonicalUrl} />
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {section && <meta property="article:section" content={section} />}

      {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@edatsumedia" />
        <meta name="twitter:creator" content="@edatsumedia" />
        <meta name="twitter:title" content={twitterTitle || fullTitle} />
        <meta name="twitter:description" content={twitterDescription || description} />
        <meta name="twitter:image" content={twitterImage || ogImage} />
        
      {/* Additional SEO Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-title" content="Edatsu Media" />
        <meta name="application-name" content="Edatsu Media" />
    </Helmet>
);
};

export default Metadata;