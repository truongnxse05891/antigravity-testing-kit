import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { UpsellPage } from '../pages/UpsellPage';

import testData from './checkout.json';
const env = process.env.TEST_ENV || 'dev';
const conf = testData.env[env];

test.describe('🛒 ShopBase Fast Checkout Suite (Playwright)', () => {

  // Kịch bản 1
  test('Scenario 1 - SKIP_PPC: Checkout and decline Upsell', async ({ page }) => {
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);
    const upsellPage = new UpsellPage(page);

    await test.step('1. Mở sản phẩm & Add to Cart', async () => {
      await productPage.goto(conf.product_url);
      await productPage.addToCartAndCheckout();
    });

    await test.step('2. Điền Shipping & Payment', async () => {
      await checkoutPage.fillShippingInfoIfNeeded();
      await checkoutPage.selectCreditCardPaymentIfNeeded();
      await checkoutPage.fillCreditCard(conf.payment.card_number, conf.payment.card_exp, conf.payment.card_cvv);
    });

    await test.step('3. Đặt hàng', async () => {
      await checkoutPage.placeOrder();
    });

    await test.step('4. Từ chối PPC Upsell', async () => {
      await upsellPage.skipUpsell();
    });

    await test.step('5. Chờ màn hình Thank You', async () => {
      await upsellPage.verifyThankYouPage();
    });
  });

  // Kịch bản 2
  test('Scenario 2 - ADD_PPC: Checkout and accept Upsell', async ({ page }) => {
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);
    const upsellPage = new UpsellPage(page);

    await test.step('1. Mở sản phẩm & Add to Cart', async () => {
      await productPage.goto(conf.product_url);
      await productPage.addToCartAndCheckout();
    });

    await test.step('2. Điền Shipping & Payment', async () => {
      await checkoutPage.fillShippingInfoIfNeeded();
      await checkoutPage.selectCreditCardPaymentIfNeeded();
      await checkoutPage.fillCreditCard(conf.payment.card_number, conf.payment.card_exp, conf.payment.card_cvv);
    });

    await test.step('3. Đặt hàng', async () => {
      await checkoutPage.placeOrder();
    });

    await test.step('4. Chấp nhận PPC Upsell', async () => {
      await upsellPage.acceptUpsell();
    });

    await test.step('5. Chờ màn hình Thank You', async () => {
      await upsellPage.verifyThankYouPage();
    });
  });

});
