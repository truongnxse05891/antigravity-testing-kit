import { Page, expect, Locator } from '@playwright/test';

export class BreadcrumbBuilderPage {
  readonly page: Page;
  readonly insertPanelIcon: Locator;
  readonly searchInput: Locator;
  readonly breadcrumbBlockItem: Locator;
  
  // Content tab
  readonly hideHomeToggle: Locator;
  readonly hideCurrentToggle: Locator;
  readonly relatedCollectionToggle: Locator;
  readonly prefixInput: Locator;
  
  // Design tab
  readonly typeDropdown: Locator;
  readonly separatorDropdown: Locator;
  readonly alignBtns: { left: Locator; center: Locator; right: Locator };
  readonly widthInput: Locator;
  readonly opacityInput: Locator;
  readonly radiusInput: Locator;
  
  // Actions
  readonly blockActionBar: Locator;
  readonly duplicateBtn: Locator;
  readonly hideBtn: Locator;
  readonly deleteBtn: Locator;
  readonly saveBtn: Locator;
  readonly previewIframe: Locator;

  constructor(page: Page) {
    this.page = page;
    this.insertPanelIcon = page.getByRole('button', { name: 'Insert' });
    this.searchInput = page.getByPlaceholder('Search');
    this.breadcrumbBlockItem = page.getByText('Breadcrumb', { exact: true });
    
    // Content settings
    this.hideHomeToggle = page.locator('label:has-text("Hide Homepage") input[type="checkbox"]');
    this.hideCurrentToggle = page.locator('label:has-text("Hide current page") input[type="checkbox"]');
    this.relatedCollectionToggle = page.locator('label:has-text("Show related collection") input[type="checkbox"]');
    this.prefixInput = page.getByPlaceholder('Enter your text');
    
    // Design settings
    this.typeDropdown = page.locator('.setting-type-dropdown');
    this.separatorDropdown = page.locator('.setting-separator-dropdown');
    this.alignBtns = {
        left: page.locator('button[aria-label="Align Left"]'),
        center: page.locator('button[aria-label="Align Center"]'),
        right: page.locator('button[aria-label="Align Right"]')
    };
    this.widthInput = page.locator('input[aria-label="Width"]');
    this.opacityInput = page.locator('input[aria-label="Opacity"]');
    this.radiusInput = page.locator('input[aria-label="Border radius"]');
    
    // Actions
    this.blockActionBar = page.locator('.block-action-bar');
    this.duplicateBtn = this.blockActionBar.locator('button[aria-label="Duplicate"]');
    this.hideBtn = this.blockActionBar.locator('button[aria-label="Hide"]');
    this.deleteBtn = page.getByRole('button', { name: 'Delete block' });
    
    this.saveBtn = page.getByRole('button', { name: 'Save' });
    this.previewIframe = page.locator('iframe#preview-frame');
  }

  async addBreadcrumbBlock() {
    await this.insertPanelIcon.click();
    await this.searchInput.fill('Breadcrumb');
    await this.breadcrumbBlockItem.click();
  }

  async configureContentSettings(options: { hideHome?: boolean, hideCurrent?: boolean, prefix?: string }) {
    if (options.hideHome !== undefined) {
      if (options.hideHome) await this.hideHomeToggle.check();
      else await this.hideHomeToggle.uncheck();
    }
    if (options.hideCurrent !== undefined) {
      if (options.hideCurrent) await this.hideCurrentToggle.check();
      else await this.hideCurrentToggle.uncheck();
    }
    if (options.prefix !== undefined) {
      await this.prefixInput.fill(options.prefix);
    }
  }

  async configureDesignSettings(options: { type?: string, separator?: string, align?: 'Left' | 'Center' | 'Right' }) {
    if (options.type) {
        await this.typeDropdown.click();
        await this.page.getByText(options.type, { exact: true }).click();
    }
    if (options.separator) {
        await this.separatorDropdown.click();
        await this.page.getByText(options.separator).click();
    }
    if (options.align) {
        if (options.align === 'Left') await this.alignBtns.left.click();
        if (options.align === 'Center') await this.alignBtns.center.click();
        if (options.align === 'Right') await this.alignBtns.right.click();
    }
  }

  async setAdvancedDesign(options: { width?: string, opacity?: string, radius?: string }) {
    if (options.width) await this.widthInput.fill(options.width);
    if (options.opacity) await this.opacityInput.fill(options.opacity);
    if (options.radius) await this.radiusInput.fill(options.radius);
  }

  async executeBlockAction(action: 'duplicate' | 'hide' | 'delete') {
    if (action === 'duplicate') await this.duplicateBtn.click();
    if (action === 'hide') await this.hideBtn.click();
    if (action === 'delete') await this.deleteBtn.click();
  }

  async saveChanges() {
    await this.saveBtn.click();
    await expect(this.page.getByText('All changes are saved')).toBeVisible({ timeout: 15000 });
  }
}
