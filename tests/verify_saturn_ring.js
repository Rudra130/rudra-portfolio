import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));

async function run() {
  console.log('Verifying Saturn ring visibility...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Capture overview with Saturn rings visible
  await page.screenshot({ path: 'tests/screenshots/saturn_ring_overview.png' });
  console.log('Saved saturn_ring_overview.png');

  // 2. Select Saturn to inspect up-close
  console.log('Clicking Saturn (Work Experience)...');
  const saturnBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find((b) =>
      b.getAttribute('aria-label') === 'Work Experience' ||
      b.textContent?.includes('Work Experience')
    );
  });

  if (saturnBtn) {
    await saturnBtn.asElement()?.click();
    console.log('Waiting for camera zoom to Saturn...');
    await new Promise((r) => setTimeout(r, 2500));

    await page.screenshot({ path: 'tests/screenshots/saturn_ring_inspected.png' });
    console.log('Saved saturn_ring_inspected.png');
  } else {
    console.error('Saturn button not found!');
  }

  await browser.close();
  console.log('Done verifying Saturn ring.');
}

run().catch(console.error);
