import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs-extra';

async function generateIcons() {
  const sizes = [16, 48, 128];
  const srcPath = path.join(process.cwd(), 'src', 'extension', 'icons', 'logo.png');
  const destDir = path.join(process.cwd(), 'dist', 'icons');

  // Ensure the destination directory exists
  await fs.ensureDir(destDir);

  // Generate each size
  for (const size of sizes) {
    const destPath = path.join(destDir, `logo-${size}.png`);
    
    await sharp(srcPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(destPath);
      
    console.log(`Generated ${size}x${size} icon: ${destPath}`);
  }

  // Also copy the original logo
  await fs.copy(srcPath, path.join(destDir, 'logo.png'));
  console.log('Icon generation complete!');
}

generateIcons().catch(console.error); 