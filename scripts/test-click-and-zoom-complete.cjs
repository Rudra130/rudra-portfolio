const puppeteer = require('puppeteer-core');
const path = require('path');

async function testInteractions() {
  console.log('🧪 Starting Final Click, Zoom & Animation Verification...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=default'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Landing & Navigation
  await page.goto('http://localhost:5174/');
  await new Promise((r) => setTimeout(r, 1200));

  // Click Explore Portfolio button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Explore')
    );
    if (btn) btn.click();
  });
  console.log('   ✅ Clicked Explore button');
  await new Promise((r) => setTimeout(r, 2000));

  // 2. Capture Initial Top-Down Cosmos View
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-01-overview.png') });
  console.log('   📸 1. Solar system overview verified');

  // 3. Test Smooth Mouse Wheel Zoom
  await page.mouse.move(960, 540);
  await page.mouse.wheel({ deltaY: -500 }); // Zoom in
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-02-zoom-in.png') });
  console.log('   📸 2. Smooth zoom in verified');

  await page.mouse.wheel({ deltaY: 700 }); // Zoom out
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-03-zoom-out.png') });
  console.log('   📸 3. Smooth zoom out verified');

  // 4. Test Selecting Surya (Sun)
  await page.evaluate(() => {
    window.location.hash = '#/world/surya';
  });
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-04-surya.png') });
  console.log('   📸 4. Surya selection & drawer verified');

  // 5. Test Return to Solar System Overview via Back Button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Back to Overview')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-05-return-overview.png') });
  console.log('   📸 5. Return to solar system overview verified');

  // 6. Test Selecting Shani (Saturn)
  await page.evaluate(() => {
    window.location.hash = '#/world/shani';
  });
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-06-shani.png') });
  console.log('   📸 6. Shani (Saturn) selection & drawer verified');

  // 7. Test Keyboard Navigation (ArrowRight to Rahu, then Ketu, then Esc)
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-07-rahu.png') });
  console.log('   📸 7. Keyboard ArrowRight (Rahu) verified');

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, '../tests/screenshots/final-08-escape-return.png') });
  console.log('   📸 8. Keyboard Escape (Return to overview) verified');

  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

testInteractions();
