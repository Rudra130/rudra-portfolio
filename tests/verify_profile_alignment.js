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

async function run() {
  console.log('Starting visual verification of profile alignment...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Navigate to Surya (Core Identity / About)
  console.log('1. Navigating to http://localhost:5174/portfolio/about...');
  await page.goto('http://localhost:5174/portfolio/about', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2500));

  // Check positions of Profile Brand vs Back to Overview button
  const layoutMetrics = await page.evaluate(() => {
    const brand = document.querySelector('header div');
    const brandRect = brand ? brand.getBoundingClientRect() : null;

    const backBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent && b.textContent.includes('Back to Overview')
    );
    const backBtnRect = backBtn ? backBtn.getBoundingClientRect() : null;

    return {
      brand: brandRect ? { top: brandRect.top, bottom: brandRect.bottom, left: brandRect.left, right: brandRect.right, height: brandRect.height } : null,
      backBtn: backBtnRect ? { top: backBtnRect.top, bottom: backBtnRect.bottom, left: backBtnRect.left, right: backBtnRect.right, height: backBtnRect.height } : null,
      overlaps: brandRect && backBtnRect ? !(brandRect.bottom <= backBtnRect.top || brandRect.top >= backBtnRect.bottom || brandRect.right <= backBtnRect.left || brandRect.left >= backBtnRect.right) : false
    };
  });

  console.log('Layout Metrics:', JSON.stringify(layoutMetrics, null, 2));

  // Capture full screen and top-left close up
  const screenshotsDir = path.join(__dirname, 'screenshots');
  await page.screenshot({ path: path.join(screenshotsDir, 'profile_alignment_fullscreen.png') });
  
  // Clip top-left area (350x250)
  await page.screenshot({
    path: path.join(screenshotsDir, 'profile_alignment_top_left.png'),
    clip: { x: 0, y: 0, width: 450, height: 200 }
  });

  console.log('Saved profile_alignment_fullscreen.png and profile_alignment_top_left.png');

  // Test clicking Back to Overview
  console.log('2. Clicking Back to Overview button...');
  await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent && b.textContent.includes('Back to Overview')
    );
    if (backBtn) backBtn.click();
  });

  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, 'returned_to_universe_view.png') });
  console.log('Saved returned_to_universe_view.png');

  await browser.close();

  if (layoutMetrics.overlaps) {
    throw new Error('FAIL: Back button still overlaps with profile brand!');
  } else {
    console.log('SUCCESS: No overlap detected! Profile brand is completely unobstructed.');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
