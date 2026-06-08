import { Helmet } from 'react-helmet-async';

const SeoHead = ({ title, description, seoTitles = [], image, type = 'website', path = '', publishedDate, updatedDate, author, locale = 'en_US' }) => {
  const siteName = 'NewsHub';
  const siteUrl = window.location.origin;
  const fullUrl = path ? `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}` : window.location.href;
  const ogImage = image || '/og-image.jpg';

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      {description && <meta name="description" content={description} />}
      {seoTitles.length > 0 && <meta name="keywords" content={seoTitles.join(', ')} />}

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title || siteName} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title || siteName} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />

      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {updatedDate && <meta property="article:modified_time" content={updatedDate} />}
      {author && <meta name="author" content={author} />}
      {seoTitles.map((tag, i) => (
        <meta key={`artag-${i}`} property="article:tag" content={tag} />
      ))}
    </Helmet>
  );
};

export default SeoHead;
