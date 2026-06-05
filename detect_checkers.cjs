const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295418404.jpg');
  const width = image.width;
  
  // Let's print the RGB values at y = 150 from x = 600 to 700 to understand the colors
  console.log("RGB values at y = 150:");
  for (let x = 600; x < 700; x += 5) {
    const pixel = image.getPixelColor(x, 150);
    const r = (pixel >> 24) & 0xff;
    const g = (pixel >> 16) & 0xff;
    const b = (pixel >> 8) & 0xff;
    console.log(`x=${x}: R=${r}, G=${g}, B=${b}`);
  }
}

main().catch(console.error);
