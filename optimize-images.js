import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const MAX_WIDTH = 1600;
const SIZE_THRESHOLD = 150 * 1024; // 150 KB

async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

async function optimize() {
  const publicDir = path.resolve('./public');
  const srcDir = path.resolve('./src');
  
  const allFiles = [...(await getAllFiles(publicDir)), ...(await getAllFiles(srcDir))];
  
  let totalSaved = 0;
  let optimizedCount = 0;

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const stats = fs.statSync(file);
    if (stats.size < SIZE_THRESHOLD) continue;

    const originalSize = stats.size;
    const tempFile = file + '.tmp' + ext;

    try {
      const image = sharp(file);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });
      } else if (ext === '.png') {
        // Use palette quantization for PNGs to compress heavily while preserving transparency
        pipeline = pipeline.png({ quality: 78, palette: true, effort: 8 });
      }

      await pipeline.toFile(tempFile);

      const newStats = fs.statSync(tempFile);
      if (newStats.size < originalSize) {
        fs.unlinkSync(file);
        fs.renameSync(tempFile, file);
        const saved = originalSize - newStats.size;
        totalSaved += saved;
        optimizedCount++;
        console.log(`Optimized ${path.relative(process.cwd(), file)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newStats.size / 1024 / 1024).toFixed(2)}MB (saved ${(saved / 1024 / 1024).toFixed(2)}MB)`);
      } else {
        fs.unlinkSync(tempFile);
        console.log(`Skipped ${path.relative(process.cwd(), file)} (already optimal)`);
      }
    } catch (err) {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      console.error(`Failed to optimize ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 Optimization Complete!`);
  console.log(`Optimized ${optimizedCount} files.`);
  console.log(`Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
