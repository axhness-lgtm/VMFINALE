const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = 'C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295418404.jpg';
const OUT_DIR = 'c:/Users/a/Downloads/VMFINALE/public/assets/dinner';

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Bounding boxes on the 1024x560 source image
const ASSETS = {
  grid_mat: { x: 634, y: 65, w: 211, h: 104 },
  black_paint_bg: { x: 859, y: 59, w: 59, h: 89 },
  // Region 8 y=187 w=207 h=199 holds both tables.
  // Back table is the top half (y=187 to 280), Front table is the bottom half (y=287 to 380)
  table_back: { x: 631, y: 187, w: 207, h: 93 },
  table_front: { x: 631, y: 285, w: 207, h: 96 },
  cushion: { x: 655, y: 407, w: 90, h: 56 },
  cushion_shadow: { x: 769, y: 417, w: 54, h: 22 }
};

// Helper: check if a pixel color is "background-like" (cream, light gray, white checkerboard)
function isBgColor(r, g, b) {
  // Checkered pattern/cream background color range
  return r > 210 && g > 195 && b > 170;
}

function colorToInt(r, g, b, a) {
  // Return unsigned 32-bit int representation of RGBA
  return (((r & 0xff) << 24) | ((g & 0xff) << 16) | ((b & 0xff) << 8) | (a & 0xff)) >>> 0;
}

async function processAsset(name, box, image) {
  console.log(`Processing ${name}...`);
  // Crop the sub-image
  const cropped = image.clone().crop({ x: box.x, y: box.y, w: box.w, h: box.h });
  const w = cropped.width;
  const h = cropped.height;

  // We need to convert it to a PNG with transparency
  // If we are processing the shadow, we use a special shadow alpha extractor
  if (name === 'cushion_shadow') {
    // For shadow: the background is cream (approx R=242, G=229, B=211).
    // The shadow is darker. We set the color to black (0,0,0) and the alpha to the density of the shadow.
    const bgR = 242, bgG = 229, bgB = 211;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pixel = cropped.getPixelColor(x, y);
        const r = (pixel >> 24) & 0xff;
        const g = (pixel >> 16) & 0xff;
        const b = (pixel >> 8) & 0xff;

        // How dark is the pixel compared to the background?
        const diffR = Math.max(0, bgR - r);
        const diffG = Math.max(0, bgG - g);
        const diffB = Math.max(0, bgB - b);
        
        // Calculate average darkness intensity
        const intensity = (diffR + diffG + diffB) / 3;
        
        // Scale it so the shadow looks nice and smooth (max opacity ~ 0.5)
        const alpha = Math.min(255, Math.round(intensity * 2.5));
        
        if (alpha > 10) {
          // Set to black with calculated alpha
          const newColor = colorToInt(0, 0, 0, alpha);
          cropped.setPixelColor(newColor, x, y);
        } else {
          // Fully transparent
          cropped.setPixelColor(colorToInt(0, 0, 0, 0), x, y);
        }
      }
    }
  } else {
    // For other assets: use boundary flood fill to trace the checkerboard background
    const visited = Array(h).fill(0).map(() => Array(w).fill(false));
    const queue = [];

    // Push all border pixels to the queue
    for (let x = 0; x < w; x++) {
      queue.push({ x, y: 0 });
      queue.push({ x, y: h - 1 });
      visited[0][x] = true;
      visited[h - 1][x] = true;
    }
    for (let y = 0; y < h; y++) {
      queue.push({ x: 0, y });
      queue.push({ x: w - 1, y });
      visited[y][0] = true;
      visited[y][w - 1] = true;
    }

    const bgPixelsToClear = [];

    while (queue.length > 0) {
      const curr = queue.shift();
      const pixel = cropped.getPixelColor(curr.x, curr.y);
      const r = (pixel >> 24) & 0xff;
      const g = (pixel >> 16) & 0xff;
      const b = (pixel >> 8) & 0xff;

      if (isBgColor(r, g, b)) {
        bgPixelsToClear.push(curr);

        // Check 4-connected neighbors
        const neighbors = [
          { x: curr.x + 1, y: curr.y },
          { x: curr.x - 1, y: curr.y },
          { x: curr.x, y: curr.y + 1 },
          { x: curr.x, y: curr.y - 1 }
        ];

        for (const n of neighbors) {
          if (n.x >= 0 && n.x < w && n.y >= 0 && n.y < h) {
            if (!visited[n.y][n.x]) {
              visited[n.y][n.x] = true;
              queue.push(n);
            }
          }
        }
      }
    }

    // Set all background pixels to fully transparent
    for (const p of bgPixelsToClear) {
      cropped.setPixelColor(colorToInt(0, 0, 0, 0), p.x, p.y);
    }
  }

  // Write out the processed image as transparent PNG
  const outPath = path.join(OUT_DIR, `${name}.png`);
  await cropped.write(outPath);
  console.log(`Saved transparent asset to ${outPath}`);
}

async function main() {
  const image = await Jimp.read(SOURCE_IMAGE);
  for (const [name, box] of Object.entries(ASSETS)) {
    await processAsset(name, box, image);
  }
  console.log("All assets processed successfully!");
}

main().catch(console.error);
