import path from 'path';
import fs from 'fs';

export function webpMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();

  const accept = req.headers.accept || '';
  if (!accept.includes('image/webp')) return next();

  const ext = path.extname(req.path).toLowerCase();
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif'];
  if (!imageExts.includes(ext)) return next();

  const webpPath = path.join(process.cwd(), req.path.replace(ext, '.webp'));
  if (fs.existsSync(webpPath)) {
    req.url = req.url.replace(ext, '.webp');
    res.setHeader('Vary', 'Accept');
  }

  next();
}
