import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5174/portfolio...');
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Click on Ketu in the dock
  console.log('Clicking on Ketu (Philosophy & Reflection)...');
  const ketuBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Philosophy & Reflection')
    );
  });

  if (ketuBtn) {
    await ketuBtn.asElement()?.click();
    console.log('Clicked Ketu, waiting 2.5s for approach animation...');
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: 'tests/screenshots/inspected_ketu_3d.png' });
    console.log('Saved inspected_ketu_3d.png');

    // 2. Click "Back to Overview"
    console.log('Clicking "Back to Overview"...');
    const backBtn = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('header button')).find((b) =>
        b.textContent?.includes('Back to Overview')
      );
    });

    if (backBtn) {
      await backBtn.asElement()?.click();
      console.log('Clicked Back to Overview, waiting 2.5s for return animation...');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: 'tests/screenshots/restored_overview_3d.png' });
      console.log('Saved restored_overview_3d.png');
    } else {
      console.error('Back to Overview button not found!');
    }
  } else {
    console.error('Ketu button not found!');
  }

  await browser.close();
}

run().catch(console.error);
