import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://cc-dev.mixc.co/', { waitUntil: 'networkidle' });
  }

  async login(email = 'admin@gmail.com', password = 'admin123456') {
    try {
      await expect(this.page.locator('#email')).toBeVisible({ timeout: 15000 });
      await this.page.locator('#email').fill(email);
      await this.page.locator('#password').fill(password);
      await this.page.getByRole('button', { name: 'Sign in' }).click();
      await this.page.waitForLoadState('networkidle');
    } catch (e) {
      console.log('Already logged in or login form not visible.');
    }
  }
}
