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

async function savePerfectPortrait() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  // Optimal framing: sx: 15, sy: 150, sw: 540, sh: 675 (4:5 portrait)
  // Perfectly captures entire head, hair headroom, both ears, full chin/beard, neck and collar
  const crop = { sx: 15, sy: 150, sw: 540, sh: 675, outW: 800, outH: 1000 };

  const jpgBase64 = await page.evaluate((b64, c) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = c.outW;
        canvas.height = c.outH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, c.outW, c.outH);
        resolve(canvas.toDataURL('image/jpeg', 0.98));
      };
      img.src = 'data:image/jpeg;base64,' + b64;
    });
  }, imageBase64, crop);

  const webpBase64 = await page.evaluate((b64, c) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = c.outW;
        canvas.height = c.outH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, c.outW, c.outH);
        resolve(canvas.toDataURL('image/webp', 0.98));
      };
      img.src = 'data:image/jpeg;base64,' + b64;
    });
  }, imageBase64, crop);

  const jpgBuffer = Buffer.from(jpgBase64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  const webpBuffer = Buffer.from(webpBase64.replace(/^data:image\/webp;base64,/, ''), 'base64');

  const targetDirs = [
    'public/assets/user-photos/profile',
    'public/assets/user-photos/personal',
    'assets/user-photos/profile',
    'assets/user-photos/personal',
  ];

  for (const dir of targetDirs) {
    fs.mkdirSync(path.resolve(dir), { recursive: true });
    const baseName = dir.includes('personal') ? 'profile-personal' : 'profile-main';
    fs.writeFileSync(path.resolve(dir, `${baseName}.jpg`), jpgBuffer);
    fs.writeFileSync(path.resolve(dir, `${baseName}.webp`), webpBuffer);
    console.log(`Saved ${dir}/${baseName}.jpg & .webp`);
  }

  await browser.close();
  console.log('All portrait assets saved successfully!');
}

savePerfectPortrait().catch(console.error);
