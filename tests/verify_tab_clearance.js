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
  console.log('Starting verification of vertical tab clearance...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Navigate to Surya (Core Identity / About)
  console.log('1. Navigating to http://localhost:5174/portfolio/about...');
  await page.goto('http://localhost:5174/portfolio/about', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  // 2. Compute bounding boxes
  const metrics = await page.evaluate(() => {
    const brand = document.querySelector('header .group');
    const brandRect = brand ? brand.getBoundingClientRect() : null;

    const backBtn = Array.from(document.querySelectorAll('header button')).find((b) =>
      b.textContent?.includes('Back to Overview')
    );
    const backBtnRect = backBtn ? backBtn.getBoundingClientRect() : null;

    const dock = document.querySelector('aside');
    const dockRect = dock ? dock.getBoundingClientRect() : null;

    const overlaps = (r1, r2) => {
      if (!r1 || !r2) return false;
      return !(r1.right <= r2.left || r1.left >= r2.right || r1.bottom <= r2.top || r1.top >= r2.bottom);
    };

    return {
      brand: brandRect ? { top: brandRect.top, bottom: brandRect.bottom, left: brandRect.left, right: brandRect.right } : null,
      backBtn: backBtnRect ? { top: backBtnRect.top, bottom: backBtnRect.bottom, left: backBtnRect.left, right: backBtnRect.right } : null,
      dock: dockRect ? { top: dockRect.top, bottom: dockRect.bottom, left: dockRect.left, right: dockRect.right } : null,
      btnOverlapsDock: overlaps(backBtnRect, dockRect),
      btnOverlapsBrand: overlaps(backBtnRect, brandRect),
      verticalGapBtnToDock: dockRect && backBtnRect ? dockRect.top - backBtnRect.bottom : null,
    };
  });

  console.log('Metrics Check:', JSON.stringify(metrics, null, 2));

  // Capture close up of top left (width 500, height 500)
  await page.screenshot({
    path: path.join(screenshotsDir, 'tab_clearance_top_left.png'),
    clip: { x: 0, y: 0, width: 500, height: 500 },
  });
  console.log('Saved tab_clearance_top_left.png');

  await page.screenshot({
    path: path.join(screenshotsDir, 'tab_clearance_fullscreen.png'),
  });
  console.log('Saved tab_clearance_fullscreen.png');

  // Test clicking Back to Overview
  console.log('2. Clicking Back to Overview...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find((b) =>
      b.textContent?.includes('Back to Overview')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const overviewUrl = page.url();
  console.log('URL after Back to Overview click:', overviewUrl);

  await browser.close();

  if (metrics.btnOverlapsDock) {
    throw new Error('FAIL: Back to Overview button overlaps vertical dock!');
  }
  if (metrics.btnOverlapsBrand) {
    throw new Error('FAIL: Back to Overview button overlaps profile brand!');
  }
  if (metrics.verticalGapBtnToDock < 50) {
    throw new Error(`FAIL: Vertical gap too small: ${metrics.verticalGapBtnToDock}px`);
  }

  console.log('SUCCESS: Vertical tab clearance verified with flawless spacing!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
