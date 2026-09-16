/* CopySet ERP — customer search/fill controller for offer and order forms. */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const api=()=>root.customerApi;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const searchSelectors=['#customerSearch','[name="customerSearch"]','[data-customer-search]'];
  function searchInput(form){for(const s of searchSelectors){const el=form.querySelector(s);if(el)return el}return null}
  function ensureResults(input){let box=input.parentElement?.querySelector('[data-copyset-customer-results]');if(box)return box;box=document.createElement('div');box.dataset.copysetCustomerResults='';box.className='customer-search-results';input.insertAdjacentElement('afterend',box);return box}
  function hide(box){if(box){box.hidden=true;box.innerHTML=''}}
  function render(form,input){const box=ensureResults(input),q=input.value.trim();if(!q){hide(box);return}const rows=(api()?.search(q)||[]).slice(0,8);box.innerHTML=rows.length?rows.map(c=>`<button type="button" class="customer-search-result" data-customer-id="${esc(c.id||c.customerId)}"><b>${esc(c.company||c.name)}</b><span>${esc(c.bid||c.businessId||'')}${c.city?' · '+esc(c.city):''}</span></button>`).join(''):'<div class="customer-search-empty">Ei löytynyt asiakkaita</div>';box.hidden=false}
  function bind(form){if(!form||form.dataset.copysetCustomerBound==='1')return false;const input=searchInput(form);if(!input)return false;form.dataset.copysetCustomerBound='1';input.setAttribute('autocomplete','off');input.addEventListener('input',()=>render(form,input));input.addEventListener('keydown',e=>{if(e.key==='Escape')hide(ensureResults(input))});form.addEventListener('click',e=>{const button=e.target.closest('[data-customer-id]');if(!button)return;const customer=api()?.find(button.dataset.customerId);if(customer){api().fillForm(form,customer);input.value=customer.company||customer.name||'';hide(ensureResults(input));input.focus()}});return true}
  document.addEventListener('copyset:order-form-rendered',e=>bind(e.detail?.root));
  root.customerForm=Object.freeze({bind});
})();