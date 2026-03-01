const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const prototypes = [
    { name: 'PRISM', url: 'http://localhost:8888/PRISM/index.html' },
    { name: 'ZEN', url: 'http://localhost:8888/ZEN/index.html' },
    { name: 'FORGE', url: 'http://localhost:8888/FORGE/index.html' },
    { name: 'GLITCH', url: 'http://localhost:8888/GLITCH/index.html' },
    { name: 'EPOCH', url: 'http://localhost:8888/EPOCH/index.html' }
  ];

  for (const proto of prototypes) {
    console.log(`Taking screenshot of ${proto.name}...`);
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(proto.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(2000); // Wait for animations
      
      const screenshotPath = path.join(__dirname, `${proto.name}-screenshot.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✓ Saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`✗ Failed to screenshot ${proto.name}:`, error.message);
    }
    
    await page.close();
  }

  await browser.close();
  console.log('\nAll screenshots completed!');
}

takeScreenshots().catch(console.error);
