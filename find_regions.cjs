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
    b: (bgPixel >> 8) & 0xff,
    a: bgPixel & 0xff
  };
  console.log(`Background RGBA: R=${bg.r}, G=${bg.g}, B=${bg.b}`);

  // Let's print an ASCII map of the right side (from x = 600 to 1024)
  const startX = 600;
  const cols = 80;
  const rows = 40;
  let out = '';

  for (let r = 0; r < rows; r++) {
    const y = Math.round((r / (rows - 1)) * (height - 1));
    for (let c = 0; c < cols; c++) {
      const x = startX + Math.round((c / (cols - 1)) * (width - 1 - startX));
      const pixel = image.getPixelColor(x, y);
      const rgba = {
        r: (pixel >> 24) & 0xff,
        g: (pixel >> 16) & 0xff,
        b: (pixel >> 8) & 0xff,
        a: pixel & 0xff
      };
      
      const dist = Math.sqrt(
        Math.pow(rgba.r - bg.r, 2) +
        Math.pow(rgba.g - bg.g, 2) +
        Math.pow(rgba.b - bg.b, 2)
      );
      
      if (dist > 30) {
        out += '#';
      } else {
        out += '.';
      }
    }
    out += '\n';
  }
  console.log(out);
}

main().catch(console.error);
