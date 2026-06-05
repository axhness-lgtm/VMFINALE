const { Jimp } = require('jimp');

Jimp.read('public/images/arch_circles_ref.jpg').then(image => {
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  console.log(`Image size: ${width}x${height}`);
  
  // Sample cream background color at (512, 10)
  const bgPixel = image.getPixelColor(512, 10);
  const bgRgba = Jimp.intToRGBA(bgPixel);
  console.log('Reference BG (Cream):', bgRgba);
  
  // Let's generate a 80x40 ASCII map
  const cols = 80;
  const rows = 40;
  let out = '';
  
  for (let r = 0; r < rows; r++) {
    const y = Math.round((r / (rows - 1)) * (height - 1));
    for (let c = 0; c < cols; c++) {
      const x = Math.round((c / (cols - 1)) * (width - 1));
      const pixel = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);
      
      const dist = Math.sqrt(
        Math.pow(rgba.r - bgRgba.r, 2) +
        Math.pow(rgba.g - bgRgba.g, 2) +
        Math.pow(rgba.b - bgRgba.b, 2)
      );
      
      if (dist > 25) {
        out += 'X';
      } else {
        out += '.';
      }
    }
    out += '\n';
  }
  
  console.log(out);
}).catch(err => {
  console.error(err);
});
