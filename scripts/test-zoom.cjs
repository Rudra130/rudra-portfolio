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
  await page.goto('http://localhost:5174/#/universe');
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Initial Overview
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/zoom-01-initial.png') });
  console.log('📸 Captured zoom-01-initial.png');

  // 2. Zoom in via Mouse Wheel
  console.log('Testing Mouse Wheel Zoom In...');
  await page.mouse.move(960, 540);
  await page.mouse.wheel({ deltaY: -600 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/zoom-02-wheel-in.png') });
  console.log('📸 Captured zoom-02-wheel-in.png');

  // 3. Zoom in further via HUD + button
  console.log('Testing HUD + Button Click...');
  const plusBtn = await page.$('button[title*="Zoom In"]');
  if (plusBtn) {
    await plusBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await plusBtn.click();
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/zoom-03-hud-plus.png') });
  console.log('📸 Captured zoom-03-hud-plus.png');

  // 4. Zoom Out via HUD - button
  console.log('Testing HUD - Button Click...');
  const minusBtn = await page.$('button[title*="Zoom Out"]');
  if (minusBtn) {
    await minusBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await minusBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await minusBtn.click();
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/zoom-04-hud-minus.png') });
  console.log('📸 Captured zoom-04-hud-minus.png');

  // 5. Zoom Out via Wheel
  console.log('Testing Mouse Wheel Zoom Out...');
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/zoom-05-wheel-out.png') });
  console.log('📸 Captured zoom-05-wheel-out.png');

  console.log('✅ All zoom tests completed successfully!');
  await browser.close();
})();
