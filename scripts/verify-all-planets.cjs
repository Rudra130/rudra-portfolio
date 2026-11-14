const puppeteer = require('puppeteer-core');
const path = require('path');

async function verifyAll() {
  console.log('🌌 Starting Verification of Worlds, Clicks, and Returns...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=default'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Surya
  console.log('1. Checking Surya (Sun)...');
  await page.goto('http://localhost:5174/#/world/surya');
  await new Promise((r) => setTimeout(r, 2600));
  const suryaState = await page.evaluate(() => ({
    drawer: !!document.querySelector('.glass-panel'),
    title: document.querySelector('.glass-panel h2')?.innerText,
  }));
  console.log('   Surya:', suryaState);
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/verify-01-surya.png') });

  // 2. Mangal
  console.log('2. Checking Mangal (Mars)...');
  await page.goto('http://localhost:5174/#/world/mangal');
  await new Promise((r) => setTimeout(r, 2600));
  const mangalState = await page.evaluate(() => ({
    drawer: !!document.querySelector('.glass-panel'),
    title: document.querySelector('.glass-panel h2')?.innerText,
    cards: document.querySelectorAll('.glass-card').length,
  }));
  console.log('   Mangal:', mangalState);
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/verify-02-mangal.png') });

  // 3. Shani
  console.log('3. Checking Shani (Saturn)...');
  await page.goto('http://localhost:5174/#/world/shani');
  await new Promise((r) => setTimeout(r, 2600));
  const shaniState = await page.evaluate(() => ({
    drawer: !!document.querySelector('.glass-panel'),
    title: document.querySelector('.glass-panel h2')?.innerText,
  }));
  console.log('   Shani:', shaniState);
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/verify-03-shani.png') });

  // 4. Return to Solar System Overview
  console.log('4. Returning to Solar System Overview via Escape...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 2200));
  const overviewState = await page.evaluate(() => ({
    hash: window.location.hash,
    drawer: !!document.querySelector('.glass-panel'),
  }));
  console.log('   Overview:', overviewState);
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/verify-04-overview.png') });

  console.log('🏁 Complete verification finished!');
  await browser.close();
}

verifyAll();
