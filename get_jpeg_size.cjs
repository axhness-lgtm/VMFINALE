const fs = require('fs');

const getJpegSize = (filePath) => {
  const buf = fs.readFileSync(filePath);
  let i = 2; // skip FFD8
  while (i < buf.length) {
    if (buf[i] === 0xFF) {
      const marker = buf[i + 1];
      // Start of Frame markers: C0, C1, C2, C3, C5, C6, C7, C9, CA, CB, CD, CE, CF
      if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
        const height = buf.readUInt16BE(i + 5);
        const width = buf.readUInt16BE(i + 7);
        return { width, height };
      }
      // Skip segment
      const segmentLength = buf.readUInt16BE(i + 2);
      i += 2 + segmentLength;
    } else {
      i++;
    }
  }
  throw new Error('Not a valid JPEG or SOF marker not found');
};

console.log(getJpegSize('public/images/arch_circles_ref.jpg'));
