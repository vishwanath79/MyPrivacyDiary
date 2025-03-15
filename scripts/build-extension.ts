import * as esbuild from 'esbuild'
import * as fs from 'fs-extra'
import * as path from 'path'
import sharp from 'sharp';

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

async function build() {
  try {
    const distDir = path.join(process.cwd(), 'dist')
    const srcDir = path.join(process.cwd(), 'src', 'extension')

    // Clean and create dist directory
    await fs.emptyDir(distDir)

    // Generate icons
    await generateIcons();

    // Copy static files
    const staticFiles = [
      'popup.html',
      'popup.css',
      'manifest.json',
      'popup.js' // Add popup.js as a static file since it's not TypeScript
    ]

    for (const file of staticFiles) {
      const srcPath = path.join(srcDir, file)
      const destPath = path.join(distDir, file)
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath)
      } else {
        console.warn(`Warning: ${file} not found in src directory`)
      }
    }

    // Build background script
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'background.ts')],
      bundle: true,
      outfile: path.join(distDir, 'background.js'),
      platform: 'browser',
      target: 'es2020',
      format: 'iife', // Change to IIFE for better compatibility
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.GEMINI_API_KEY': `"${process.env.GEMINI_API_KEY}"`,
      },
      minify: false, // Disable minification for easier debugging
      sourcemap: true,
    })

    console.log('Build complete! Extension files are in the dist directory.')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build() 