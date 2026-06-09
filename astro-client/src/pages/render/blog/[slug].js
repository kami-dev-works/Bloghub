export async function GET({ params }) {
  const { slug } = params;
  const API_BASE = import.meta.env.API_URL || 'http://localhost:5000';

  try {
    const res = await fetch(`${API_BASE}/api/blogs/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      return new Response('Not found', { status: 404 });
    }
    const blog = await res.json();
    if (blog.contentType !== 'html-only' || !blog.htmlContent) {
      return new Response('Not available as standalone content', { status: 404 });
    }
    return new Response(blog.htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (e) {
    return new Response('Error loading content', { status: 500 });
  }
}
