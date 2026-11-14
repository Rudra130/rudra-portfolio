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

async function testFullWidthCrops() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  const crops = [
    { name: 'bust_01_sy140', sx: 0, sy: 140, sz: 576 },
    { name: 'bust_02_sy160', sx: 0, sy: 160, sz: 576 },
    { name: 'bust_03_sy180', sx: 0, sy: 180, sz: 576 },
    { name: 'bust_04_sy200', sx: 0, sy: 200, sz: 576 },
    { name: 'bust_05_aspect_4_5', sx: 0, sy: 160, sw: 576, sh: 720 },
  ];

  for (const c of crops) {
    const sw = c.sw || c.sz;
    const sh = c.sh || c.sz;
    const outW = 800;
    const outH = Math.round((sh / sw) * 800);

    const dataUrl = await page.evaluate((b64, crop, outW, outH, sw, sh) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, crop.sx, crop.sy, sw, sh, 0, 0, outW, outH);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = 'data:image/jpeg;base64,' + b64;
      });
    }, imageBase64, c, outW, outH, sw, sh);

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.resolve(`tests/screenshots/${c.name}.jpg`), base64Data, 'base64');
    console.log(`Generated tests/screenshots/${c.name}.jpg`);
  }

  await browser.close();
}

testFullWidthCrops().catch(console.error);
