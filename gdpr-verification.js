import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyGDPRCompliance() {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'gdpr-verification-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    const page = await browser.newPage();
    
    console.log('🔍 GDPR Compliance Verification Starting...\n');

    // 1. Desktop homepage with consent banner
    console.log('1. Taking screenshot of homepage with consent banner (desktop)...');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for banner to appear
    await page.screenshot({ 
      path: path.join(screenshotsDir, '1-homepage-consent-banner-desktop.png'), 
      fullPage: true 
    });

    // 2. Click "Customize" and screenshot preferences panel
    console.log('2. Clicking "Customize" and capturing preferences panel...');
    try {
      const customizeButton = await page.waitForSelector('[data-testid="customize-cookies-btn"]', { timeout: 5000 });
      await customizeButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '2-preferences-panel-desktop.png'), 
        fullPage: true 
      });

      // Go back to main banner for button analysis
      const backButton = await page.$('[data-testid="back-btn"]');
      if (backButton) {
        await backButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log('   ⚠️ Could not interact with Customize button:', error.message);
    }

    // 3. Check button prominence (GDPR compliance check)
    console.log('3. Analyzing button prominence for GDPR compliance...');
    try {
      const acceptButton = await page.$('[data-testid="accept-all-cookies-btn"]');
      const rejectButton = await page.$('[data-testid="reject-all-cookies-btn"]');
      const customizeButton = await page.$('[data-testid="customize-cookies-btn"]');

      if (acceptButton && rejectButton && customizeButton) {
        const acceptStyles = await page.evaluate(btn => {
          const computed = window.getComputedStyle(btn);
          return {
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            padding: computed.padding,
            width: btn.offsetWidth,
            height: btn.offsetHeight
          };
        }, acceptButton);

        const rejectStyles = await page.evaluate(btn => {
          const computed = window.getComputedStyle(btn);
          return {
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            padding: computed.padding,
            width: btn.offsetWidth,
            height: btn.offsetHeight
          };
        }, rejectButton);

        console.log('   📊 Button Analysis:');
        console.log('      Accept Button:', acceptStyles);
        console.log('      Reject Button:', rejectStyles);
        
        // Check for dark patterns (accept button significantly more prominent)
        const sizeRatio = acceptStyles.width / rejectStyles.width;
        const darkPattern = sizeRatio > 1.2; // More than 20% larger could indicate dark pattern
        console.log(`      Size Ratio (Accept/Reject): ${sizeRatio.toFixed(2)} ${darkPattern ? '⚠️ POTENTIAL DARK PATTERN' : '✅ OK'}`);
      }
    } catch (error) {
      console.log('   ⚠️ Could not analyze button styles:', error.message);
    }

    // 4. Save preferences and verify consent storage
    console.log('4. Testing preference saving and consent storage...');
    try {
      // Click customize again
      const customizeButton = await page.$('[data-testid="customize-cookies-btn"]');
      if (customizeButton) {
        await customizeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Toggle analytics on
        const analyticsToggle = await page.$('[data-testid="analytics-toggle"]');
        if (analyticsToggle) {
          await analyticsToggle.click();
        }

        // Save preferences
        const saveButton = await page.$('[data-testid="save-preferences-btn"]');
        if (saveButton) {
          await saveButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if consent was stored
          const consentStored = await page.evaluate(() => {
            return localStorage.getItem('gdpr-consent') !== null;
          });
          console.log(`   💾 Consent Storage: ${consentStored ? '✅ WORKING' : '❌ FAILED'}`);
        }
      }
    } catch (error) {
      console.log('   ⚠️ Could not test preference saving:', error.message);
    }

    // 5. Mobile view (iPhone 14: 390x844)
    console.log('5. Taking mobile screenshot (iPhone 14 viewport: 390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, '3-mobile-consent-banner-iphone14.png'), 
      fullPage: true 
    });

    // Mobile customize view
    try {
      const mobileCustomizeButton = await page.$('[data-testid="customize-cookies-btn"]');
      if (mobileCustomizeButton) {
        await mobileCustomizeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ 
          path: path.join(screenshotsDir, '4-mobile-preferences-panel-iphone14.png'), 
          fullPage: true 
        });
      }
    } catch (error) {
      console.log('   ⚠️ Could not capture mobile preferences panel:', error.message);
    }

    // 6. Test Accept and Reject flows
    console.log('6. Testing Accept/Reject button functionality...');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test reject flow
    try {
      const rejectButton = await page.$('[data-testid="reject-all-cookies-btn"]');
      if (rejectButton) {
        await rejectButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const bannerHidden = await page.evaluate(() => {
          const banner = document.querySelector('[data-testid="cookie-consent-banner"]');
          return !banner || banner.style.display === 'none' || !banner.offsetParent;
        });
        
        console.log(`   🚫 Reject Button: ${bannerHidden ? '✅ WORKING (banner hidden)' : '❌ FAILED (banner still visible)'}`);
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '5-after-reject-all.png'), 
          fullPage: true 
        });
      }
    } catch (error) {
      console.log('   ⚠️ Could not test reject flow:', error.message);
    }

    // Reset and test accept flow
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const acceptButton = await page.$('[data-testid="accept-all-cookies-btn"]');
      if (acceptButton) {
        await acceptButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const bannerHidden = await page.evaluate(() => {
          const banner = document.querySelector('[data-testid="cookie-consent-banner"]');
          return !banner || banner.style.display === 'none' || !banner.offsetParent;
        });
        
        console.log(`   ✅ Accept Button: ${bannerHidden ? '✅ WORKING (banner hidden)' : '❌ FAILED (banner still visible)'}`);
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '6-after-accept-all.png'), 
          fullPage: true 
        });
      }
    } catch (error) {
      console.log('   ⚠️ Could not test accept flow:', error.message);
    }

    console.log('\n📷 Screenshots saved to gdpr-verification-screenshots/');
    const files = fs.readdirSync(screenshotsDir);
    files.forEach(file => console.log(`   📁 ${file}`));

    // Generate compliance report
    console.log('\n📋 GDPR Compliance Assessment:');
    
    // Check if consent banner appears
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bannerVisible = await page.$('[data-testid="cookie-consent-banner"]');
    console.log(`   🔍 Consent Banner Display: ${bannerVisible ? '✅ VISIBLE' : '❌ NOT FOUND'}`);
    
    // Check for required links
    const privacyLink = await page.$('[data-testid="privacy-policy-link"]');
    const cookieLink = await page.$('[data-testid="cookie-policy-link"]');
    console.log(`   📄 Privacy Policy Link: ${privacyLink ? '✅ PRESENT' : '❌ MISSING'}`);
    console.log(`   🍪 Cookie Policy Link: ${cookieLink ? '✅ PRESENT' : '❌ MISSING'}`);
    
    // Check for granular controls
    const customizeBtn = await page.$('[data-testid="customize-cookies-btn"]');
    console.log(`   ⚙️ Granular Controls: ${customizeBtn ? '✅ AVAILABLE' : '❌ MISSING'}`);
    
    // Check button accessibility
    const acceptBtnAria = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="accept-all-cookies-btn"]');
      return btn ? btn.getAttribute('aria-label') || btn.textContent : null;
    });
    const rejectBtnAria = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="reject-all-cookies-btn"]');
      return btn ? btn.getAttribute('aria-label') || btn.textContent : null;
    });
    
    console.log(`   ♿ Accept Button Accessibility: ${acceptBtnAria ? '✅ LABELED' : '❌ NO LABEL'}`);
    console.log(`   ♿ Reject Button Accessibility: ${rejectBtnAria ? '✅ LABELED' : '❌ NO LABEL'}`);

  } catch (error) {
    console.error('❌ Error during GDPR verification:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

console.log('🚀 Starting GDPR Compliance Verification...');
console.log('📍 Testing URL: http://localhost:4321\n');

verifyGDPRCompliance().catch(console.error);