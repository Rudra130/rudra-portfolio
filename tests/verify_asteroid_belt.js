import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { spawn } from 'child_process';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];

const chromeExecutable = chromePaths.find((p) => fs.existsSync(p));
const outPath =
  'C:\\Users\\rudra\\.gemini\\antigravity\\brain\\a806ac2c-3de6-4905-906f-886357213822\\scratch\\asteroid_belt_overview.png';

async function run() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4175', '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server timed out')), 15000);
    const onData = (chunk) => {
      if (chunk.toString().includes('4175')) {
        clearTimeout(timer);
        resolve();
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
  });

  const errors = [];
  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('http://localhost:4175/portfolio', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 3000));

    await page.screenshot({ path: outPath });
    console.log('Saved screenshot to:', outPath);
    console.log('Console/Page errors:', errors.length === 0 ? 'None' : errors);
  } finally {
    await browser.close();
    spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { shell: true });
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
