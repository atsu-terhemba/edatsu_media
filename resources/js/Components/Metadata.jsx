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
}) => {
  return (
    <Helmet>
      {/* General Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook) Metadata */}
        <meta property="og:title" content={ogTitle || title} />
        <meta property="og:description" content={ogDescription || description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl || canonicalUrl} />
        <meta property="og:type" content="website" />

      {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={twitterTitle || title} />
        <meta name="twitter:description" content={twitterDescription || description} />
        <meta name="twitter:image" content={twitterImage || ogImage} />
    </Helmet>
);
};

export default Metadata;