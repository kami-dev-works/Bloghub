import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function processAndSaveImage(filePath, options = {}) {
  const { maxWidth = 1920, webpQuality = 80, avifQuality = 60 } = options;

  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (metadata.width > maxWidth) {
    image.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const webpPath = path.join(dir, `${baseName}.webp`);
  await image.clone().webp({ quality: webpQuality }).toFile(webpPath);

  const avifPath = path.join(dir, `${baseName}.avif`);
  await image.clone().avif({ quality: avifQuality }).toFile(avifPath);

  return {
    webp: `${baseName}.webp`,
    avif: `${baseName}.avif`,
    original: `${baseName}${ext}`,
  };
}

export async function getResponsiveSizes(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  const sizes = [400, 800, 1200];
  const results = [];

  for (const width of sizes) {
    const outputPath = path.join(dir, `${baseName}-${width}.webp`);
    await sharp(filePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    results.push({ width, path: `${baseName}-${width}.webp` });
  }

  return results;
}
