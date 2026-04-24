import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

import testData from './hybrid_turbo.json';
const env = process.env.TEST_ENV || 'dev';
const conf = testData.env[env];

// Tùy chọn cấu hình Session Cache ở cấp độ Global
test.use({ 
  viewport: { width: 1920, height: 1080 },
  // StorageState nếu có file cache từ lần chạy trước -> Sẽ load thẳng session, auto-fill address
  // storageState: 'state.json', 
});

test.describe('🚀 HYBRID TURBO MODE SUITE', () => {

  test('Chạy Tốc Độ Cực Hạn (Blind Tab, Bỏ Wait, Cache Context)', async ({ page }) => {
    // Tắt các animations để thao tác gõ/click cực lẹ
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('⚡ S1: Navigate Minitimized DOM', async () => {
      // Ép dừng tải DOM ngay khi các API nội bộ phản hồi xong (domcontentloaded thay vì networkidle)
      await page.goto(conf.product_url, { waitUntil: 'domcontentloaded' });
      await productPage.addToCartAndCheckout();
    });

    await test.step('⚡ S2: Xử lý Cache & Tối giản Lookup (No Verification)', async () => {
      // 1. Kiểm tra lẹ xem Browser đã mồi sẵn Session chưa 
      await page.waitForSelector('input', { timeout: 10000 });
      const currentEmail = await page.getByPlaceholder(/Email/i).first().inputValue().catch(() => '');
      
      if (currentEmail.length < 3) {
        console.log('--- KHÔNG CÓ CACHE: Chạy Blind Tab Navigation Tốc Độ ---');
        // Kỹ thuật ghim 1 cục duy nhất xong dùng Tab cứng thay vì Find Locator hàng chục lần
        await page.getByPlaceholder(/Email/i).first().click();
        
        // Gõ liên thanh qua Keyboard thay vì set fill Value
        await page.keyboard.type(conf.customer.email, { delay: 0 });
        await page.keyboard.press('Tab');
        await page.keyboard.type(conf.customer.first_name, { delay: 0 });
        await page.keyboard.press('Tab');
        await page.keyboard.type(conf.customer.last_name, { delay: 0 });
        
        // Đoạn địa chỉ nếu để Automation nó search sẽ cực nhanh
        await page.keyboard.press('Tab');
        await page.keyboard.type(conf.shipping.address, { delay: 0 });
        // Esc nếu address popup của google nhô lên
        await page.keyboard.press('Escape');
        
        // Setup lẹ bằng hàm page object fallback
        await checkoutPage.fillShippingInfoIfNeeded();
      } else {
        console.log('--- SESSION CACHED: Bỏ qua hoàn toàn điền Shipping DOM ---');
      }
    });

    await test.step('⚡ S3: Thẻ Payment & Fast Escape', async () => {
       await checkoutPage.selectCreditCardPaymentIfNeeded();
       await checkoutPage.fillCreditCard(conf.payment.card_number, conf.payment.card_exp, conf.payment.card_cvv);
       
       // Click Place order cực nhanh
       await checkoutPage.placeOrderBtn.click();
       // "FAST ESCAPE" bằng phím cứng (Đúng yêu cầu Prompt 10)
       await page.keyboard.press('Escape'); 
       await page.keyboard.press('Escape');
    });

    await test.step('⚡ S4: Minimal DOM Loads - Add Upsell Ngay Lập Tức', async () => {
       // Không đợi page "networkidle", vừa hé Locator nút Add là click liền
       const upsellAddBtn = page.locator('button:has-text("Add to order"), button:has-text("Add this item")').first();
       
       try {
           await upsellAddBtn.waitFor({ state: 'visible', timeout: 5000 });
           await upsellAddBtn.click();
       } catch {
           console.log('Pop-up Upsell bị skip hoặc không hiện ra kịp thời -> Continue');
       }
    });

    await test.step('⚡ S5: Kết Thúc ThankYou Page Nhanh', async () => {
       // Chỉ cần URL nhảy sang Thank_you / Orders là tính Pass
       await page.waitForURL(/.*\/orders\/.*/, { timeout: 15000 });
       console.log('✅ Đã load thành công URL Order!');
    });
  });

});
