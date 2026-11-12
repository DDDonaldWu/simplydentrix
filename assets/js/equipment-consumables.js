/* Static inquiry cart. No order, payment, review, or customer data is submitted here. */
(() => {
  'use strict';
  const products = window.SD_EQUIPMENT_CATALOG;
  const byId = new Map(products.map(p => [p.id, p]));
  const key = 'simply-dentrix-equipment-cart-v1';
  const $ = id => document.getElementById(id);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean = data => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return Object.fromEntries(Object.entries(data).filter(([id,q]) => byId.has(id) && Number.isInteger(q) && q > 0 && q <= 99));
  };
  let cart = {};
  try { cart = clean(JSON.parse(localStorage.getItem(key))); } catch (_) { /* Corrupt or unavailable storage starts with an empty cart. */ }
  let toastTimer;
  function announce(message) { clearTimeout(toastTimer); $('shop-status').textContent = message; toastTimer = setTimeout(() => { $('shop-status').textContent = ''; }, 3500); }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(cart)); }
    catch (_) { announce('Cart updated. Browser storage is unavailable; keep this page open.'); }
    renderCart();
  }
  function add(id) {
    if (!byId.has(id)) return;
    if ((cart[id] || 0) >= 99) { announce('Maximum quantity is 99. Contact us for larger quantities.'); return; }
    cart[id] = (cart[id] || 0) + 1; save(); announce(`${byId.get(id).name} added to cart.`);
  }
  function renderProducts() {
    const query = $('product-search').value.trim().toLowerCase();
    const category = $('product-category').value;
    let visible = products.filter(p => (!category || category === p.category) && `${p.name} ${p.category}`.toLowerCase().includes(query));
    if ($('product-sort').value === 'name') visible = visible.slice().sort((a,b) => a.name.localeCompare(b.name));
    $('results-count').textContent = `${visible.length} of ${products.length} products`;
    $('product-grid').innerHTML = visible.length ? visible.map(p => `<article class="shop-product"><button class="shop-product-image" data-detail="${escape(p.id)}" aria-label="Review ${escape(p.name)}"><img src="${escape(p.image)}" alt="${escape(p.name)}" loading="lazy" width="240" height="210"></button><div class="shop-product-copy"><span class="shop-product-category">${escape(p.category)}</span><h3>${escape(p.name)}</h3><p class="shop-price">Contact for pricing</p><div class="shop-product-actions"><button class="shop-text-button" data-detail="${escape(p.id)}" aria-label="View details for ${escape(p.name)}">View details</button><button class="shop-button" data-add="${escape(p.id)}" aria-label="Add ${escape(p.name)} to cart">Add to cart +</button></div></div></article>`).join('') : '<div class="shop-empty"><h3>No matching products</h3><p>Try another name or category.</p><button class="shop-text-button" id="reset-filters">Clear filters</button></div>';
  }
  function openDialog(id) {
    const current = document.querySelector('dialog[open]');
    if (current) current.close();
    $(id).showModal();
  }
  function detail(id) {
    const p = byId.get(id); if (!p) return;
    $('product-detail').innerHTML = `<div class="shop-detail-grid"><img src="${escape(p.image)}" alt="${escape(p.name)}" width="320" height="260"><div><p class="shop-eyebrow">${escape(p.category)}</p><h2 id="detail-title">${escape(p.name)}</h2><p>${escape(p.description)}</p><p class="shop-detail-note">Confirm implant system, dimensions, pack quantity, and compatibility with our team before purchasing. Photos are for product reference.</p><p class="shop-price">Contact for pricing · Availability on request</p><button class="shop-button" data-add="${escape(p.id)}">Add to cart +</button></div></div><section class="shop-reviews"><h3>Customer reviews</h3><p>No customer reviews have been published for this product.</p><a href="contact.html" class="shop-text-button">Ask a product question</a></section>`;
    openDialog('product-dialog');
  }
  function inquiryText() {
    return 'Hello Simply Dentrix,\n\nPlease confirm pricing, available options, compatibility, pack quantities, and lead times for:\n\n' + Object.entries(cart).map(([id,q]) => `${q} × ${byId.get(id).name}`).join('\n') + '\n\nPlease include shipping, tax, and payment instructions.\n\nThank you.';
  }
  function renderCart() {
    const entries = Object.entries(cart);
    $('cart-count').textContent = entries.reduce((n,[,q]) => n+q,0);
    $('cart-items').innerHTML = entries.length ? entries.map(([id,q]) => { const p = byId.get(id); return `<div class="shop-cart-row"><img src="${escape(p.image)}" alt="" width="65" height="65"><div><h3>${escape(p.name)}</h3><p>Contact for pricing</p><button class="shop-text-button" data-remove="${escape(id)}" aria-label="Remove ${escape(p.name)} from cart">Remove</button></div><div class="shop-quantity"><button data-change="${escape(id)}" data-delta="-1" aria-label="Decrease ${escape(p.name)} quantity">−</button><output aria-label="${escape(p.name)} quantity">${q}</output><button data-change="${escape(id)}" data-delta="1" aria-label="Increase ${escape(p.name)} quantity" ${q >= 99 ? 'disabled' : ''}>+</button></div></div>`; }).join('') : '<div class="shop-empty"><h3>Your cart is empty</h3><p>Add products from the collection to build your list.</p><button class="shop-text-button" data-close>Continue browsing</button></div>';
    $('cart-total').textContent = entries.length ? 'Pricing pending' : 'No items';
    $('review-payment').disabled = !entries.length;
    $('copy-cart').disabled = !entries.length;
    $('copy-status').textContent = '';
    $('email-cart').href = 'mailto:simplydentrix@gmail.com?subject=' + encodeURIComponent('Equipment & consumables inquiry') + '&body=' + encodeURIComponent(inquiryText());
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.detail) detail(button.dataset.detail);
    if (button.dataset.add) add(button.dataset.add);
    if (button.dataset.remove) { delete cart[button.dataset.remove]; save(); }
    if (button.dataset.change) {
      const id = button.dataset.change; if (!cart[id]) return;
      const q = cart[id] + Number(button.dataset.delta);
      if (q <= 0) delete cart[id]; else cart[id] = Math.min(q,99);
      save();
    }
    if (button.hasAttribute('data-close')) button.closest('dialog').close();
    if (button.id === 'reset-filters') { $('product-search').value = ''; $('product-category').value = ''; renderProducts(); }
  });
  $('open-cart').addEventListener('click', () => { renderCart(); openDialog('cart-dialog'); });
  $('review-payment').addEventListener('click', () => { if (Object.keys(cart).length) openDialog('payment-dialog'); });
  $('copy-cart').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(inquiryText()); $('copy-status').textContent = 'Product list copied. Paste it into your message to our team.'; }
    catch (_) { $('copy-status').textContent = 'Copy is unavailable in this browser. Use Email product inquiry under payment options, or contact our team.'; }
  });
  $('product-search').addEventListener('input',renderProducts);
  $('product-category').addEventListener('change',renderProducts);
  $('product-sort').addEventListener('change',renderProducts);
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { try { cart = clean(JSON.parse(localStorage.getItem(key))); } catch (_) { cart = {}; } renderCart(); } });
  renderProducts(); renderCart();
})();
