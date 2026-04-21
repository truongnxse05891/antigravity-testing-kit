const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('1. Opening product page...');
  await page.goto('https://plb-hyper-prod.onshopbase.com/products/30cm-cartoon-cute-snoopy-plush-toy-pillow-sofa-back-plush-doll-gifts-for-children', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  console.log('2. Clicking Add to Cart...');
  const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
  await addBtn.waitFor({ state: 'visible', timeout: 15000 });
  await addBtn.click();
  await page.waitForTimeout(2000);
  
  console.log('3. Going to checkout...');
  // Try clicking checkout, fallback to direct URL
  try {
    const checkoutBtn = page.locator('a, button').filter({ hasText: /Checkout/i }).last();
    await checkoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await checkoutBtn.click();
  } catch {
    await page.goto('https://plb-hyper-prod.onshopbase.com/checkout', { waitUntil: 'domcontentloaded' });
  }
  
  console.log('4. Waiting for checkout form...');
  await page.waitForTimeout(5000);
  
  // Dump all form elements
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tag: el.tagName, type: el.type || '', name: el.name || '', id: el.id || '',
      placeholder: el.placeholder || '', visible: el.offsetParent !== null,
      options: el.tagName === 'SELECT' ? Array.from(el.options).slice(0, 8).map(o => `${o.value}|${o.text.trim()}`) : undefined
    }));
  });
  
  console.log('\n=== VISIBLE FORM ELEMENTS ===');
  elements.filter(e => e.visible).forEach((el, idx) => {
    console.log(`[${idx}] <${el.tag}> name="${el.name}" id="${el.id}" placeholder="${el.placeholder}" type="${el.type}" ${el.options ? '\n  options: ' + el.options.join(', ') : ''}`);
  });
  
  console.log('\n=== ALL SELECT ELEMENTS (including hidden) ===');
  elements.filter(e => e.tag === 'SELECT').forEach((el, idx) => {
    console.log(`[${idx}] <SELECT> name="${el.name}" id="${el.id}" visible=${el.visible} ${el.options ? '\n  options: ' + el.options.join(', ') : ''}`);
  });
  
  // Search for country/state by name/id substring
  console.log('\n=== COUNTRY/STATE/PROVINCE ELEMENTS ===');
  const allEls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).filter(e => {
      const a = (e.name||'') + (e.id||'') + (e.className||'') + (e.getAttribute('data-testid')||'');
      return /country|state|province|region/i.test(a);
    }).map(e => ({
      tag: e.tagName, name: e.name||'', id: e.id||'', class: (e.className||'').substring(0,80),
      dataTestId: e.getAttribute('data-testid')||'', visible: e.offsetParent !== null
    }));
  });
  allEls.forEach((el, idx) => {
    console.log(`[${idx}] <${el.tag}> name="${el.name}" id="${el.id}" class="${el.class}" data-testid="${el.dataTestId}" visible=${el.visible}`);
  });

  console.log('\n5. Pausing for inspection - use F12 in the browser to check DOM...');
  await page.pause();
  
  await browser.close();
})().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
