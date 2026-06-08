export async function GET({ params }) {
  const { slug } = params;
  const API_BASE = import.meta.env.API_URL || 'https://api.subhkarta.net';

  try {
    const res = await fetch(`${API_BASE}/api/services/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      return new Response('Not found', { status: 404 });
    }
    const service = await res.json();
    if (service.contentType !== 'html-only' || !service.htmlContent) {
      return new Response('Not available as standalone content', { status: 404 });
    }
    return new Response(service.htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (e) {
    return new Response('Error loading content', { status: 500 });
  }
}
