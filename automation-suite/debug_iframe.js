const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Navigating to checkout...');
  await page.goto('https://plb-hyper-prod.onshopbase.com/products/30cm-cartoon-cute-snoopy-plush-toy-pillow-sofa-back-plush-doll-gifts-for-children', { waitUntil: 'domcontentloaded' });
  
  await page.locator('button', { hasText: /Add to cart/i }).first().click();
  await page.locator('button:has-text("Checkout")').first().click();
  
  console.log('Waiting for checkout to load...');
  await page.waitForLoadState('networkidle');

  // Find the exact iframes or inputs
  console.log('Evaluating iframes...');
  const data = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('iframe'));
    return list.map(f => ({
      id: f.id,
      name: f.name,
      title: f.title,
      src: f.src,
      className: f.className
    }));
  });
  console.log("IFRAMES:", JSON.stringify(data, null, 2));

  // Also check if there are standard inputs
  const inputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[name*="card"], input[name*="cvc"], input[name*="exp"]'));
      return inputs.map(i => ({ name: i.name, id: i.id, placeholder: i.placeholder}));
  });
  console.log("INPUTS IN MAIN DOM:", JSON.stringify(inputs, null, 2));

  await browser.close();
})();
