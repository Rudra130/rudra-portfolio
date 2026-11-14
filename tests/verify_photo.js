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

async function testPhoto() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Landing Hero
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotsDir, 'photo_01_landing_hero.png') });
  console.log('Saved photo_01_landing_hero.png');

  // 2. Surya Profile Card in Universe
  await page.goto('http://localhost:5174/#/world/surya', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(screenshotsDir, 'photo_02_surya_profile_drawer.png') });
  console.log('Saved photo_02_surya_profile_drawer.png');

  // 3. Accessible 2D Portfolio View
  await page.evaluate(() => {
    window.location.hash = '#/2d';
  });
  // Or click 2D view if hash not wired for 2d
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Accessible 2D')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, 'photo_03_accessible_2d.png') });
  console.log('Saved photo_03_accessible_2d.png');

  await browser.close();
  console.log('Photo verification done!');
}

testPhoto().catch(console.error);
