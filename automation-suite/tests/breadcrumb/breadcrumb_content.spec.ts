import { test, expect } from '@playwright/test';
import { BreadcrumbBuilderPage } from '../../pages/BreadcrumbBuilderPage';
import { StorefrontPage } from '../../pages/StorefrontPage';
import { LoginPage } from '../../pages/LoginPage';
// import { v4 as uuidv4 } from 'uuid';

const BUILDER_URL = 'https://cc-dev.mixc.co/shopbase/storefronts/13/design/builder/site/13';
const SF_PRODUCT_URL = 'https://sf-dev.mixc.co/products/modern-muse/';

test.describe('M1 & M2: Breadcrumb Content Settings', () => {
  let builderPage: BreadcrumbBuilderPage;
  const runId = Math.random().toString(36).substring(2, 8);

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();
    
    builderPage = new BreadcrumbBuilderPage(page);
    await page.goto(BUILDER_URL);
    // BBC_TC_001 (Partial): Assumes block is successfully added to Product or Home layout
    await builderPage.addBreadcrumbBlock();
  });

  test('BBC_TC_002: Verify default settings', async ({ page }) => {
    // Assert Default states
    await expect(builderPage.hideHomeToggle).not.toBeChecked();
    await expect(builderPage.hideCurrentToggle).not.toBeChecked();
    await expect(builderPage.prefixInput).toBeEmpty();
    await expect(builderPage.typeDropdown).toContainText('Text');
  });

  // M2: Component content settings
  test('BBC_TC_003 & 004 & 005: Verify Hide Homepage & Hide Current page', async ({ page }) => {
    await builderPage.configureContentSettings({ hideHome: true, hideCurrent: true });
    await builderPage.saveChanges();
    
    const sfTab = await page.context().newPage();
    const storefront = new StorefrontPage(sfTab);
    await storefront.visit(SF_PRODUCT_URL);
    
    const items = await storefront.getItemsText();
    const joinedItems = items.join();
    expect(joinedItems).not.toContain('Home');
    expect(joinedItems).not.toContain('Modern Muse'); 
  });

  test('BBC_TC_006, 007 & 008: Prefix text rules', async ({ page }) => {
    const specialPrefix = `@!3~Nav_${runId}`;
    await builderPage.configureContentSettings({ prefix: specialPrefix });
    
    // Test 100 character truncation logically via DOM check
    const longString = "a".repeat(110);
    await builderPage.prefixInput.fill(longString);
    const inputValue = await builderPage.prefixInput.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(100);

    // Save final state
    await builderPage.configureContentSettings({ prefix: specialPrefix });
    await builderPage.saveChanges();

    const sfTab = await page.context().newPage();
    const storefront = new StorefrontPage(sfTab);
    await storefront.visit(SF_PRODUCT_URL);
    await storefront.verifyBreadcrumbContent(specialPrefix);
  });
  
  // Note: BBC_TC_009 covered by combination of the above.
});
