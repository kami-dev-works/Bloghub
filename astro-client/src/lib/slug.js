export function toBlogSlug(title, id, shortId) {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F]+/g, '+')
    .replace(/^\+|\+$/g, '');
  const uid = shortId || id.toString().slice(-8);
  return `${slug}+${uid}`;
}

export function parseBlogSlug(slug) {
  const parts = slug.split('+');
  return parts[parts.length - 1];
}
