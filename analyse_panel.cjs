const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295418404.jpg');
  
  // Sample pixels in Region 17 (x=655 to 745, y=407 to 463)
  // Let's sample a 10x10 area at the top-left of the panel (x=656 to 666, y=408 to 418)
  console.log("Region 17 Top-Left colors (should be checkers):");
  for (let y = 408; y < 418; y++) {
    let line = '';
    for (let x = 656; x < 666; x++) {
      const pixel = image.getPixelColor(x, y);
      const r = (pixel >> 24) & 0xff;
      const g = (pixel >> 16) & 0xff;
      const b = (pixel >> 8) & 0xff;
      line += `(${r},${g},${b}) `;
    }
    console.log(line);
  }
}

main().catch(console.error);
