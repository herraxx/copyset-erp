/* CopySet ERP — canonical Tarjoukset list */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const bridge={
    filter:()=>{try{return typeof quoteFilter!=='undefined'?quoteFilter:'Kaikki'}catch(_e){return'Kaikki'}},
    setFilter:value=>{try{quoteFilter=value}catch(_e){window.quoteFilter=value}},
    query:()=>{try{return typeof quoteSearch!=='undefined'?quoteSearch:''}catch(_e){return window.quoteSearch||''}},
    setQuery:value=>{try{quoteSearch=value}catch(_e){window.quoteSearch=value}}
  };

  function actions(o,stage){
    const id=E(o.id),buttons=[`<button class="btn" data-action="open" data-id="${id}">Avaa</button>`];
    if(stage==='Luonnos')buttons.push(`<button class="btn dark" data-action="preflight" data-id="${id}">Tarkista</button>`);
    if(stage==='Valmis lähetettäväksi')buttons.push(`<button class="btn dark" data-action="send" data-id="${id}">Lähetä</button>`);
    if(stage==='Lähetetty')buttons.push(`<button class="btn orange" data-action="accept" data-id="${id}">Asiakas hyväksyi</button>`);
    if(!['Hyväksytty','Hylätty'].includes(stage))buttons.push(`<button class="btn" data-action="reject" data-id="${id}">Hylkää</button>`);
    if(stage==='Hyväksytty'&&o.convertedOrderId)buttons.push(`<button class="btn orange" data-action="order" data-id="${E(o.convertedOrderId)}">Avaa tilaus</button>`);
    return buttons.join('');
  }

  function runAction(action,id){
    const handlers={open:openQuoteWork,preflight:showPreflight,send:showQuote,accept:quoteAcceptMenu,reject:rejectQuote,order:openOrder};
    const handler=handlers[action];
    if(typeof handler==='function')handler(id);
  }

  function render(){
    const host=document.getElementById('quotes');
    const state=root.state?.();
    if(!host||!state)return;
    const filter=bridge.filter(),query=bridge.query();
    const all=(state.orders||[]).filter(o=>o.mode==='Tarjous');
    let visible=all.slice();
    if(filter!=='Kaikki')visible=visible.filter(o=>quoteStage(o)===filter);
    if(query.trim()){const z=query.toLowerCase();visible=visible.filter(o=>JSON.stringify(o).toLowerCase().includes(z))}
    visible.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const filters=['Kaikki','Luonnos','Valmis lähetettäväksi','Lähetetty','Hyväksytty','Hylätty'];
    const count=f=>f==='Kaikki'?all.length:all.filter(o=>quoteStage(o)===f).length;
    const row=o=>{const stage=quoteStage(o);return `<tr><td><b>${E(o.no)}</b>${o.demo?'<span class="badge demo">DEMO</span>':''}</td><td>${E(root.formatDate?root.formatDate(o.date):FI_DATE(o.date))}</td><td>${E(o.company)}</td><td>${E(o.product)} · ${E(o.qty)} kpl</td><td>${EU(invoiceTotals(normalizeOrder(o)).net)}</td><td><span class="quote-stage ${quoteStageClass(stage)}">${E(stage)}</span></td><td>${E(o.salesperson||'Copy-Set')}</td><td><div class="quote-actions">${actions(o,stage)}</div></td></tr>`};
    host.innerHTML=`<div class="list-shell"><div class="list-tools"><input id="quoteSearch" placeholder="Hae tarjousnumero, asiakas, tuote tai viite" value="${E(query)}"><div class="list-filters">${filters.map(f=>`<button class="list-filter ${filter===f?'on':''}" data-quote-filter="${E(f)}">${E(f)}<span class="count">${count(f)}</span></button>`).join('')}</div></div><div class="list-note">Tarjoukset käsitellään täällä. Hyväksytystä tarjouksesta luodaan tilaus.</div><div class="tablewrap"><table><thead><tr><th>Tarjous #</th><th>Päivä</th><th>Asiakas</th><th>Tuote</th><th>Summa alv 0</th><th>Tila</th><th>Myyjä</th><th></th></tr></thead><tbody>${visible.length?visible.map(row).join(''):'<tr><td colspan="8"><div class="order-empty">Ei tarjouksia tällä rajauksella.</div></td></tr>'}</tbody></table></div></div>`;
    host.querySelectorAll('[data-quote-filter]').forEach(button=>button.addEventListener('click',()=>{bridge.setFilter(button.dataset.quoteFilter);render()}));
    host.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>runAction(button.dataset.action,button.dataset.id)));
    const input=host.querySelector('#quoteSearch');
    if(input)input.addEventListener('input',event=>{bridge.setQuery(event.target.value);render();const next=host.querySelector('#quoteSearch');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}});
  }
  root.renderQuotes=render;
})();