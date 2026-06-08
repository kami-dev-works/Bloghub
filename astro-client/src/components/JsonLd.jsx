import { Helmet } from 'react-helmet-async';

const JsonLdBlog = ({ blog }) => {
  if (!blog) return null;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: blog.title,
    description: blog.metaDescription || blog.description,
    image: blog.image,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author?.username || 'Anonymous',
      url: blog.author?.url || undefined,
      sameAs: blog.author?.sameAs || undefined,
      knowsAbout: blog.category,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NewsHub',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
    keywords: [...new Set([...(blog.keywords || []), ...(blog.seoTitles || []), ...(blog.tags || [])])].join(', '),
    articleSection: blog.category,
    wordCount: blog.content ? blog.content.split(/\s+/).length : 0,
  };

  const faqItems = blog.faq && blog.faq.length > 0 ? blog.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })) : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structured)}</script>
      {faqItems && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems,
        })}</script>
      )}
    </Helmet>
  );
};

const JsonLdService = ({ service }) => {
  if (!service) return null;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription || service.description,
    image: service.image,
    provider: {
      '@type': 'Organization',
      name: 'NewsHub',
    },
    offers: {
      '@type': 'Offer',
      price: service.price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: service.ratingCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: service.rating,
      ratingCount: service.ratingCount,
      bestRating: 5,
    } : undefined,
    keywords: [...new Set([...(service.keywords || []), ...(service.seoTitles || []), ...(service.tags || [])])].join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  };

  if (!structured.aggregateRating) delete structured.aggregateRating;

  const faqItems = service.faq && service.faq.length > 0 ? service.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })) : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structured)}</script>
      {faqItems && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems,
        })}</script>
      )}
    </Helmet>
  );
};

const JsonLdBreadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structured)}</script>
    </Helmet>
  );
};

export { JsonLdBlog, JsonLdService, JsonLdBreadcrumb };
