const { Jimp } = require('jimp');

async function main() {
  const images = [
    'C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780294825733.jpg',
    'C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295406137.jpg',
    'C:/Users/a/.gemini/antigravity-ide/brain/a5d0f672-804c-4b30-8d0b-df26f2992faa/media__1780295418404.jpg'
  ];
  for (const imgPath of images) {
    const image = await Jimp.read(imgPath);
    console.log(`${imgPath.split('/').pop()}: ${image.width}x${image.height}`);
  }
}

main().catch(console.error);
