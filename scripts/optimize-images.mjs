import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectImages(dir) {
  if (!(await exists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectImages(entryPath);
      }

      if (entry.isFile() && INPUT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        return [entryPath];
      }

      return [];
    }),
  );

  return images.flat();
}

async function shouldConvert(inputPath, outputPath) {
  try {
    const [input, output] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
    return input.mtimeMs > output.mtimeMs;
  } catch {
    return true;
  }
}

async function main() {
  const images = await collectImages(ASSETS_DIR);
  let converted = 0;
  let skipped = 0;

  await Promise.all(
    images.map(async (inputPath) => {
      const { dir, name } = path.parse(inputPath);
      const outputPath = path.join(dir, `${name}.webp`);

      if (!(await shouldConvert(inputPath, outputPath))) {
        skipped += 1;
        return;
      }

      await sharp(inputPath).webp({ quality: 85, effort: 6 }).toFile(outputPath);
      converted += 1;
    }),
  );

  console.log(`Optimized images: ${converted} converted, ${skipped} already current.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
