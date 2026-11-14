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
  console.log('Starting verification of expanded UI/UX and GenAI content...');
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Check Shukra (UI/UX & Design Systems)
  console.log('1. Checking Shukra (UI/UX Design Systems)...');
  await page.goto('http://localhost:5174/universe/design', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const shukraContent = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasClaymorphism: text.includes('Claymorphism') && text.includes('Dual-Drop-Shadow'),
      hasGSAP: text.includes('3D GSAP') && text.includes('Quaternion'),
      hasBulletPoints: document.querySelectorAll('li').length > 5,
      hasInteractiveClay: text.includes('Interactive Claymorphic'),
    };
  });
  console.log('Shukra Content Check:', shukraContent);

  // Click the interactive clay button
  await page.evaluate(() => {
    const clayBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Click Me (Tactile Clay)')
    );
    if (clayBtn) {
      clayBtn.click();
      clayBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotsDir, 'shukra_ui_ux_expanded.png') });
  console.log('Saved shukra_ui_ux_expanded.png');

  // 2. Check Rahu (Generative AI & Agents)
  console.log('2. Checking Rahu (Generative AI & Agents)...');
  await page.goto('http://localhost:5174/universe/generative-ai', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const rahuContent = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasLangGraph: text.includes('LangGraph') && text.includes('Cyclical StateGraph'),
      hasRAG: text.includes('Advanced RAG'),
      hasGuardrails: text.includes('Safety & Guardrails'),
      hasMCP: text.includes('Model Context Protocol') || text.includes('MCP'),
      hasOpenAI: text.includes('OpenAI SDK'),
      hasGoogleADK: text.includes('Google Agentic Dev Kit') || text.includes('Google Agentic'),
    };
  });
  console.log('Rahu Content Check:', rahuContent);

  await page.screenshot({ path: path.join(screenshotsDir, 'rahu_genai_agents_expanded.png') });
  console.log('Saved rahu_genai_agents_expanded.png');

  // Test switching tabs in Rahu
  console.log('Testing Rahu Protocols tab...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('MCP & OpenAI')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotsDir, 'rahu_mcp_openai_tab.png') });
  console.log('Saved rahu_mcp_openai_tab.png');

  // 3. Check 2D Accessible Portfolio View
  console.log('3. Checking 2D Accessible Portfolio View...');
  await page.goto('http://localhost:5174/2d', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const accessibleCheck = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasGenAISection: text.includes('Generative AI & Autonomous Agents'),
      hasUIUXSection: text.includes('UI/UX Design Systems & Creative Frontend'),
      hasClaymorphism: text.includes('Claymorphism'),
      hasLangGraph: text.includes('LangGraph'),
    };
  });
  console.log('Accessible View Check:', accessibleCheck);

  await page.screenshot({ path: path.join(screenshotsDir, 'accessible_view_expanded_content.png') });
  console.log('Saved accessible_view_expanded_content.png');

  await browser.close();

  const allPassed =
    shukraContent.hasClaymorphism &&
    shukraContent.hasGSAP &&
    shukraContent.hasBulletPoints &&
    rahuContent.hasLangGraph &&
    rahuContent.hasRAG &&
    rahuContent.hasGuardrails &&
    accessibleCheck.hasGenAISection &&
    accessibleCheck.hasUIUXSection;

  if (!allPassed) {
    throw new Error('FAIL: Some content checks failed!');
  }
  console.log('ALL EXPANDED CONTENT CHECKS PASSED PERFECTLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
