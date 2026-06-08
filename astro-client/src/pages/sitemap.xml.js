export async function GET() {
  const baseUrl = import.meta.env.SITE_URL || 'https://newshub.example.com';
  const apiBase = import.meta.env.API_URL || 'https://api.subhkarta.net';

  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/top-blogs`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/top-services`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/service-categories`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly' },
  ];

  let dynamicUrls = [];

  try {
    const [blogsRes, servicesRes] = await Promise.all([
      fetch(`${apiBase}/api/blogs?limit=1000`).then(r => r.ok ? r.json() : { blogs: [] }),
      fetch(`${apiBase}/api/services?limit=1000`).then(r => r.ok ? r.json() : { services: [] }),
    ]);

    const blogs = blogsRes.blogs || [];
    const services = servicesRes.services || [];

    dynamicUrls = [
      ...blogs.map(b => ({
        loc: `${baseUrl}/blog/${b.slug || b._id}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: b.updatedAt || b.createdAt,
        image: b.image,
        news: {
          publication: { name: 'NewsHub', language: 'en' },
          publication_date: b.createdAt,
          title: b.title,
          keywords: b.tags ? b.tags.join(', ') : b.category || '',
        },
      })),
      ...services.map(s => ({
        loc: `${baseUrl}/service/${s.slug || s._id}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: s.updatedAt || s.createdAt,
        image: s.image,
      })),
    ];
  } catch (e) {
    // Backend unavailable, serve static pages only
  }

  const urls = [...staticPages, ...dynamicUrls];

  function escapeXml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${u.image && u.image.startsWith('http') ? `<image:image><image:loc>${escapeXml(u.image)}</image:loc></image:image>` : ''}
    ${u.news ? `<news:news>
      <news:publication>
        <news:name>${escapeXml(u.news.publication.name)}</news:name>
        <news:language>${escapeXml(u.news.publication.language)}</news:language>
      </news:publication>
      <news:publication_date>${new Date(u.news.publication_date).toISOString().split('T')[0]}</news:publication_date>
      <news:title>${escapeXml(u.news.title)}</news:title>
      <news:keywords>${escapeXml(u.news.keywords)}</news:keywords>
    </news:news>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
