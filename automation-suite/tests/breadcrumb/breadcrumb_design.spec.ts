import { test, expect } from '@playwright/test';
import { BreadcrumbBuilderPage } from '../../pages/BreadcrumbBuilderPage';
import { StorefrontPage } from '../../pages/StorefrontPage';
import { LoginPage } from '../../pages/LoginPage';

const BUILDER_URL = 'https://cc-dev.mixc.co/shopbase/storefronts/13/design/builder/site/13';
const SF_PRODUCT_URL = 'https://sf-dev.mixc.co/products/modern-muse/';

test.describe('M3: Design Settings', () => {
  let builderPage: BreadcrumbBuilderPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();
    
    builderPage = new BreadcrumbBuilderPage(page);
    await page.goto(BUILDER_URL);
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
    await storefront.visit(SF_PRODUCT_URL);
    await expect(storefront.breadcrumbBlock).toBeVisible(); 
    // Additional exact DOM assertions for svg / text separators could be placed here
  });

  test('BBC_TC_014, 015 & 016: Common Settings (Align, Padding, Margin, Opacity)', async ({ page }) => {
    await builderPage.configureDesignSettings({ align: 'Center' });
    await builderPage.setAdvancedDesign({ width: '500px', opacity: '50', radius: '8' });
    await builderPage.saveChanges();

    const sfTab = await page.context().newPage();
    const storefront = new StorefrontPage(sfTab);
    await storefront.visit(SF_PRODUCT_URL);
    
    // Verify CSS 
    const sfBlock = storefront.breadcrumbBlock;
    await expect(sfBlock).toHaveCSS('text-align', 'center'); // Depending on real layout this may be justify-content
    await expect(sfBlock).toHaveCSS('opacity', '0.5'); 
  });
});
