import { defineMiddleware } from 'astro:middleware';

const BACKEND_URL = (import.meta.env.BACKEND_URL || process.env.BACKEND_URL || 'https://api.subhkarta.net').replace(/\/$/, '');

const PROXY_PREFIXES = ['/api/', '/uploads/'];

const isProxied = (pathname) => PROXY_PREFIXES.some((p) => pathname === p.slice(0, -1) || pathname.startsWith(p));

const buildTargetUrl = (request) => {
  const url = new URL(request.url);
  return `${BACKEND_URL}${url.pathname}${url.search}`;
};

const hopByHop = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
]);

const filterResponseHeaders = (headers) => {
  const out = new Headers();
  headers.forEach((value, key) => {
    if (!hopByHop.has(key.toLowerCase())) {
      out.set(key, value);
    }
  });
  return out;
};

const buildForwardHeaders = (request, bodyLength) => {
  const headers = new Headers(request.headers);
  headers.set('host', new URL(BACKEND_URL).host);
  headers.set('x-forwarded-host', new URL(request.url).host);
  headers.set('x-forwarded-proto', new URL(request.url).protocol.replace(':', ''));
  headers.delete('expect');
  headers.delete('connection');
  headers.delete('keep-alive');
  headers.delete('transfer-encoding');
  if (bodyLength != null) {
    headers.set('content-length', String(bodyLength));
  } else {
    headers.delete('content-length');
  }
  return headers;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (isProxied(pathname)) {
    const target = buildTargetUrl(context.request);
    const method = context.request.method;
    try {
      let bodyBuffer;
      if (!['GET', 'HEAD'].includes(method) && context.request.body) {
        bodyBuffer = Buffer.from(await context.request.arrayBuffer());
      }
      const headers = buildForwardHeaders(context.request, bodyBuffer?.length);
      const init = { method, headers };
      if (bodyBuffer && bodyBuffer.length > 0) {
        init.body = bodyBuffer;
      }
      const upstream = await fetch(target, init);
      const responseHeaders = filterResponseHeaders(upstream.headers);
      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      console.error(`[proxy] ${method} ${pathname} -> ${target} failed:`, err.message, err.cause?.message || err.cause || '');
      return new Response(
        JSON.stringify({ message: 'Upstream backend unavailable', error: err.message }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return next();
});
