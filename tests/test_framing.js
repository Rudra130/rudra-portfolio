import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));
const imageSrc = 'C:/Users/rudra/.gemini/antigravity/brain/a806ac2c-3de6-4905-906f-886357213822/.user_uploaded/media_1794676236855_1dde5d8b.jpg';
const imageBase64 = fs.readFileSync(imageSrc).toString('base64');

async function testFraming() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  const configs = [
    // Square variants
    { name: 'sq_01_sx20_sy160_sz536', sx: 20, sy: 160, sw: 536, sh: 536, outW: 600, outH: 600 },
    { name: 'sq_02_sx10_sy150_sz556', sx: 10, sy: 150, sw: 556, sh: 556, outW: 600, outH: 600 },
    { name: 'sq_03_sx25_sy170_sz510', sx: 25, sy: 170, sw: 510, sh: 510, outW: 600, outH: 600 },
    // 4:5 Portrait variants
    { name: 'port_01_sx15_sy150_w540_h675', sx: 15, sy: 150, sw: 540, sh: 675, outW: 600, outH: 750 },
    { name: 'port_02_sx20_sy160_w520_h650', sx: 20, sy: 160, sw: 520, sh: 650, outW: 600, outH: 750 },
    { name: 'port_03_sx0_sy160_w576_h720', sx: 0, sy: 160, sw: 576, sh: 720, outW: 600, outH: 750 },
  ];

  for (const c of configs) {
    const dataUrl = await page.evaluate((b64, crop) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = crop.outW;
          canvas.height = crop.outH;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, crop.outW, crop.outH);
          resolve(canvas.toDataURL('image/jpeg', 0.96));
        };
        img.src = 'data:image/jpeg;base64,' + b64;
      });
    }, imageBase64, c);

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.resolve(`tests/screenshots/${c.name}.jpg`), base64Data, 'base64');
    console.log(`Generated ${c.name}.jpg`);
  }

  await browser.close();
}

testFraming().catch(console.error);
