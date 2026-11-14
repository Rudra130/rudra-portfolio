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
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5174/portfolio...');
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2500));

  await page.screenshot({ path: 'tests/screenshots/orbit_check_1440x900.png' });
  console.log('Saved 1440x900 screenshot');

  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'tests/screenshots/orbit_check_1920x1080.png' });
  console.log('Saved 1920x1080 screenshot');

  await page.setViewport({ width: 1366, height: 768 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'tests/screenshots/orbit_check_1366x768.png' });
  console.log('Saved 1366x768 screenshot');

  await browser.close();
}

run().catch(console.error);
