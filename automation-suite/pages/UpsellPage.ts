import { expect, Page, Locator } from '@playwright/test';

export class UpsellPage {
  readonly page: Page;
  readonly noThanksBtn: Locator;
  readonly addToOrderBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.noThanksBtn = page.locator('text="No thanks, I\'ll pass"');
    this.addToOrderBtn = page.locator('button:has-text("Add to order")').first();
  }

  async skipUpsell() {
    await this.noThanksBtn.waitFor({ state: 'visible', timeout: 30000 });
    await this.noThanksBtn.click();
  }

  async acceptUpsell() {
    await this.addToOrderBtn.waitFor({ state: 'visible', timeout: 30000 });
    await this.addToOrderBtn.click();
  }

  async verifyThankYouPage() {
    await this.page.waitForURL(/.*\/orders\/.*/, { timeout: 30000 });
    await expect(this.page.locator('text="Order successfully placed"').first()).toBeVisible({ timeout: 15000 });
  }
}
