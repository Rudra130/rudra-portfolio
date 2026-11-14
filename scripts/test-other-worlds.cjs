const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=default'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Test Surya (Sun)
  console.log('Testing Surya...');
  await page.goto('http://localhost:5174/#/world/surya');
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/test-surya.png') });
  console.log('📸 Captured test-surya.png');

  // Test Surya Tab Switch (Biography -> Resume -> Contact)
  const bioTab = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Biography');
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (bioTab) {
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/test-surya-bio.png') });
    console.log('📸 Captured test-surya-bio.png');
  }

  // 2. Test Shani (Saturn)
  console.log('Testing Shani...');
  await page.goto('http://localhost:5174/#/world/shani');
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/test-shani.png') });
  console.log('📸 Captured test-shani.png');

  // 3. Test Budh (Mercury / DSA & Skills)
  console.log('Testing Budh...');
  await page.goto('http://localhost:5174/#/world/budh');
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/test-budh.png') });
  console.log('📸 Captured test-budh.png');

  console.log('✅ Other worlds tested successfully!');
  await browser.close();
})();
