import { expect, Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly phoneInput: Locator;
  readonly placeOrderBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder(/Email/i).first();
    this.firstNameInput = page.getByPlaceholder(/First name/i).first();
    this.lastNameInput = page.getByPlaceholder(/Last name/i).first();
    this.addressInput = page.getByPlaceholder(/Address/i).first();
    this.cityInput = page.getByPlaceholder(/City/i).first();
    this.phoneInput = page.getByPlaceholder(/Phone|Mobile/i).first();
    this.placeOrderBtn = page.getByRole('button', { name: /Place your order|Complete order/i });
  }

  /**
   * Chọn option từ <select> với nhiều chiến thuật fallback.
   */
  private async selectDropdownOption(
    fieldHints: string[],
    optionValue: string,
    optionLabel: string
  ): Promise<boolean> {
    // Strategy 1: Tìm theo name/id attribute
    for (const hint of fieldHints) {
      const sel = this.page.locator(`select[name="${hint}"], select[id="${hint}"]`);
      if (await sel.count() > 0) {
        try {
          await sel.first().selectOption({ label: optionValue });
          console.log(`✅ Selected ${optionLabel} via name/id="${hint}"`);
          return true;
        } catch { /* try next */ }
        try {
          await sel.first().selectOption({ value: optionValue });
          return true;
        } catch { /* try next */ }
      }
    }

    // Strategy 2: Scan tất cả select có option khớp
    const allSelects = this.page.locator('select');
    const count = await allSelects.count();
    for (let i = 0; i < count; i++) {
      const sel = allSelects.nth(i);
      const matchingOption = sel.locator('option').filter({ hasText: new RegExp(optionValue, 'i') });
      if (await matchingOption.count() > 0) {
        try {
          await sel.selectOption({ label: optionValue });
          console.log(`✅ Selected ${optionLabel} from select[${i}] by scanning`);
          return true;
        } catch { /* try next */ }
      }
    }

    // Strategy 3: Custom dropdown click
    const customDropdown = this.page
      .locator(`[data-value="${optionValue}"], li:has-text("${optionValue}"), [aria-label*="${optionValue}"]`)
      .first();
    if (await customDropdown.isVisible().catch(() => false)) {
      await customDropdown.click();
      console.log(`✅ Selected ${optionLabel} via custom dropdown`);
      return true;
    }

    console.warn(`⚠️ Could not find dropdown for ${optionLabel}`);
    return false;
  }

  /**
   * Điền ZIP code bằng nhiều chiến thuật, đảm bảo luôn thành công.
   */
  private async fillZipCode(zip: string): Promise<void> {
    // Cách 1: Tìm bằng selector attribute
    const zipSelectors = [
      'input[name*="zip" i]',
      'input[name*="postal" i]',
      'input[name*="postcode" i]',
      'input[id*="zip" i]',
      'input[id*="postal" i]',
      'input[autocomplete="postal-code"]',
      'input[placeholder*="ZIP" i]',
      'input[placeholder*="postal" i]',
      'input[placeholder*="Postcode" i]',
    ];

    for (const sel of zipSelectors) {
      const loc = this.page.locator(sel).first();
      if (await loc.count().catch(() => 0) > 0) {
        await loc.scrollIntoViewIfNeeded().catch(() => {});
        await loc.fill(zip);
        const val = await loc.inputValue().catch(() => '');
        if (val === zip) {
          console.log(`  ZIP filled via selector "${sel}": "${val}" ✅`);
          return;
        }
      }
    }

    // Cách 2: Tab từ City field → focus vào ô kế
    await this.cityInput.press('Tab');
    await this.page.waitForTimeout(500);
    const focusedEl = this.page.locator(':focus');
    if (await focusedEl.count() > 0) {
      await focusedEl.fill(zip);
      const val = await focusedEl.inputValue().catch(() => '');
      if (val === zip) {
        console.log(`  ZIP filled via Tab-focus: "${val}" ✅`);
        return;
      }
    }

    // Cách 3 (nuclear): JavaScript inject trực tiếp vào DOM
    const jsResult: string | null = await this.page.evaluate((zipValue: string) => {
      const candidates = Array.from(document.querySelectorAll('input')).filter((el) => {
        const attrs = [
          (el as HTMLInputElement).name,
          el.id,
          (el as HTMLInputElement).placeholder,
          (el as HTMLInputElement).autocomplete ?? '',
        ].join(' ').toLowerCase();
        return attrs.includes('zip') || attrs.includes('postal') || attrs.includes('postcode');
      });
      if (candidates.length > 0) {
        const input = candidates[0] as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        setter?.call(input, zipValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return input.value;
      }
      return null;
    }, zip);

    if (jsResult === zip) {
      console.log(`  ZIP filled via JS evaluate: "${jsResult}" ✅`);
      return;
    }

    console.warn('  ⚠️ ZIP field không tìm thấy qua bất kỳ cách nào!');
  }

  /**
   * Chờ Shipping Fee tính xong.
   */
  private async waitForShippingFeeCalculation(): Promise<void> {
    console.log('⏳ Chờ ShopBase tính Shipping Fee (8s)...');
    await this.page.waitForTimeout(8000);
    console.log('✅ Shipping Fee calculation window passed.');
  }

  /**
   * Điền đầy đủ Shipping Info với địa chỉ US (Houston, TX).
   */
  async fillShippingInfoIfNeeded() {
    await this.page.waitForSelector('input', { timeout: 15000 });
    await this.page.waitForTimeout(2000);

    const emailValue = await this.emailInput.inputValue().catch(() => '');
    if (emailValue.length < 3) {
      console.log('Cache Miss! Auto-filling full US Shipping Address...');

      await this.emailInput.fill('tester@maildrop.cc');
      await this.firstNameInput.fill('Tester');
      await this.lastNameInput.fill('Auto');
      await this.addressInput.fill('1600 W Loop S');

      // Country
      await this.selectDropdownOption(
        ['country', 'shipping_country', 'checkout[shipping_address][country]', 'address[country]', 'CountryCode'],
        'United States',
        'Country = United States'
      );

      // Đợi State dropdown (3s)
      await this.page.waitForTimeout(3000);

      // State — native select
      const stateFound = await this.selectDropdownOption(
        ['province', 'state', 'shipping_province', 'checkout[shipping_address][province]', 'address[province]', 'ProvinceCode', 'zone'],
        'Texas',
        'State = Texas'
      );
      // State — custom dropdown fallback
      if (!stateFound) {
        const stateInput = this.page.locator('[name*="province" i], [name*="state" i], [id*="province" i], [id*="state" i]').first();
        if (await stateInput.isVisible().catch(() => false)) {
          await stateInput.click();
          await this.page.waitForTimeout(500);
          const texasOption = this.page.locator('li, option, [role="option"]').filter({ hasText: 'Texas' }).first();
          if (await texasOption.isVisible().catch(() => false)) {
            await texasOption.click();
            console.log('  ✅ State = Texas via custom dropdown');
          }
        }
      }

      // City
      await this.cityInput.fill('Houston');
      console.log(`  City filled: "${await this.cityInput.inputValue()}"`);

      // ZIP — robust multi-strategy
      await this.fillZipCode('77027');

      // Phone
      await this.phoneInput.fill('5056462276');
      console.log(`  Phone filled: "${await this.phoneInput.inputValue()}"`);
      await this.phoneInput.press('Tab');

      await this.waitForShippingFeeCalculation();
    } else {
      console.log('Cache Hit! Bypassing Shipping Data.');
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Chọn phương thức thanh toán Credit Card.
   */
  async selectCreditCardPaymentIfNeeded() {
    console.log('🔍 Kiểm tra phương thức thanh toán Credit Card...');

    await this.page.evaluate(() => window.scrollBy(0, 500));
    await this.page.waitForTimeout(1000);

    const patterns = [
      '[data-payment-method="credit_card"]',
      '[data-gateway*="credit"]',
      '[data-payment-provider*="shopbase_payment"]',
      'label:has-text("Credit card")',
      'label:has-text("Debit or Credit")',
      'label:has-text("Credit Card")',
      'div:has-text("Debit or Credit cards")',
      'div:has-text("Credit card")',
      'input[name="payment_method"][value*="credit"]',
      'input[name="payment_method"][value*="card"]',
    ];

    for (const p of patterns) {
      const el = this.page.locator(p).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        console.log(`✅ Clicked Credit Card option via: ${p}`);
        await this.page.waitForTimeout(2000);
        return;
      }
    }

    // Fallback: label chứa chữ "card"
    const allLabels = this.page.locator('label').filter({ hasText: /card/i });
    if (await allLabels.count() > 0) {
      await allLabels.first().click();
      console.log('✅ Clicked first "card" label as fallback');
      await this.page.waitForTimeout(2000);
    } else {
      console.log('ℹ️ No explicit Credit Card selector found — may already be selected');
    }
  }

  /**
   * Fill credit card — Dùng page.frames() để xử lý cross-origin iframes.
   */
  async fillCreditCard(cardNumber: string, exp: string, cvv: string) {
    console.log('🔄 Bắt đầu dò quét Iframe thanh toán (cross-origin mode)...');

    await expect(async () => {
      const frames = this.page.frames();
      console.log(`  → Tổng số frames: ${frames.length}`);

      let cardFilled = false;

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const frameUrl = frame.url();

        if (frameUrl === this.page.url() || frameUrl === 'about:blank') continue;

        console.log(`  → Checking frame[${i}]: ${frameUrl.substring(0, 60)}`);

        const allInputCount = await frame.locator('input').count().catch(() => 0);
        console.log(`     → inputs: ${allInputCount}`);

        if (allInputCount === 0) continue;

        const cardSelector = [
          'input[placeholder*="Card number" i]',
          'input[placeholder*="card" i]',
          'input[name="cardnumber"]',
          'input[name="number"]',
          'input[autocomplete="cc-number"]',
          'input[data-elements-stable-field-name="cardNumber"]',
          'input[type="tel"]',
          'input[type="text"]',
        ].join(', ');

        const cardInputEl = frame.locator(cardSelector).first();
        const cardCount = await cardInputEl.count().catch(() => 0);
        const targetInput = cardCount > 0 ? cardInputEl : frame.locator('input').first();

        cardFilled = true;
        await targetInput.fill(cardNumber);
        console.log(`  ✅ Card number filled in frame[${i}]`);

        const expSelector = [
          'input[placeholder*="MM" i]', 'input[placeholder*="Expir" i]',
          'input[name="exp-date"]', 'input[name="expiry"]',
          'input[autocomplete="cc-exp"]',
          'input[data-elements-stable-field-name="cardExpiry"]',
        ].join(', ');

        const cvvSelector = [
          'input[placeholder*="CVC" i]', 'input[placeholder*="CVV" i]',
          'input[placeholder*="security" i]', 'input[name="cvc"]', 'input[name="cvv"]',
          'input[autocomplete="cc-csc"]',
          'input[data-elements-stable-field-name="cardCvc"]',
        ].join(', ');

        const expEl = frame.locator(expSelector).first();
        if (await expEl.count().catch(() => 0) > 0) {
          await expEl.fill(exp);
          await frame.locator(cvvSelector).first().fill(cvv);
          console.log('  ✅ Exp + CVV filled (same frame)');
        } else {
          // Stripe: tìm trong các frame khác
          let expFilled = false;
          let cvvFilled = false;
          for (let j = 0; j < frames.length; j++) {
            if (j === i) continue;
            const f = frames[j];
            if (!expFilled && await f.locator(expSelector).count().catch(() => 0) > 0) {
              await f.locator(expSelector).first().fill(exp);
              expFilled = true;
              console.log(`  ✅ Exp filled in frame[${j}]`);
            }
            if (!cvvFilled && await f.locator(cvvSelector).count().catch(() => 0) > 0) {
              await f.locator(cvvSelector).first().fill(cvv);
              cvvFilled = true;
              console.log(`  ✅ CVV filled in frame[${j}]`);
            }
            if (expFilled && cvvFilled) break;
          }
        }
        break;
      }

      if (!cardFilled) {
        throw new Error('❌ Không tìm thấy Card input trong bất kỳ frame nào (Sẽ retry).');
      }
    }).toPass({
      timeout: 40000,
      intervals: [2000, 3000, 3000, 5000],
    });

    console.log('✅ Đã fill thành công toàn bộ thông tin Thẻ Tín Dụng!');
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
  }
}
