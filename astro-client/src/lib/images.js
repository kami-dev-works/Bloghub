export function getImgSrcSet(url) {
  if (!url) return undefined;
  const unsplashMatch = url.match(/images\.unsplash\.com\/(.*)\?w=(\d+)/);
  if (unsplashMatch) {
    const base = `https://images.unsplash.com/${unsplashMatch[1]}`;
    const sizes = [400, 800, 1200];
    return sizes.map(w => `${base}?w=${w}&q=75 ${w}w`).join(', ');
  }
  return undefined;
}

export function getImgSizes(defaultSize = '100vw') {
  return defaultSize;
}
