// Run with: node tests/equipment.spec.cjs (serve the repo on port 8000 first).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/equipment-consumables.html');
 await page.waitForSelector('.shop-product');
 assert.equal(await page.locator('.shop-product').count(),16);
 assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete && !i.naturalWidth).length),0);
 await page.locator('#product-search').fill('scanbody');
 assert.equal(await page.locator('.shop-product').count(),2);
 await page.locator('#product-category').selectOption('Equipment & tools');
 assert.equal(await page.locator('.shop-product').count(),0);
 await page.locator('#reset-filters').click();
 await page.locator('[data-detail="01a_ti-base"]').first().click();
 assert.equal(await page.locator('#detail-title').textContent(),'Ti-Base');
 await page.locator('#product-dialog [data-add]').click();
 await page.keyboard.press('Escape');
 await page.locator('#open-cart').click();
 assert.equal(await page.locator('#cart-count').textContent(),'1');
 await page.locator('[data-delta="1"]').click();
 assert.equal(await page.locator('.shop-quantity output').textContent(),'2');
 await page.reload();
 assert.equal(await page.locator('#cart-count').textContent(),'2');
 await page.locator('#open-cart').click();
 await page.locator('#review-payment').click();
 assert(await page.locator('#payment-dialog').isVisible());
 assert(await page.getByRole('button',{name:'Online payment unavailable'}).isDisabled());
 assert((await page.locator('#email-cart').getAttribute('href')).includes('2%20%C3%97%20Ti-Base'));
 await page.keyboard.press('Escape');
 await page.locator('#open-cart').click();
 await page.locator('[data-remove]').click();
 assert(await page.locator('#review-payment').isDisabled());
 await page.keyboard.press('Escape');
 await page.evaluate(()=>localStorage.setItem('simply-dentrix-equipment-cart-v1','{"fake":5,"01a_ti-base":-10}'));
 await page.reload(); assert.equal(await page.locator('#cart-count').textContent(),'0');
 for (const width of [390,768,1440]) {
  await page.setViewportSize({width,height:1000});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
  await page.screenshot({path:`/workspace/scratch/7a4ac89cacb2/equipment-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);
 await browser.close(); console.log('PASS: catalog, filters, detail dialog, cart quantity/removal/persistence, invalid storage, payment gating, inquiry, images, and responsive widths.');
})().catch(e=>{console.error(e);process.exit(1)});
