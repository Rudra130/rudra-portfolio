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
  console.log('Launching browser for Clean URL Verification...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Visit root '/'
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  console.log('1. Root URL:', page.url());

  // 2. Click Enter Portfolio
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Enter Portfolio')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const universeUrl = page.url();
  console.log('2. Universe URL after Enter:', universeUrl);
  if (universeUrl.includes('#')) {
    throw new Error(`FAIL: Universe URL contains #: ${universeUrl}`);
  }
  if (!universeUrl.endsWith('/universe')) {
    throw new Error(`FAIL: Expected /universe, got: ${universeUrl}`);
  }
  console.log('PASS: Clean /universe URL verified without #!');

  // 3. Click Projects & Architecture
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find((b) =>
      b.getAttribute('title')?.includes('Projects & Architecture')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const projectsUrl = page.url();
  console.log('3. Projects URL:', projectsUrl);
  if (projectsUrl.includes('#') || !projectsUrl.endsWith('/universe/projects')) {
    throw new Error(`FAIL: Expected /universe/projects, got: ${projectsUrl}`);
  }
  console.log('PASS: Clean /universe/projects URL verified without #!');

  // 4. Click Work Experience
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find((b) =>
      b.getAttribute('title')?.includes('Work Experience')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const workUrl = page.url();
  console.log('4. Work Experience URL:', workUrl);
  if (workUrl.includes('#') || !workUrl.endsWith('/universe/work-experience')) {
    throw new Error(`FAIL: Expected /universe/work-experience, got: ${workUrl}`);
  }
  console.log('PASS: Clean /universe/work-experience URL verified without #!');

  // 5. Click Back to Overview
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Back to Overview')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const backUrl = page.url();
  console.log('5. Back to Overview URL:', backUrl);
  if (backUrl.includes('#') || !backUrl.endsWith('/universe')) {
    throw new Error(`FAIL: Expected /universe, got: ${backUrl}`);
  }
  console.log('PASS: Clean return to /universe verified without #!');

  // 6. Direct deep-link navigation to /universe/skills
  console.log('6. Testing direct deep link to /universe/skills ...');
  await page.goto('http://localhost:5174/universe/skills', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  const directUrl = page.url();
  console.log('Direct URL loaded:', directUrl);
  const activeTitle = await page.evaluate(() => {
    return document.querySelector('.glass-panel h2')?.textContent;
  });
  console.log('Drawer header from direct link:', activeTitle);
  if (activeTitle !== 'Technical Skills & DSA') {
    throw new Error(`FAIL: Expected Technical Skills & DSA, got: ${activeTitle}`);
  }
  console.log('PASS: Direct deep link /universe/skills loaded correctly!');

  // 7. Legacy hash backward compatibility test (#/universe)
  console.log('7. Testing legacy hash upgrade from #/universe ...');
  await page.goto('http://localhost:5174/#/universe', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  const upgradedUrl = page.url();
  console.log('Upgraded legacy URL:', upgradedUrl);
  if (upgradedUrl.includes('#')) {
    throw new Error(`FAIL: Legacy hash was not stripped: ${upgradedUrl}`);
  }
  console.log('PASS: Legacy hash upgrade stripped # cleanly!');

  await browser.close();
  console.log('\nALL CLEAN URL VERIFICATION CHECKS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
