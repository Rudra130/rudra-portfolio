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

async function analyze() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <canvas id="c"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);

  const res = await page.evaluate((b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = 'data:image/jpeg;base64,' + b64;
    });
  }, imageBase64);

  console.log('Original image dimensions:', res);
  await browser.close();
}

analyze().catch(console.error);
