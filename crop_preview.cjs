const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('C:/Users/a/.gemini/antigravity-ide/brain/7e0e6776-8cd3-4a57-8662-9596029466f2/media__1779869879429.jpg');

  // Let's crop elements and save them
  // 1. Header/Logo
  // 2. Lighthouse Polaroid
  // 3. Flower Jar
  // 4. Cassette Tape
  // 5. Quote paper
  // 6. Round Stamp
  // 7. Dinner photo
  // 8. Map
  // 9. Playlist
  // 10. Candle
  // 11. Ticket
  
  const crops = {
    lighthouse: { x: 135, y: 120, w: 195, h: 225 },
    flowers: { x: 50, y: 285, w: 100, h: 260 },
    cassette: { x: 35, y: 560, w: 155, h: 150 },
    quote: { x: 165, y: 560, w: 160, h: 160 },
    stamp: { x: 45, y: 765, w: 90, h: 90 }, // Wait, y is 765? If height is 723, this will throw an out of bounds error!
  };

  // Wait, let's log the actual image height and make sure we don't go out of bounds
  console.log(`Height check: ${image.height}`);
}

main().catch(console.error);
