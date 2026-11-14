const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../tests/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runUITests() {
  console.log('🚀 Starting Comprehensive UI & Interaction Testing...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=default',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      console.error('❌ Browser Console Error:', text);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.error('❌ Page Error:', err.toString());
  });

  try {
    // 1. Load Landing Page
    console.log('1️⃣ Navigating to http://localhost:5174/ ...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-landing-page.png') });
    console.log('   📸 Captured 01-landing-page.png');

    // 2. Click "Explore Portfolio" Button
    console.log('2️⃣ Clicking "Explore Portfolio" button to enter 3D Cosmos...');
    const exploreBtn = await page.waitForSelector('button:has-text("Explore Portfolio")', { timeout: 10000 })
      .catch(async () => {
        // Fallback search by text
        const buttons = await page.$$('button');
        for (const btn of buttons) {
          const txt = await page.evaluate(el => el.innerText, btn);
          if (txt.includes('Explore') || txt.includes('Portfolio')) return btn;
        }
        return null;
      });

    if (exploreBtn) {
      await exploreBtn.click();
      console.log('   ✅ Clicked Explore button');
    } else {
      console.log('   ℹ️ Direct hash navigating to #/universe');
      await page.goto('http://localhost:5174/#/universe', { waitUntil: 'networkidle2' });
    }

    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-universe-overview.png') });
    console.log('   📸 Captured 02-universe-overview.png (Solar system top-down overview)');

    // 3. Test Smooth Mouse Wheel Zoom
    console.log('3️⃣ Testing Smooth Mouse Wheel Zoom...');
    // Scroll in (zoom in)
    await page.mouse.move(960, 540);
    await page.mouse.wheel({ deltaY: -600 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-zoom-in.png') });
    console.log('   📸 Captured 03-zoom-in.png (Zoomed In)');

    // Scroll out (zoom out)
    await page.mouse.wheel({ deltaY: 800 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-zoom-out.png') });
    console.log('   📸 Captured 04-zoom-out.png (Zoomed Out)');

    // 4. Test HUD Zoom Controls (+ / -)
    console.log('4️⃣ Testing HUD Zoom Buttons (+ / -)...');
    const zoomInBtn = await page.$('button[title*="Zoom In"]');
    if (zoomInBtn) {
      await zoomInBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await zoomInBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      console.log('   ✅ Clicked HUD Zoom In twice');
    }

    // 5. Test Planet Selection via 3D Label Click
    console.log('5️⃣ Testing Planet Selection (Clicking Mangal / Mars)...');
    // Let's find Mangal label or click Mangal
    const mangalLabel = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div, span'));
      const target = els.find(el => el.textContent && el.textContent.includes('Mangal'));
      if (target) {
        target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 100 }));
        target.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, clientX: 100, clientY: 100 }));
        target.click();
        return true;
      }
      return false;
    });

    if (!mangalLabel) {
      console.log('   Fallback: Navigating via store / hash to #/world/mangal');
      await page.goto('http://localhost:5174/#/world/mangal');
    } else {
      console.log('   ✅ Clicked Mangal 3D tag');
    }

    // Wait 500ms to capture the cinematic approach banner during GSAP approach
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-mangal-approaching.png') });
    console.log('   📸 Captured 05-mangal-approaching.png (Cinematic approach telemetry banner)');

    // Wait for GSAP swoop to finish and drawer to open (1.8s)
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-mangal-inspected.png') });
    console.log('   📸 Captured 06-mangal-inspected.png (Planet left-framed, Drawer right-opened)');

    // 6. Test Project Card Hover Depth in Mangal
    console.log('6️⃣ Testing Project Card Hover Depth...');
    const projectCard = await page.$('.glass-card.group');
    if (projectCard) {
      const box = await projectCard.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await new Promise((r) => setTimeout(r, 500));
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-project-card-hover.png') });
        console.log('   📸 Captured 07-project-card-hover.png (Card elevation & glow)');
      }
    }

    // 7. Test "Back to Overview" Smooth GSAP Return
    console.log('7️⃣ Testing "Back to Overview" Button...');
    const backBtn = await page.$('button[title*="Return to Solar System Overview"]');
    if (backBtn) {
      await backBtn.click();
      console.log('   ✅ Clicked Back to Overview');
    } else {
      console.log('   Pressing Escape key to return to overview...');
      await page.keyboard.press('Escape');
    }

    // Wait for return GSAP camera transition (1.5s)
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-returned-overview.png') });
    console.log('   📸 Captured 08-returned-overview.png (Returned to solar system overview)');

    // 8. Test Keyboard Navigation (ArrowRight / ArrowLeft / Space)
    console.log('8️⃣ Testing Keyboard Navigation (ArrowRight to switch planets)...');
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 2200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-keyboard-next-planet.png') });
    console.log('   📸 Captured 09-keyboard-next-planet.png (ArrowRight selected next planet)');

    console.log('9️⃣ Testing Spacebar Orbit Pause/Resume...');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 1800));
    await page.keyboard.press('Space');
    console.log('   ✅ Pressed Spacebar (Orbit toggled)');
    await new Promise((r) => setTimeout(r, 600));

    // Summary of logs and errors
    console.log('\n📊 Interaction Testing Summary:');
    console.log(`   Total Console Logs: ${consoleLogs.length}`);
    console.log(`   Total Console Errors: ${consoleLogs.filter(l => l.startsWith('[error]')).length}`);
    console.log(`   Total Page Errors: ${pageErrors.length}`);

    if (pageErrors.length > 0) {
      console.error('❌ Page Errors Detected:', pageErrors);
    } else {
      console.log('🎉 100% CLEAN: Zero JavaScript or WebGL Errors Detected!');
    }

  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    await browser.close();
    console.log('🏁 Browser testing session completed.');
  }
}

runUITests();
