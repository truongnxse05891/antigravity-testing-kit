import { expect, Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // Tìm button Add to cart (Sửa thành text locator do DOM ShopBase compile nút thành dạng <span>/<div> generic)
    this.addToCartBtn = page.getByText(/Add to cart/i, { exact: false }).first();
    // Nút Checkout có thể nằm góc màn hình hoặc trong Checkout Drawer
    this.checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout")').first();
  }

  /**
   * Mở trang URL sản phẩm bất kỳ
   */
  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Thực hiện hành động đẩy sản phẩm vào túi và tới thanh toán
   */
  async addToCartAndCheckout() {
    await this.addToCartBtn.waitFor({ state: 'visible' });
    await this.addToCartBtn.click();
    
    // Đợi Cart Drawer hoặc Modal bật lên.
    // Tìm thẻ a, button, span có chứa chữ Checkout
    const checkoutLocator = this.page.locator('a, button, span, [role="button"]').filter({ hasText: /Check ?out/i }).last();
    
    try {
      await checkoutLocator.waitFor({ state: 'visible', timeout: 8000 });
      await checkoutLocator.click();
    } catch (e) {
      console.log('⚠️ Locator nút Checkout bị lẩn tránh (Anim delay/Lệch DOM). Kích hoạt Auto-Fallback sang /cart...');
      // ShopBase không cho vào thẳng /checkout -> 404. Phải vào /cart rồi submit
      const baseUrl = new URL(this.page.url()).origin;
      await this.page.goto(`${baseUrl}/cart`, { waitUntil: 'domcontentloaded' });
      await this.page.locator('[name="checkout"]').first().click();
    }
  }
}
