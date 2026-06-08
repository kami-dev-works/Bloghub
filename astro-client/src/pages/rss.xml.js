export async function GET() {
  const baseUrl = import.meta.env.SITE_URL || 'https://newshub.example.com';
  const apiBase = import.meta.env.API_URL || 'https://api.subhkarta.net';

  let items = [];

  try {
    const res = await fetch(`${apiBase}/api/blogs?limit=50&sort=-createdAt`);
    if (res.ok) {
      const data = await res.json();
      items = (data.blogs || []).map(b => ({
        title: b.title,
        description: b.metaDescription || b.description || '',
        link: `${baseUrl}/blog/${b.slug || b._id}`,
        pubDate: b.createdAt ? new Date(b.createdAt).toUTCString() : '',
        category: b.category || '',
        author: b.author?.username || 'NewsHub',
        guid: b.slug || b._id,
      }));
    }
  } catch (e) {
    // Backend unavailable
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>NewsHub - Latest News</title>
    <link>${baseUrl}</link>
    <description>Stay informed with the latest news from around the world</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
      <author>${item.author}</author>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
