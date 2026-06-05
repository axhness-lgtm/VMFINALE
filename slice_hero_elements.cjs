const { Jimp } = require('jimp');
const path = require('path');

async function main() {
  const image = await Jimp.read('C:/Users/a/.gemini/antigravity-ide/brain/7e0e6776-8cd3-4a57-8662-9596029466f2/media__1779869879429.jpg');
  const outDir = 'c:/Users/a/Downloads/VMFINALE/public/assets';

  const crops = {
    // 1. Polaroid Lighthouse (Top Left)
    lighthouse: { x: 135, y: 120, w: 195, h: 225 },
    // 2. Vase with Yellow Flowers (Left)
    flowers: { x: 45, y: 280, w: 110, h: 270 },
    // 3. Cassette Tape (Bottom Left)
    cassette: { x: 40, y: 550, w: 155, h: 155 },
    // 4. Quote Paper (Bottom Left-ish)
    quote: { x: 175, y: 550, w: 155, h: 165 },
    // 5. Round Stamp (Vizagapatnam India)
    stamp: { x: 45, y: 760, w: 90, h: 90 }, // We will check if it's out of bounds and log
    // 6. Giant Bubbly Wordmark
    wordmark: { x: 140, y: 200, w: 730, h: 170 },
    // 7. Taped Dinner Photo (Center)
    dinner: { x: 330, y: 360, w: 350, h: 200 },
    // 8. Map with Star (Bottom Center)
    map: { x: 300, y: 530, w: 290, h: 180 },
    // 9. Playlist (Bottom Right)
    playlist: { x: 600, y: 550, w: 150, h: 170 },
    // 10. Lit Candle (Right)
    candle: { x: 700, y: 490, w: 100, h: 110 },
    // 11. Ticket 17 (Top Right)
    ticket: { x: 780, y: 230, w: 210, h: 110 },
  };

  for (const [name, box] of Object.entries(crops)) {
    try {
      // Validate bounds
      if (box.x < 0 || box.y < 0 || box.x + box.w > image.width || box.y + box.h > image.height) {
        console.warn(`WARNING: ${name} is out of bounds (box: x=${box.x}, y=${box.y}, w=${box.w}, h=${box.h}, image: ${image.width}x${image.height})`);
        // Adjust Y to fit image if Y is the only out-of-bounds component
        if (box.y + box.h > image.height) {
          box.y = image.height - box.h;
          console.warn(`ADJUSTED: ${name} Y coordinate adjusted to ${box.y} to stay within bounds.`);
        }
      }
      
      const cropped = image.clone().crop({ x: box.x, y: box.y, w: box.w, h: box.h });
      await cropped.write(path.join(outDir, `hero_${name}.png`));
      console.log(`Saved ${name} to hero_${name}.png`);
    } catch (err) {
      console.error(`Failed to crop ${name}:`, err);
    }
  }
}

main().catch(console.error);
