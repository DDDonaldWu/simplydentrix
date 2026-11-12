const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(stored = null) {
 const elements = new Map(); const events = {}; const storage = new Map();
 if (stored !== null) storage.set('simply-dentrix-equipment-cart-v1', stored);
 function element(id) { if (!elements.has(id)) elements.set(id,{id,value:'',textContent:'',innerHTML:'',disabled:false,open:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn},showModal(){this.open=true},close(){this.open=false}}); return elements.get(id); }
 const context = {console,setTimeout:()=>0,clearTimeout(){},navigator:{clipboard:{writeText:async()=>{}}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:element,addEventListener:(name,fn)=>events[name]=fn,querySelector:()=>[...elements.values()].find(e=>e.open)},window:{addEventListener:(name,fn)=>events[name]=fn}};
 vm.createContext(context);
 for(const file of ['equipment-catalog.js','equipment-consumables.js']) vm.runInContext(fs.readFileSync('assets/js/'+file,'utf8'),context);
 const click = (dataset={},id='') => events.click({target:{closest:()=>({dataset,id,hasAttribute:()=>false})}});
 return {element,click,context,events,storage};
}
test('catalog and filters render all supplied products without prices or invented reviews',()=>{
 const {element,context}=setup();
 assert.equal(context.window.SD_EQUIPMENT_CATALOG.length,16);
 assert(context.window.SD_EQUIPMENT_CATALOG.every(p=>p.priceCents===null && fs.existsSync(p.image)));
 assert.equal(element('results-count').textContent,'16 of 16 products');
 element('product-search').value='scanbody'; element('product-search').listeners.input();
 assert.equal(element('results-count').textContent,'2 of 16 products');
 element('product-category').value='Equipment & tools'; element('product-category').listeners.change();
 assert.equal(element('results-count').textContent,'0 of 16 products');
 assert(element('product-grid').innerHTML.includes('No matching products'));
});
test('cart handles quantity limits, removal, persistence, and payment inquiry',()=>{
 const {click,element,storage}=setup(); const id='01a_ti-base';
 click({detail:id}); assert(element('product-dialog').open);
 assert(element('product-detail').innerHTML.includes('No customer reviews have been published'));
 click({add:id}); assert.equal(element('cart-count').textContent,1);
 click({change:id,delta:'1'}); assert.equal(element('cart-count').textContent,2);
 assert(element('email-cart').href.includes('2%20%C3%97%20Ti-Base'));
 for(let n=0;n<110;n++) click({add:id});
 assert.equal(element('cart-count').textContent,99);
 const saved=storage.get('simply-dentrix-equipment-cart-v1');
 assert.equal(setup(saved).element('cart-count').textContent,99);
 element('review-payment').listeners.click(); assert(element('payment-dialog').open);
 assert.equal(element('cart-total').textContent,'Pricing pending');
 click({remove:id}); assert.equal(element('cart-count').textContent,0);
 assert(element('review-payment').disabled);
});
test('corrupt, unknown, negative, oversized and non-integer stored values are discarded',()=>{
 for(const input of ['invalid','null','[]','{"fake":1,"01a_ti-base":-1}','{"01a_ti-base":100}','{"01a_ti-base":1.5}']) assert.equal(setup(input).element('cart-count').textContent,0);
});
test('storage errors do not break cart and cross-tab changes are synchronized',()=>{
 const s=setup(); s.context.localStorage.setItem=()=>{throw Error('blocked')};
 s.click({add:'01a_ti-base'}); assert.equal(s.element('cart-count').textContent,1);
 s.storage.set('simply-dentrix-equipment-cart-v1','{"01a_ti-base":3}');
 s.events.storage({key:'simply-dentrix-equipment-cart-v1'}); assert.equal(s.element('cart-count').textContent,3);
});
