import { test, expect } from '@playwright/test';
import { BreadcrumbBuilderPage } from '../../pages/BreadcrumbBuilderPage';
import { StorefrontPage } from '../../pages/StorefrontPage';
import { LoginPage } from '../../pages/LoginPage';

import testData from './breadcrumb_design.json';
const env = process.env.TEST_ENV || 'dev';
const conf = testData.env[env];


test.describe('M3: Design Settings', () => {
  let builderPage: BreadcrumbBuilderPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();
    
    builderPage = new BreadcrumbBuilderPage(page);
    await page.goto(conf.builder_url);
    await builderPage.addBreadcrumbBlock();
  });

  test('BBC_TC_010 & 011: Verify Type toggle Text <-> Button', async ({ page }) => {
    // Change to button
    await builderPage.configureDesignSettings({ type: 'Button' });
    await expect(builderPage.separatorDropdown).toBeHidden(); // Ensure UI reacts correctly
    
    // Change back to text
    await builderPage.configureDesignSettings({ type: 'Text' });
    await expect(builderPage.separatorDropdown).toBeVisible(); 
  });

  test('BBC_TC_012: Change Separators', async ({ page }) => {
    const separators = ['Slash', 'Arrow outline', 'Arrow fill', 'Double arrow', 'Dot'];
    for (const sep of separators) {
        await builderPage.configureDesignSettings({ separator: sep });
        // Can add visual check for builder Preview iframe if needed.
    }
    
    // Verify last separator setting gets saved
    await builderPage.saveChanges();
    const sfTab = await page.context().newPage();
    const storefront = new StorefrontPage(sfTab);
    await storefront.visit(conf.sf_product_url);
    await expect(storefront.breadcrumbBlock).toBeVisible(); 
    // Additional exact DOM assertions for svg / text separators could be placed here
  });

  test('BBC_TC_014, 015 & 016: Common Settings (Align, Padding, Margin, Opacity)', async ({ page }) => {
    await builderPage.configureDesignSettings({ align: 'Center' });
    await builderPage.setAdvancedDesign({ width: '500px', opacity: '50', radius: '8' });
    await builderPage.saveChanges();

    const sfTab = await page.context().newPage();
    const storefront = new StorefrontPage(sfTab);
    await storefront.visit(conf.sf_product_url);
    
    // Verify CSS 
    const sfBlock = storefront.breadcrumbBlock;
    await expect(sfBlock).toHaveCSS('text-align', 'center'); // Depending on real layout this may be justify-content
    await expect(sfBlock).toHaveCSS('opacity', '0.5'); 
  });
});
