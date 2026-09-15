/* CopySet ERP — single production workflow controller. Loaded last. */
(function(){
  function order(id){return window.st&&Array.isArray(st.orders)?st.orders.find(o=>String(o.id)===String(id)):null}
  function saveAndRender(){if(typeof window.save==='function')window.save();if(typeof window.renderAll==='function')window.renderAll()}
  function openWorkCard(id){if(typeof window.copysetPrintWorkCard==='function')return window.copysetPrintWorkCard(id);if(typeof window.showProductionDoc==='function')return window.showProductionDoc(id)}

  function startProduction(id){
    const o=order(id);if(!o)return false;
    o.mode='Tilaus';o.status='Tuotannossa';o.productionStep='Aloitettu';o.artworkStatus='Aineisto OK';
    if(typeof window.logEvent==='function')try{window.logEvent(o,'Tuotanto aloitettu')}catch(_e){}
    /* Popup must be opened synchronously from the user's click. */
    openWorkCard(id);
    saveAndRender();
    return true;
  }
  window.copysetStartProduction=startProduction;

  /* Keep legacy calls compatible, but there is only one Vahvistettu -> Tuotannossa implementation. */
  const legacyAdvance=window.v2Advance;
  window.v2Advance=function(id){const o=order(id);if(o&&o.status==='Vahvistettu')return startProduction(id);return typeof legacyAdvance==='function'?legacyAdvance.apply(this,arguments):undefined};

  function currentModalOrderId(){
    const body=document.getElementById('mb');if(!body)return '';
    const title=(document.getElementById('mt')?.textContent||'')+' '+(body.querySelector('h1,h2')?.textContent||'');
    const no=(title.match(/Tilaus\s*#?\s*([A-Za-z0-9-]+)/i)||[])[1];
    if(!no)return '';
    const clean=String(no).replace(/^TIL-/i,'');
    const o=window.st?.orders?.find(x=>String(x.no||'')===no||String(x.no||'').replace(/^TIL-/i,'')===clean);
    return o?o.id:'';
  }
  function idFromElement(el){
    let n=el;
    while(n&&n!==document){
      const code=n.getAttribute&&n.getAttribute('onclick')||'';
      const m=code.match(/(?:copysetStartProduction|v2Advance|advance|setStatus|openOrder)\(['\"]([^'\"]+)['\"]/i);
      if(m)return m[1];
      n=n.parentElement;
    }
    return currentModalOrderId();
  }
  function isStart(el){
    if(!el)return false;
    const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    const code=(el.getAttribute&&el.getAttribute('onclick')||'').toLowerCase();
    return text.includes('aloita tuotanto')||text.includes('siirrä tuotantoon')||(text.includes('seuraava vaihe')&&text.includes('tuotannossa'))||code.includes('copysetstartproduction');
  }

  /* Capture only the visible action control. Never use the surrounding white row/card as the action. */
  document.addEventListener('click',function(e){
    const control=e.target.closest&&e.target.closest('button,a,[role="button"]');
    if(!isStart(control))return;
    const id=idFromElement(control);if(!id)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    startProduction(id);
  },true);

  /* Remove duplicated production-start controls from an opened order and keep one canonical button. */
  function cleanOrderModal(){
    const body=document.getElementById('mb');if(!body)return;
    const id=currentModalOrderId(),o=order(id);if(!o||o.mode==='Tarjous')return;
    const candidates=[...body.querySelectorAll('button,a,[role="button"]')].filter(isStart);
    if(o.status==='Vahvistettu'&&candidates.length){
      const keep=candidates[0];
      keep.textContent='Aloita tuotanto →';keep.classList.add('orange','copyset-production-start');
      keep.removeAttribute('onclick');keep.onclick=function(ev){ev.preventDefault();ev.stopPropagation();startProduction(id)};
      candidates.slice(1).forEach(x=>x.remove());
    }
    /* Repeated red missing-info panels add no value here; keep only the first one. */
    const warnings=[...body.querySelectorAll('.alert,.warning,.missing,.error')].filter(x=>/puuttu|täydennä/i.test(x.textContent||''));
    warnings.slice(1).forEach(x=>x.remove());
  }
  const mo=new MutationObserver(()=>queueMicrotask(cleanOrderModal));
  mo.observe(document.documentElement,{childList:true,subtree:true});
  queueMicrotask(cleanOrderModal);
})();