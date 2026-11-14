import sharp from 'sharp';

async function inspect(imgFile, w, h) {
  const { data, info } = await sharp(imgFile).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  
  // Scan a range of columns around center x to find the lowest y where the teal ring exists
  let lowestY = -1;
  let lowestX = -1;
  const startX = Math.floor(w * 0.3);
  const endX = Math.floor(w * 0.7);

  for (let y = h - 1; y >= 0; y--) {
    for (let x = startX; x <= endX; x++) {
      const idx = (y * w + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Teal ring color check
      if (g > 60 && b > 60 && g > r * 1.4 && b > r * 1.4) {
        if (y > lowestY) {
          lowestY = y;
          lowestX = x;
        }
      }
    }
    if (lowestY !== -1) {
      // found lowest y
      break;
    }
  }

  console.log(`[${imgFile} ${w}x${h}] Lowest teal orbit pixel at (${lowestX}, ${lowestY}). Distance from bottom screen edge: ${h - 1 - lowestY}px`);
}

async function main() {
  await inspect('tests/screenshots/orbit_check_1440x900.png', 1440, 900);
  await inspect('tests/screenshots/orbit_check_1920x1080.png', 1920, 1080);
  await inspect('tests/screenshots/orbit_check_1366x768.png', 1366, 768);
}

main().catch(console.error);
