import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));
const screenshotsDir = path.resolve('tests/screenshots');

async function run() {
  console.log('Starting verification of Oracle Certification Badge integration...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Check Guru (Education & Certifications in 3D Universe)
  console.log('1. Checking Guru (Education & Certifications)...');
  await page.goto('http://localhost:5174/universe/education', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  const guruBadgeCheck = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const links = Array.from(document.querySelectorAll('a')).map((a) => a.href);
    const hasBadgeTitle = text.includes('Agentic AI Certified Foundations Associate');
    const hasOracleIssuer = text.includes('Oracle University');
    const hasSharebadgeLink = links.some((l) =>
      l.includes('catalog-education.oracle.com') && l.includes('7BA8D764E39E938D6DFDD2DCAB8FB79691641BB4172B812392D5A4DDE37483AB')
    );
    const hasBadgeImg = Array.from(document.querySelectorAll('img')).some((img) =>
      img.src.includes('oracle-agentic-ai.png')
    );
    return { hasBadgeTitle, hasOracleIssuer, hasSharebadgeLink, hasBadgeImg };
  });

  console.log('Guru Badge Check:', guruBadgeCheck);
  await page.screenshot({ path: path.join(screenshotsDir, 'guru_oracle_badge_3d.png') });
  console.log('Saved guru_oracle_badge_3d.png');

  // 2. Check Rahu (Generative AI & Agents in 3D Universe)
  console.log('2. Checking Rahu (Generative AI & Agents)...');
  await page.goto('http://localhost:5174/universe/generative-ai', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  const rahuBadgeCheck = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')).map((a) => a.href);
    const hasSharebadgeLink = links.some((l) =>
      l.includes('catalog-education.oracle.com') && l.includes('7BA8D764E39E938D6DFDD2DCAB8FB79691641BB4172B812392D5A4DDE37483AB')
    );
    const hasBadgeImg = Array.from(document.querySelectorAll('img')).some((img) =>
      img.src.includes('oracle-agentic-ai.png')
    );
    return { hasSharebadgeLink, hasBadgeImg };
  });

  console.log('Rahu Badge Check:', rahuBadgeCheck);
  await page.screenshot({ path: path.join(screenshotsDir, 'rahu_oracle_badge_3d.png') });
  console.log('Saved rahu_oracle_badge_3d.png');

  // 3. Check 2D Accessible Portfolio View
  console.log('3. Checking 2D Accessible Portfolio View...');
  await page.goto('http://localhost:5174/2d', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  const accessibleBadgeCheck = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const links = Array.from(document.querySelectorAll('a')).map((a) => a.href);
    const hasBadgeTitle = text.includes('Agentic AI Certified Foundations Associate');
    const hasSharebadgeLink = links.some((l) =>
      l.includes('catalog-education.oracle.com') && l.includes('7BA8D764E39E938D6DFDD2DCAB8FB79691641BB4172B812392D5A4DDE37483AB')
    );
    const hasBadgeImg = Array.from(document.querySelectorAll('img')).some((img) =>
      img.src.includes('oracle-agentic-ai.png')
    );
    return { hasBadgeTitle, hasSharebadgeLink, hasBadgeImg };
  });

  console.log('Accessible 2D Badge Check:', accessibleBadgeCheck);
  await page.screenshot({ path: path.join(screenshotsDir, 'accessible_2d_oracle_badge.png') });
  console.log('Saved accessible_2d_oracle_badge.png');

  await browser.close();

  const allPassed =
    guruBadgeCheck.hasBadgeTitle &&
    guruBadgeCheck.hasSharebadgeLink &&
    guruBadgeCheck.hasBadgeImg &&
    rahuBadgeCheck.hasSharebadgeLink &&
    rahuBadgeCheck.hasBadgeImg &&
    accessibleBadgeCheck.hasBadgeTitle &&
    accessibleBadgeCheck.hasSharebadgeLink &&
    accessibleBadgeCheck.hasBadgeImg;

  if (!allPassed) {
    throw new Error('FAIL: Oracle Certification Badge integration checks failed!');
  }
  console.log('ALL ORACLE BADGE INTEGRATION CHECKS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
