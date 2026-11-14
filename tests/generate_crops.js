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

async function generateCrops() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  const crops = [
    { name: 'crop_A_sx70_sy200_sz460', sx: 70, sy: 200, sz: 460 },
    { name: 'crop_B_sx85_sy210_sz440', sx: 85, sy: 210, sz: 440 },
    { name: 'crop_C_sx60_sy180_sz480', sx: 60, sy: 180, sz: 480 },
    { name: 'crop_D_sx95_sy220_sz420', sx: 95, sy: 220, sz: 420 },
  ];

  for (const c of crops) {
    const dataUrl = await page.evaluate((b64, crop) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 600;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, crop.sx, crop.sy, crop.sz, crop.sz, 0, 0, 600, 600);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = 'data:image/jpeg;base64,' + b64;
      });
    }, imageBase64, c);

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.resolve(`tests/screenshots/${c.name}.jpg`), base64Data, 'base64');
    console.log(`Generated tests/screenshots/${c.name}.jpg`);
  }

  await browser.close();
}

generateCrops().catch(console.error);
