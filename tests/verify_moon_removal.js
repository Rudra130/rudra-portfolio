import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));
const screenshotsDir = path.resolve('tests/screenshots');

async function run() {
  console.log('Starting verification of Moon (Chandra) removal...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Check Portfolio View
  console.log('1. Checking /portfolio left dock items...');
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  const dockCheck = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const dockButtons = Array.from(document.querySelectorAll('aside nav button'));
    const titles = dockButtons.map((b) => b.getAttribute('title') || b.textContent || '');
    const hasChandraInDock = titles.some((t) => t.includes('Personal Life') || t.includes('Chandra'));
    const hasMoonSymbol = text.includes('☾');
    return {
      dockButtonCount: dockButtons.length,
      titles,
      hasChandraInDock,
      hasMoonSymbol,
    };
  });

  console.log('Dock Check:', dockCheck);
  await page.screenshot({ path: path.join(screenshotsDir, 'portfolio_without_moon.png') });
  console.log('Saved portfolio_without_moon.png');

  if (dockCheck.hasChandraInDock) {
    throw new Error('FAIL: Chandra / Personal Life still found in dock!');
  }
  if (dockCheck.hasMoonSymbol) {
    throw new Error('FAIL: Moon symbol ☾ still found in UI!');
  }
  console.log('PASS: Moon (Chandra) completely absent from /portfolio!');

  // 2. Check 2D Accessible Portfolio View
  console.log('2. Checking 2D Accessible Portfolio View...');
  await page.goto('http://localhost:5174/2d', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const accessibleCheck = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasChandraText: text.includes('Personal Life & Memories') || text.includes('Chandra'),
      hasMoonSymbol: text.includes('☾'),
    };
  });

  console.log('Accessible 2D Check:', accessibleCheck);
  await page.screenshot({ path: path.join(screenshotsDir, 'accessible_2d_without_moon.png') });
  console.log('Saved accessible_2d_without_moon.png');

  if (accessibleCheck.hasChandraText || accessibleCheck.hasMoonSymbol) {
    throw new Error('FAIL: Moon (Chandra) still present in 2D view!');
  }
  console.log('PASS: Moon (Chandra) completely absent from 2D view!');

  await browser.close();
  console.log('ALL MOON REMOVAL CHECKS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
