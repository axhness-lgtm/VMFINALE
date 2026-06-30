import fs from 'fs';
import { PNG } from 'pngjs';

const files = ['edge.png', 'edge2.png', 'edge3.png', 'edge4.png', 'edge5.png', 'edge6.png'];

files.forEach((file) => {
  const filePath = `./public/${file}`;
  fs.createReadStream(filePath)
    .pipe(new PNG())
    .on('parsed', function() {
      let minX = this.width, maxX = 0, minY = this.height, maxY = 0;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          if (this.data[idx + 3] > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX >= minX && maxY >= minY) {
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        const dst = new PNG({ width: cropW, height: cropH });
        this.bitblt(dst, minX, minY, cropW, cropH, 0, 0);
        dst.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
          console.log(`✅ Cropped ${file} from ${this.width}x${this.height} down to exact bounds ${cropW}x${cropH} (minX:${minX}, minY:${minY})`);
        });
      }
    });
});
