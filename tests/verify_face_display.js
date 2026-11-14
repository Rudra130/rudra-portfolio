import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));
const screenshotsDir = path.resolve('tests/screenshots');

async function verifyFaceDisplay() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Check Surya Profile Card
  await page.goto('http://localhost:5174/universe/about', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'fixed_face_surya_drawer.png') });
  console.log('Saved fixed_face_surya_drawer.png');

  // 2. Check Landing Hero Avatar
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, 'fixed_face_landing_hero.png') });
  console.log('Saved fixed_face_landing_hero.png');

  // 3. Check 2D Accessible View
  await page.goto('http://localhost:5174/2d', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, 'fixed_face_accessible_2d.png') });
  console.log('Saved fixed_face_accessible_2d.png');

  await browser.close();
  console.log('Verification finished!');
}

verifyFaceDisplay().catch(console.error);
