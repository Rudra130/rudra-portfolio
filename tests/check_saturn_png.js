import zlib from 'zlib';
import fs from 'fs';

const buf = fs.readFileSync('public/textures/planets/saturn_ring_alpha.png');
const idats = [];
let offset = 8;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IDAT') {
    idats.push(buf.slice(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
}
const compressed = Buffer.concat(idats);
const decompressed = zlib.inflateSync(compressed);

console.log('Decompressed bytes:', decompressed.length);
let maxAlpha = 0;
let nonZeroCount = 0;
for (let i = 0; i < decompressed.length; i += 4) {
  const a = decompressed[i + 3];
  if (a > maxAlpha) maxAlpha = a;
  if (a > 0) nonZeroCount++;
}
console.log('Max Alpha in file:', maxAlpha, 'Non-zero alpha pixels:', nonZeroCount, 'out of', 2048 * 125);
