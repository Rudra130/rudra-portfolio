import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));

async function run() {
  console.log('Testing vertical navigation bar default collapsed state...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5174/portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Verify default collapsed state
  const defaultState = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Portfolio Dimensions Navigation"]');
    const asideRect = aside?.getBoundingClientRect();
    const toggleBtn = aside?.querySelector('button[aria-label="Expand Navigation"]');
    const exploreText = aside?.textContent?.includes('Explore');
    const labelVisible = Array.from(aside?.querySelectorAll('span') || []).some(
      (s) => s.textContent === 'Core Identity & Bio'
    );

    return {
      asideWidth: asideRect?.width,
      hasExpandButton: !!toggleBtn,
      hasExploreText: exploreText,
      labelVisible,
    };
  });

  console.log('Default State Metrics:', defaultState);
  if (defaultState.asideWidth && defaultState.asideWidth < 100 && defaultState.hasExpandButton && !defaultState.labelVisible) {
    console.log('PASS: Navigation bar is in COLLAPSE MODE by default!');
  } else {
    console.error('FAIL: Navigation bar is NOT collapsed by default!', defaultState);
  }

  await page.screenshot({ path: 'tests/screenshots/nav_collapsed_default.png' });
  console.log('Saved nav_collapsed_default.png');

  // 2. Expand navigation bar
  console.log('Clicking Expand Navigation button...');
  const expandBtn = await page.evaluateHandle(() => {
    return document.querySelector('button[aria-label="Expand Navigation"]');
  });

  if (expandBtn) {
    await expandBtn.asElement()?.click();
    await new Promise((r) => setTimeout(r, 500));

    const expandedState = await page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Portfolio Dimensions Navigation"]');
      const asideRect = aside?.getBoundingClientRect();
      const collapseBtn = aside?.querySelector('button[aria-label="Collapse Navigation"]');
      return {
        asideWidth: asideRect?.width,
        hasCollapseButton: !!collapseBtn,
      };
    });

    console.log('Expanded State Metrics:', expandedState);
    if (expandedState.asideWidth && expandedState.asideWidth > 180 && expandedState.hasCollapseButton) {
      console.log('PASS: Navigation bar expands smoothly on click!');
    }

    await page.screenshot({ path: 'tests/screenshots/nav_manually_expanded.png' });
    console.log('Saved nav_manually_expanded.png');

    // 3. Collapse back
    console.log('Clicking Collapse Navigation button...');
    const collapseBtn = await page.evaluateHandle(() => {
      return document.querySelector('button[aria-label="Collapse Navigation"]');
    });
    if (collapseBtn) {
      await collapseBtn.asElement()?.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: 'tests/screenshots/nav_collapsed_again.png' });
      console.log('Saved nav_collapsed_again.png');
    }
  }

  await browser.close();
  console.log('Done testing vertical navigation bar.');
}

run().catch(console.error);
