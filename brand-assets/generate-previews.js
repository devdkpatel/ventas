// Generates PNG previews for each business card HTML.
// Renders the page (front + back stacked) at high DPI and saves a PNG next to the HTML.

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const cards = [
  { html: 'card-1-classic-dark.html',     png: 'card-1-classic-dark-preview.png' },
  { html: 'card-2-white-premium.html',    png: 'card-2-white-premium-preview.png' },
  { html: 'card-3-bold-red.html',         png: 'card-3-bold-red-preview.png' },
  { html: 'card-4-split-diagonal.html',   png: 'card-4-split-diagonal-preview.png' },
  { html: 'card-5-minimalist-steel.html', png: 'card-5-minimalist-steel-preview.png' },
];

(async () => {
  const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  try {
    for (const c of cards) {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 900, deviceScaleFactor: 2 });
      const url = 'file://' + path.resolve(__dirname, c.html);
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Wait a moment for webfonts to fully render.
      await new Promise(r => setTimeout(r, 400));

      // Measure the actual content height (front + back + spacing) and resize.
      const dims = await page.evaluate(() => {
        const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        return { h };
      });
      await page.setViewport({ width: 800, height: dims.h, deviceScaleFactor: 2 });

      const out = path.resolve(__dirname, c.png);
      await page.screenshot({ path: out, type: 'png', fullPage: true });
      console.log('Wrote', c.png, fs.statSync(out).size, 'bytes');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err); process.exit(1); });
