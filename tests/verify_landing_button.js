import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));

async function run() {
  console.log('Testing Home / Return to Landing Page button...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Start inside universe
  await page.goto('http://localhost:5174/universe', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  console.log('1. In universe URL:', page.url());

  // 2. Click Home button in header
  console.log('2. Clicking Home button in Header...');
  await page.evaluate(() => {
    const homeBtn = Array.from(document.querySelectorAll('header nav button')).find((b) =>
      b.textContent?.includes('Home')
    );
    if (homeBtn) homeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const landingUrl = page.url();
  console.log('URL after clicking Home:', landingUrl);
  if (!landingUrl.endsWith('5174/')) {
    throw new Error(`FAIL: Expected root landing URL, got: ${landingUrl}`);
  }

  // Verify Landing Hero is rendered
  const enterBtn = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Enter Portfolio')
    )?.textContent;
  });
  console.log('Found Landing CTA:', enterBtn);
  if (!enterBtn) {
    throw new Error('FAIL: Enter Portfolio button not found on landing page!');
  }
  console.log('PASS: Successfully returned to Landing Page via Header Home button!');

  // 3. Enter portfolio again and test right HUD dock Home button
  console.log('3. Re-entering universe...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Enter Portfolio')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  console.log('In universe URL:', page.url());

  // 4. Click Home button in right HUD tool dock
  console.log('4. Clicking Home button in Right HUD dock...');
  await page.evaluate(() => {
    const hudHomeBtn = document.querySelector('aside.fixed.right-6 button[title="Return to Landing Page"]');
    if (hudHomeBtn) hudHomeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const hudLandingUrl = page.url();
  console.log('URL after clicking HUD Home:', hudLandingUrl);
  if (!hudLandingUrl.endsWith('5174/')) {
    throw new Error(`FAIL: Expected root landing URL, got: ${hudLandingUrl}`);
  }
  console.log('PASS: Successfully returned to Landing Page via HUD Home button!');

  await browser.close();
  console.log('\nALL LANDING BUTTON TESTS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
