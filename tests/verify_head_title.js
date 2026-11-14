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
  console.log('Verifying document title and header title in Chrome...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const pageTitle = await page.title();
  console.log('Document title:', pageTitle);

  const headerSubtitle = await page.evaluate(() => {
    const el = document.querySelector('header span.text-\\[11px\\]');
    return el ? el.textContent.trim() : null;
  });
  console.log('Header subtitle:', headerSubtitle);

  await browser.close();

  if (pageTitle !== 'Rudra Tiwari - Cosmic portfolio') {
    throw new Error(`Expected title 'Rudra Tiwari - Cosmic portfolio', but got '${pageTitle}'`);
  }
  if (!headerSubtitle || !headerSubtitle.toLowerCase().includes('cosmic portfolio')) {
    throw new Error(`Expected header subtitle to contain 'Cosmic Portfolio', but got '${headerSubtitle}'`);
  }

  console.log('SUCCESS: Page title and header verified cleanly!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
