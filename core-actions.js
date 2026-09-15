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
    if(typeof window.save==='function')save(); if(typeof window.closeM==='function')closeM(); if(typeof window.renderAll==='function')renderAll();
  };

  window.copysetSetProductionStep=function(id,step){
    const allowed=['Aloitettu','Käynnissä','Valmis']; if(!allowed.includes(step))return;
    const o=orderById(id); if(!o)return; o.productionStep=step;
    if(typeof window.logEvent==='function')try{logEvent(o,'Tuotanto: '+step);}catch(_e){} persist(); if(typeof window.openOrder==='function')openOrder(id);
  };

  function productionWorkCard(o){
    if(typeof window.normalizeOrder==='function')normalizeOrder(o);
    const vendor=o.production==='Alihankkija'&&typeof window.V==='function'?(V(o.supplierId)?.name||'Alihankkija'):'Copy-Set';
    const products=Array.isArray(o.products)&&o.products.length?o.products:[{name:o.product,qty:o.qty,desc:o.description,extras:o.extraLines||[]}];
    const productRows=products.map((p,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+E(p.name||'Tuote')+'</b>'+(p.desc?'<br><span class="small">'+E(p.desc)+'</span>':'')+'</td><td><b>'+E(p.qty||'—')+' kpl</b></td><td>'+E(vendor)+'</td></tr>').join('');
    const tasks=products.map((p,i)=>{const extras=Array.isArray(p.extras)?p.extras:[];return '<div class="doc-section"><h3>'+E(p.name||('TUOTE '+(i+1)))+' · TYÖVAIHEET</h3>'+(extras.length?'<div class="doc-checks">'+extras.map(x=>'<span>□ '+E(typeof x==='string'?x:(x.label||x.name||x.desc||'Lisätyö'))+'</span>').join('')+'</div>':'<div class="doc-note">'+E(p.desc||o.description||'Ei erillisiä työvaiheita.')+'</div>')+'</div>';}).join('');
    const ds=o.deliveries||[];
    const body='<div class="doc-grid"><div><b>ASIAKAS</b><br>'+E(o.company||'')+'<br>'+E(o.contact||'')+'<br>'+E(o.email||'')+' · '+E(o.phone||'')+'</div><div><b>AIKATAULU</b><br>Tilaus '+E(FI_DATE(o.date)||'—')+'<br>Deadline <strong>'+E(FI_DATE(o.deadline)||'—')+'</strong><br>Toimitus '+E(FI_DATE(o.deliveryDate)||'—')+'</div></div><div class="doc-section"><h3>TYÖN TIEDOT</h3><table class="doc-table"><tr><th>#</th><th>Tuote / ohje</th><th>Määrä</th><th>Tuotanto</th></tr>'+productRows+'</table></div>'+tasks+'<div class="doc-section"><h3>TOIMITUS</h3><p>'+E(o.shipping||'')+'</p>'+(ds.length?ds.map((d,i)=>'<p><b>'+(i+1)+'. '+E(d.recipient||o.company)+'</b><br>'+E(d.address||'')+' · '+E(d.zip||'')+' '+E(d.city||'')+' · '+E(d.country||'Suomi')+(d.info?'<br>'+E(d.info):'')+'</p>').join(''):'<p>Nouto Copy-Setistä.</p>')+'</div><div class="doc-section"><h3>TUOTANNON TARKISTUS</h3><div class="doc-checks"><span>□ Aineisto tarkistettu</span><span>□ Tuotanto valmis</span><span>□ Jälkikäsittely valmis</span><span>□ Pakattu</span></div></div><div class="doc-no-price">TUOTANTOLAPPU · EI HINTATIETOJA</div>';
    return typeof window.docShell==='function'?docShell('TUOTANTOLAPPU','Työ #'+o.no,body):body;
  }
  window.productionDocHtml=productionWorkCard;
  window.showProductionDoc=function(id){const o=orderById(id);if(!o)return;if(typeof window.showDoc==='function')showDoc(id,'Tuotantolappu · #'+o.no,productionWorkCard(o));};

  function decorateOrder(id){
    const o=orderById(id),body=document.getElementById('mb'); if(!o||!body)return;
    if(o.status==='Tuotannossa'&&!body.querySelector('#copyset-production-steps')){
      const cur=o.productionStep||'Aloitettu',card=document.createElement('div'); card.className='card'; card.id='copyset-production-steps';
      card.innerHTML='<h3>Tuotannon eteneminen</h3><div class="actions">'+['Aloitettu','Käynnissä','Valmis'].map(s=>'<button type="button" class="btn '+(cur===s?'orange':'')+'" data-production-step="'+s+'">'+(cur===s?'✓ ':'')+s+'</button>').join('')+'</div>';
      card.querySelectorAll('[data-production-step]').forEach(b=>b.onclick=()=>copysetSetProductionStep(id,b.dataset.productionStep)); const wf=body.querySelector('.wf'); if(wf)wf.insertAdjacentElement('afterend',card); else body.prepend(card);
    }
    const actionGroups=[...body.querySelectorAll('.actions')],actions=actionGroups[actionGroups.length-1];
    if(actions&&!actions.querySelector('.copyset-delete')){const b=document.createElement('button');b.type='button';b.className='btn danger copyset-delete';b.textContent='Poista '+(o.mode==='Tarjous'?'tarjous':'tilaus');b.onclick=()=>copysetDeleteOrder(id);actions.prepend(b);}
    if(typeof window.copysetEnhancePricing==='function')copysetEnhancePricing();
  }

  const baseOpenOrder=window.openOrder;if(typeof baseOpenOrder==='function')window.openOrder=function(id){const result=baseOpenOrder.apply(this,arguments);queueMicrotask(()=>decorateOrder(id));return result;};
  const baseOpenQuoteWork=window.openQuoteWork;if(typeof baseOpenQuoteWork==='function')window.openQuoteWork=function(id){const result=baseOpenQuoteWork.apply(this,arguments);queueMicrotask(()=>decorateOrder(id));return result;};
})();