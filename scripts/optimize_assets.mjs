import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Без кэша sharp не держит файлы открытыми — иначе на Windows перезапись
// оптимизированного файла молча падает (EBUSY) и картинка остаётся тяжёлой.
sharp.cache(false);

async function optimizeDirectory(dir, isSubdir = false) {
  if (!fs.existsSync(dir)) return { before: 0, after: 0, count: 0 };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        const sub = await optimizeDirectory(fullPath, true);
        totalBefore += sub.before;
        totalAfter += sub.after;
        count += sub.count;
      }
      continue;
    }

    const name = entry.name;
    const isPng = /\.png$/i.test(name);
    const isJpg = /\.(jpe?g)$/i.test(name);
    if (!isPng && !isJpg) continue;

    const stat = fs.statSync(fullPath);
    totalBefore += stat.size;

    try {
      const meta = await sharp(fullPath).metadata();
      let pipeline = sharp(fullPath);

      // Smart responsive max dimensions
      let maxDim = 1600;
      if (name.includes('ministry-logo')) maxDim = 800;
      else if (name.includes('logo-footer') || name.includes('favicon')) maxDim = 1000;
      // Размеры — по фактическому показу на сайте ×2 (для экранов с высокой плотностью):
      // logo-crystal показывается ~384×419, eagle2 ~380×567, фото спикеров ~380×475.
      else if (name.includes('logo-crystal')) maxDim = 900;
      else if (name.includes('eagle2')) maxDim = 1200;
      else if (name.includes('speaker-')) maxDim = 1000;
      else if (name.includes('partner-') || name.includes('logo-')) maxDim = 1200;

      if ((meta.width && meta.width > maxDim) || (meta.height && meta.height > maxDim)) {
        pipeline = pipeline.resize({
          width: meta.width >= meta.height ? maxDim : undefined,
          height: meta.height > meta.width ? maxDim : undefined,
          withoutEnlargement: true
        });
      }

      let buf;
      // Кодируем по реальному формату файла, а не по расширению: некоторые
      // «.png» внутри — JPEG-фото, и в PNG они раздуваются в разы.
      // Браузеры определяют формат картинки по содержимому, так что показ не меняется.
      if (isPng && meta.format !== 'jpeg') {
        buf = await pipeline.png({ quality: 85, compressionLevel: 9, palette: true }).toBuffer();
      } else {
        buf = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      }

      if (buf.length < stat.size) {
        fs.writeFileSync(fullPath, buf);
        totalAfter += buf.length;
        count++;
      } else {
        totalAfter += stat.size;
      }
    } catch (err) {
      totalAfter += stat.size;
    }
  }

  return { before: totalBefore, after: totalAfter, count };
}

export async function runAssetOptimizer() {
  console.log('⚡ Оптимизация изображений (Web-ready сжатие)...');
  const targetDirs = ['dist/assets'];
  let grandBefore = 0;
  let grandAfter = 0;
  let grandCount = 0;

  for (const dir of targetDirs) {
    const res = await optimizeDirectory(dir);
    grandBefore += res.before;
    grandAfter += res.after;
    grandCount += res.count;
  }

  // Also optimize root dist files if present
  if (fs.existsSync('dist')) {
    const rootFiles = ['logo-crystal.png', 'logo-header.png', 'favicon.png', 'og-image.jpg'];
    for (const rf of rootFiles) {
      const target = path.join('dist', rf);
      if (fs.existsSync(target)) {
        const stat = fs.statSync(target);
        grandBefore += stat.size;
        try {
          const meta = await sharp(target).metadata();
          let p = sharp(target);
          let buf;
          if (/\.png$/i.test(rf)) {
            const rootMax = rf === 'logo-crystal.png' ? 900 : 1400;
            buf = await p.resize({ width: rootMax, height: rootMax, fit: 'inside', withoutEnlargement: true }).png({ quality: 85, compressionLevel: 9, palette: true }).toBuffer();
          } else {
            buf = await p.resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          }
          if (buf.length < stat.size) {
            fs.writeFileSync(target, buf);
            grandAfter += buf.length;
            grandCount++;
          } else {
            grandAfter += stat.size;
          }
        } catch (e) {
          grandAfter += stat.size;
        }
      }
    }
  }

  const saved = grandBefore - grandAfter;
  const pct = grandBefore > 0 ? ((saved / grandBefore) * 100).toFixed(1) : 0;
  console.log(`✓ Оптимизировано файлов: ${grandCount}`);
  console.log(`✓ Исходный размер: ${(grandBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✓ Новый размер:    ${(grandAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✓ Сэкономлено:     ${(saved / 1024 / 1024).toFixed(2)} MB (-${pct}%)`);
}

if (process.argv[1] && process.argv[1].includes('optimize_assets')) {
  runAssetOptimizer();
}

