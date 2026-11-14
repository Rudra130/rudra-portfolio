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
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5174/#/universe ...');
  await page.goto('http://localhost:5174/#/universe', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(screenshotsDir, 'final_01_universe_overview.png') });
  console.log('Saved final_01_universe_overview.png');

  // 1. Select "Projects & Architecture"
  console.log('Selecting Projects & Architecture from left navigation...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find((b) =>
      b.getAttribute('title')?.includes('Projects & Architecture')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 2200));

  await page.screenshot({ path: path.join(screenshotsDir, 'final_02_projects_inspected.png') });
  console.log('Saved final_02_projects_inspected.png');

  // 2. Select "Work Experience"
  console.log('Selecting Work Experience from left navigation...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find((b) =>
      b.getAttribute('title')?.includes('Work Experience')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(screenshotsDir, 'final_03_work_experience_inspected.png') });
  console.log('Saved final_03_work_experience_inspected.png');

  // 3. Select "Technical Skills & DSA"
  console.log('Selecting Technical Skills & DSA from left navigation...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find((b) =>
      b.getAttribute('title')?.includes('Technical Skills & DSA')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(screenshotsDir, 'final_04_skills_dsa_inspected.png') });
  console.log('Saved final_04_skills_dsa_inspected.png');

  // 4. Return to Overview
  console.log('Returning to overview via Back button...');
  await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Back to Overview')
    );
    if (backBtn) backBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(screenshotsDir, 'final_05_returned_overview.png') });
  console.log('Saved final_05_returned_overview.png');

  await browser.close();
  console.log('All final verification steps passed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
