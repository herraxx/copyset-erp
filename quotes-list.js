/* CopySet ERP — canonical Tarjoukset list */
(function(){
  const root=window.CopySet=window.CopySet||{};
  function render(){
    const host=document.getElementById('quotes');
    if(!host)return;
    const state=root.state?.();
    if(!state)return;
    let all=(state.orders||[]).filter(o=>o.mode==='Tarjous');
    let rows=all.slice();
    if(quoteFilter!=='Kaikki')rows=rows.filter(o=>quoteStage(o)===quoteFilter);
    if(quoteSearch.trim()){const z=quoteSearch.toLowerCase();rows=rows.filter(o=>JSON.stringify(o).toLowerCase().includes(z))}
    rows.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const filters=['Kaikki','Luonnos','Valmis lähetettäväksi','Lähetetty','Hyväksytty','Hylätty'];
    const count=f=>f==='Kaikki'?all.length:all.filter(o=>quoteStage(o)===f).length;
    host.innerHTML=`<div class="list-shell"><div class="list-tools"><input id="quoteSearch" placeholder="Hae tarjousnumero, asiakas, tuote tai viite" value="${E(quoteSearch)}"><div class="list-filters">${filters.map(f=>`<button class="list-filter ${quoteFilter===f?'on':''}" data-quote-filter="${E(f)}">${E(f)}<span class="count">${count(f)}</span></button>`).join('')}</div></div><div class="list-note">Tarjoukset käsitellään täällä. Hyväksytystä tarjouksesta luodaan tilaus.</div><div class="tablewrap"><table><tr><th>Tarjous #</th><th>Päivä</th><th>Asiakas</th><th>Tuote</th><th>Summa alv 0</th><th>Tila</th><th>Myyjä</th><th></th></tr>${rows.length?rows.map(o=>{const qs=quoteStage(o);return `<tr><td><b>${E(o.no)}</b>${o.demo?'<span class="badge demo">DEMO</span>':''}</td><td>${E(root.formatDate?root.formatDate(o.date):FI_DATE(o.date))}</td><td>${E(o.company)}</td><td>${E(o.product)} · ${E(o.qty)} kpl</td><td>${EU(invoiceTotals(normalizeOrder(o)).net)}</td><td><span class="quote-stage ${quoteStageClass(qs)}">${E(qs)}</span></td><td>${E(o.salesperson||'Copy-Set')}</td><td><div class="quote-actions"><button class="btn" onclick="openQuoteWork('${o.id}')">Avaa</button>${qs==='Luonnos'?`<button class="btn dark" onclick="showPreflight('${o.id}')">Tarkista</button>`:''}${qs==='Valmis lähetettäväksi'?`<button class="btn dark" onclick="showQuote('${o.id}')">Lähetä</button>`:''}${qs==='Lähetetty'?`<button class="btn orange" onclick="quoteAcceptMenu('${o.id}')">Asiakas hyväksyi</button>`:''}${!['Hyväksytty','Hylätty'].includes(qs)?`<button class="btn" onclick="rejectQuote('${o.id}')">Hylkää</button>`:''}${qs==='Hyväksytty'&&o.convertedOrderId?`<button class="btn orange" onclick="openOrder('${o.convertedOrderId}')">Avaa tilaus</button>`:''}</div></td></tr>`}).join(''):'<tr><td colspan="8"><div class="order-empty">Ei tarjouksia tällä rajauksella.</div></td></tr>'}</table></div></div>`;
    host.querySelectorAll('[data-quote-filter]').forEach(b=>b.onclick=()=>{quoteFilter=b.dataset.quoteFilter;render()});
    const input=document.getElementById('quoteSearch');
    if(input)input.oninput=e=>{quoteSearch=e.target.value;render();const n=document.getElementById('quoteSearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}};
  }
  root.renderQuotes=render;
})();