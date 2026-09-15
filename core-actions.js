/* CopySet ERP consolidated order actions */
(function(){
  function orderById(id){ return window.st && Array.isArray(st.orders) ? st.orders.find(x=>x.id===id) : null; }
  function persist(){ if(typeof window.save==='function') save(); if(typeof window.renderAll==='function') renderAll(); }

  window.copysetDeleteOrder=function(id){
    const o=orderById(id); if(!o)return;
    const kind=o.mode==='Tarjous'?'tarjous':'tilaus';
    if(!confirm('Poistetaanko '+kind+' '+(o.no||'')+'?'))return;
    st.orders=st.orders.filter(x=>x.id!==id);
    if(typeof window.logEvent==='function') try{logEvent(o,'Poistettu: '+(o.no||''));}catch(_e){}
    if(typeof window.save==='function')save();
    if(typeof window.closeM==='function')closeM();
    if(typeof window.renderAll==='function')renderAll();
  };

  window.copysetSetProductionStep=function(id,step){
    const allowed=['Aloitettu','Käynnissä','Valmis'];
    if(!allowed.includes(step))return;
    const o=orderById(id); if(!o)return;
    o.productionStep=step;
    if(typeof window.logEvent==='function')try{logEvent(o,'Tuotanto: '+step);}catch(_e){}
    persist();
    if(typeof window.openOrder==='function')openOrder(id);
  };

  function decorateOrder(id){
    const o=orderById(id),body=document.getElementById('mb'); if(!o||!body)return;
    if(o.status==='Tuotannossa'&&!body.querySelector('#copyset-production-steps')){
      const cur=o.productionStep||'Aloitettu';
      const card=document.createElement('div'); card.className='card'; card.id='copyset-production-steps';
      card.innerHTML='<h3>Tuotannon eteneminen</h3><div class="actions">'+['Aloitettu','Käynnissä','Valmis'].map(s=>'<button type="button" class="btn '+(cur===s?'orange':'')+'" data-production-step="'+s+'">'+(cur===s?'✓ ':'')+s+'</button>').join('')+'</div>';
      card.querySelectorAll('[data-production-step]').forEach(b=>b.onclick=()=>copysetSetProductionStep(id,b.dataset.productionStep));
      const wf=body.querySelector('.wf'); if(wf)wf.insertAdjacentElement('afterend',card); else body.prepend(card);
    }
    const actionGroups=[...body.querySelectorAll('.actions')],actions=actionGroups[actionGroups.length-1];
    if(actions&&!actions.querySelector('.copyset-delete')){
      const b=document.createElement('button'); b.type='button'; b.className='btn danger copyset-delete';
      b.textContent='Poista '+(o.mode==='Tarjous'?'tarjous':'tilaus'); b.onclick=()=>copysetDeleteOrder(id); actions.prepend(b);
    }
    if(typeof window.copysetEnhancePricing==='function')copysetEnhancePricing();
  }

  const baseOpenOrder=window.openOrder;
  if(typeof baseOpenOrder==='function')window.openOrder=function(id){const result=baseOpenOrder.apply(this,arguments);queueMicrotask(()=>decorateOrder(id));return result;};
  const baseOpenQuoteWork=window.openQuoteWork;
  if(typeof baseOpenQuoteWork==='function')window.openQuoteWork=function(id){const result=baseOpenQuoteWork.apply(this,arguments);queueMicrotask(()=>decorateOrder(id));return result;};
})();