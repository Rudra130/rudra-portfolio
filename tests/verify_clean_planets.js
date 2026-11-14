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

async function testCleanPlanets() {
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5174/universe', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'clean_planets_overview.png') });
  console.log('Saved clean_planets_overview.png');

  // Also verify that no .select-none Html divs exist in 3d canvas
  const labelsCount = await page.evaluate(() => {
    return document.querySelectorAll('div.select-none.transition-all').length;
  });
  console.log('Floating 3D labels count:', labelsCount);
  if (labelsCount !== 0) {
    throw new Error(`FAIL: Found ${labelsCount} floating labels!`);
  }
  console.log('PASS: 0 floating labels over planets verified!');

  await browser.close();
}

testCleanPlanets().catch(console.error);
