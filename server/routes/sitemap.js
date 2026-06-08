import express from 'express';
import Blog from '../models/Blog.js';
import Service from '../models/Service.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'http://localhost:4321';
    const blogs = await Blog.find({ status: 'approved' }).select('slug createdAt updatedAt image title').lean();
    const services = await Service.find({ isActive: true }).select('slug createdAt updatedAt image').lean();

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
      { loc: `${baseUrl}/trp`, priority: '0.6', changefreq: 'daily' },
    ];

    const blogUrls = blogs.map(b => ({
      loc: `${baseUrl}/blog/${b.slug || b._id}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: b.updatedAt || b.createdAt,
      image: b.image,
    }));

    const serviceUrls = services.map(s => ({
      loc: `${baseUrl}/service/${s.slug || s._id}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: s.updatedAt || s.createdAt,
      image: s.image,
    }));

    const allUrls = [...staticPages, ...blogUrls, ...serviceUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${u.image && u.image.startsWith('http') ? `<image:image><image:loc>${escapeXml(u.image)}</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/news-sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'http://localhost:4321';
    const blogs = await Blog.find({ status: 'approved' })
      .sort('-createdAt')
      .limit(100)
      .select('slug title description image createdAt updatedAt category tags')
      .populate('author', 'username')
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${blogs.map(b => `  <url>
    <loc>${baseUrl}/blog/${b.slug || b._id}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(process.env.SITE_NAME || 'NewsHub')}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(b.createdAt).toISOString().split('T')[0]}</news:publication_date>
      <news:title>${escapeXml(b.title)}</news:title>
      <news:keywords>${b.tags ? b.tags.join(', ') : b.category || ''}</news:keywords>
    </news:news>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export default router;
