const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295418404.jpg');
  const width = image.width;
  const height = image.height;

  // Let's sample the background color from the very top-left (0,0)
  const bgPixel = image.getPixelColor(10, 10);
  const bg = {
    r: (bgPixel >> 24) & 0xff,
    g: (bgPixel >> 16) & 0xff,
    b: (bgPixel >> 8) & 0xff
  };
  console.log(`Reference BG Color: R=${bg.r}, G=${bg.g}, B=${bg.b}`);

  // Create a grid of x,y representing if it is "content" (distance > 30 from background)
  const isContent = Array(height).fill(0).map(() => Array(width).fill(false));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = image.getPixelColor(x, y);
      const r = (pixel >> 24) & 0xff;
      const g = (pixel >> 16) & 0xff;
      const b = (pixel >> 8) & 0xff;

      const dist = Math.sqrt(
        Math.pow(r - bg.r, 2) +
        Math.pow(g - bg.g, 2) +
        Math.pow(b - bg.b, 2)
      );

      // If it is different from background, mark as content
      if (dist > 30) {
        isContent[y][x] = true;
      }
    }
  }

  // Find contiguous regions of content using a simple flood fill / labeling algorithm
  const visited = Array(height).fill(0).map(() => Array(width).fill(false));
  const regions = [];

  for (let y = 0; y < height; y++) {
    for (let x = 600; x < width; x++) { // Focus on right side (assets column)
      if (isContent[y][x] && !visited[y][x]) {
        // Start BFS to trace this content region
        const queue = [{ x, y }];
        visited[y][x] = true;
        let minX = x, maxX = x, minY = y, maxY = y;

        while (queue.length > 0) {
          const curr = queue.shift();
          // Check 8-connected neighbors
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = curr.x + dx;
              const ny = curr.y + dy;

              if (nx >= 600 && nx < width && ny >= 0 && ny < height) {
                if (isContent[ny][nx] && !visited[ny][nx]) {
                  visited[ny][nx] = true;
                  queue.push({ x: nx, y: ny });
                  if (nx < minX) minX = nx;
                  if (nx > maxX) maxX = nx;
                  if (ny < minY) minY = ny;
                  if (ny > maxY) maxY = ny;
                }
              }
            }
          }
        }

        const w = maxX - minX + 1;
        const h = maxY - minY + 1;
        // Filter out small noise (lines, text labels, dots)
        if (w > 15 && h > 15) {
          regions.push({ x: minX, y: minY, w, h });
        }
      }
    }
  }

  console.log(`Detected ${regions.length} major content regions on the right side:`);
  regions.sort((a, b) => a.y - b.y || a.x - b.x); // Sort top-to-bottom, left-to-right
  regions.forEach((r, idx) => {
    console.log(`Region ${idx + 1}: x=${r.x}, y=${r.y}, w=${r.w}, h=${r.h}`);
  });
}

main().catch(console.error);
