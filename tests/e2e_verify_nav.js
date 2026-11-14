import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));

if (!chromeExecutable) {
  console.error('Chrome executable not found');
  process.exit(1);
}

const screenshotsDir = path.resolve('tests/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runTest() {
  console.log('Launching browser with Chrome at:', chromeExecutable);
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5174/ ...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Enter Universe / Portfolio
  console.log('Navigating directly into universe via hash #/universe...');
  await page.evaluate(() => {
    window.location.hash = '#/universe';
  });
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Entered Portfolio Universe');

  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, '01_universe_with_left_nav.png') });
  console.log('Saved 01_universe_with_left_nav.png');

  // Verify Left Nav Items
  const navItems = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Portfolio Dimensions Navigation"]');
    if (!aside) return null;
    const buttons = Array.from(aside.querySelectorAll('button[title]'));
    return buttons.map((b) => ({
      title: b.getAttribute('title'),
      text: b.innerText.split('\n')[0],
    }));
  });

  console.log('Detected Left Nav Items:', navItems);

  // 2. Click "Projects & Architecture" in Left Nav
  console.log('Clicking "Projects & Architecture" in Left Nav...');
  await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Portfolio Dimensions Navigation"]');
    const btn = Array.from(aside.querySelectorAll('button')).find((b) =>
      b.getAttribute('title')?.includes('Projects & Architecture')
    );
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '02_approaching_projects.png') });
  console.log('Saved 02_approaching_projects.png');

  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, '03_inspecting_projects_drawer.png') });
  console.log('Saved 03_inspecting_projects_drawer.png');

  // Check header text in drawer
  const drawerHeader = await page.evaluate(() => {
    const h2 = document.querySelector('.glass-panel h2');
    return h2 ? h2.textContent : null;
  });
  console.log('Drawer Header Text:', drawerHeader);

  // 3. Click "Work Experience" directly from left nav while inspecting
  console.log('Clicking "Work Experience" in Left Nav...');
  await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Portfolio Dimensions Navigation"]');
    const btn = Array.from(aside.querySelectorAll('button')).find((b) =>
      b.getAttribute('title')?.includes('Work Experience')
    );
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 2800));
  await page.screenshot({ path: path.join(screenshotsDir, '04_inspecting_work_experience.png') });
  console.log('Saved 04_inspecting_work_experience.png');

  const expHeader = await page.evaluate(() => {
    const h2 = document.querySelector('.glass-panel h2');
    return h2 ? h2.textContent : null;
  });
  console.log('Work Experience Header Text:', expHeader);

  // 4. Return to overview
  console.log('Returning to overview via Escape...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(screenshotsDir, '05_returned_to_overview.png') });
  console.log('Saved 05_returned_to_overview.png');

  await browser.close();
  console.log('All e2e navigation tests completed successfully!');
}

runTest().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
