import { Page, expect, Locator } from '@playwright/test';

export class StorefrontPage {
  readonly page: Page;
  readonly breadcrumbBlock: Locator;
  readonly breadcrumbItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumbBlock = page.locator('nav').filter({ hasText: /Home/ }); 
    this.breadcrumbItems = this.breadcrumbBlock.locator('a, span');
  }

  async visit(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyBreadcrumbVisible() {
    await expect(this.breadcrumbBlock).toBeVisible();
  }

  async verifyBreadcrumbContent(expectedText: string) {
    await expect(this.breadcrumbBlock).toContainText(expectedText);
  }

  async getItemsText() {
    return this.breadcrumbItems.allTextContents();
  }

  async verifyHoverEffect(index: number) {
    const item = this.breadcrumbItems.nth(index);
    await item.hover();
    await expect(item).toHaveCSS('cursor', 'pointer');
  }
}
