import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeGDPRScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Users/toddsampson/srv/dane-griggs-website/chrome/mac_arm-141.0.7354.0/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  });

  try {
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'gdpr-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    // Desktop view
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    console.log('1. Capturing initial consent banner...');
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(screenshotsDir, '1-initial-consent-banner-desktop.png'), fullPage: true });

    // Check if consent banner is visible and take closeup
    try {
      const bannerSelector = '.cookie-consent-banner, [data-testid="cookie-consent-banner"], #cookie-consent, .consent-banner';
      const bannerExists = await page.$(bannerSelector);
      if (bannerExists) {
        const boundingBox = await bannerExists.boundingBox();
        if (boundingBox) {
          await page.screenshot({ path: path.join(screenshotsDir, '1b-consent-banner-closeup.png'), clip: boundingBox });
        }
      }
    } catch (e) {
      console.log('Could not capture banner closeup');
    }

    console.log('2. Capturing customize preferences panel...');
    // Try to click customize/preferences button
    try {
      const customizeSelectors = [
        'button[data-testid="customize-cookies"]',
        'button[data-testid="cookie-preferences"]', 
        '.customize-button',
        '.preferences-button'
      ];
      
      let customizeButton = null;
      for (const selector of customizeSelectors) {
        customizeButton = await page.$(selector);
        if (customizeButton) break;
      }
      
      if (customizeButton) {
        await customizeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: path.join(screenshotsDir, '2-customize-preferences-panel.png'), fullPage: true });
        
        // Close preferences panel
        const closeSelectors = ['button[data-testid="close-preferences"]', '.close-button'];
        let closeButton = null;
        for (const selector of closeSelectors) {
          closeButton = await page.$(selector);
          if (closeButton) break;
        }
        if (closeButton) {
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (e) {
      console.log('Could not interact with customize button');
    }

    console.log('3. Capturing mobile view...');
    // Mobile view
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: path.join(screenshotsDir, '3-consent-banner-mobile.png'), fullPage: true });

    console.log('4. Accepting cookies and capturing consent manager...');
    // Accept cookies and capture consent manager
    await page.setViewport({ width: 1200, height: 800 });
    try {
      const acceptSelectors = [
        'button[data-testid="accept-all"]',
        'button[data-testid="accept-cookies"]',
        '.accept-button'
      ];
      
      let acceptButton = null;
      for (const selector of acceptSelectors) {
        acceptButton = await page.$(selector);
        if (acceptButton) break;
      }
      
      if (acceptButton) {
        await acceptButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.screenshot({ path: path.join(screenshotsDir, '4-after-accepting-cookies.png'), fullPage: true });
        
        // Look for consent manager widget
        const managerSelectors = ['.consent-manager', '[data-testid="consent-manager"]', '.cookie-settings'];
        let consentManager = null;
        for (const selector of managerSelectors) {
          consentManager = await page.$(selector);
          if (consentManager) break;
        }
        
        if (consentManager) {
          const boundingBox = await consentManager.boundingBox();
          if (boundingBox) {
            await page.screenshot({ path: path.join(screenshotsDir, '4b-consent-manager-widget.png'), clip: boundingBox });
          }
        }
      }
    } catch (e) {
      console.log('Could not interact with accept button');
    }

    console.log('5. Capturing Privacy Policy page...');
    // Privacy Policy page
    const privacyUrls = ['/privacy-policy', '/privacy'];
    for (const url of privacyUrls) {
      try {
        await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: path.join(screenshotsDir, '5-privacy-policy-page.png'), fullPage: true });
        break;
      } catch (e) {
        console.log(`Privacy policy page not found at ${url}`);
      }
    }

    console.log('6. Capturing Cookie Policy page...');
    // Cookie Policy page
    const cookieUrls = ['/cookie-policy', '/cookies'];
    for (const url of cookieUrls) {
      try {
        await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: path.join(screenshotsDir, '6-cookie-policy-page.png'), fullPage: true });
        break;
      } catch (e) {
        console.log(`Cookie policy page not found at ${url}`);
      }
    }

    await page.close();
    
    console.log('Screenshots saved to gdpr-screenshots/ directory');
    console.log('Files created:');
    const files = fs.readdirSync(screenshotsDir);
    files.forEach(file => console.log(`  ${file}`));

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeGDPRScreenshots().catch(console.error);