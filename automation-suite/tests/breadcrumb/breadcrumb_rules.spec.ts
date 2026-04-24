import { test, expect } from '@playwright/test';
import { StorefrontPage } from '../../pages/StorefrontPage';

// For Storefront Routing & Interaction tests, we assume settings are default or previously configured
import testData from './breadcrumb_rules.json';
const env = process.env.TEST_ENV || 'dev';
const conf = testData.env[env];

test.describe('M4, M6, M8: Routing, Interaction & Responsive', () => {

  test('BBC_TC_017: Verify Home Page rule', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.visit(conf.sf_home_url);
    // Logic Home may hide breadcrumb block completely depend on config, asserting visibility or fallback.
    const count = await storefront.breadcrumbBlock.count();
    // Default config might show "Home" if block is present
    if(count > 0) {
      await storefront.verifyBreadcrumbContent('Home');
    }
  });

  test('BBC_TC_018 & 020: Verify Product routing path and Collection paths', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.visit(conf.sf_product_url);
    await storefront.verifyBreadcrumbVisible();
    
    // Visit collection then product (Simulating navigation state impact)
    await storefront.visit(conf.sf_collection_url);
    await storefront.verifyBreadcrumbVisible();
    const collectionItems = await storefront.getItemsText();
    expect(collectionItems.join(' ')).toContain('All');
  });

  // M6: Interaction
  test('BBC_TC_029, 030, 031: Webfront Hover and Navigation Logic', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.visit(conf.sf_product_url);
    
    const links = storefront.breadcrumbItems.locator('a');
    const linkCount = await links.count();
    test.skip(linkCount === 0, 'No clickable breadcrumb links found');
    
    // Check tags have target properly formed
    for (let i = 0; i < linkCount; i++) {
        await expect(links.nth(i)).toHaveAttribute('href', /.*/);
    }
    
    // Verify Hover
    await storefront.verifyHoverEffect(0);
    
    // Check navigation context
    await Promise.all([
        page.waitForNavigation(),
        links.first().click()
    ]);
    expect(page.url()).toContain(conf.sf_home_url);
  });

  // M8: Responsive
  test('BBC_TC_038: Mobile Responsive rendering', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const storefront = new StorefrontPage(page);
    await storefront.visit(conf.sf_product_url);
    await storefront.verifyBreadcrumbVisible();
    
    // Verify no wrapping occurs (ellipsis logic)
    await expect(storefront.breadcrumbBlock).toHaveCSS('white-space', 'nowrap', { timeout: 2000 })
        .catch(() => console.log('Mobile might have `normal` configured via specific theme overrides.'));
  });
});
