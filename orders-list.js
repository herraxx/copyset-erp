/* CopySet ERP — canonical Tilaukset list */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const legacy=()=>({
    filter:()=>{try{return typeof v2OrderFilter!=='undefined'?v2OrderFilter:'Kaikki'}catch(_e){return'Kaikki'}},
    setFilter:value=>{try{v2OrderFilter=value}catch(_e){window.v2OrderFilter=value}},
    query:()=>{try{return typeof q!=='undefined'?q:''}catch(_e){return window.q||''}},
    setQuery:value=>{try{q=value}catch(_e){window.q=value}}
  });

  function render(){
    const host=document.getElementById('orders');
    const state=root.state?.();
    if(!host||!state)return;
    const bridge=legacy(),filter=bridge.filter(),query=bridge.query();
    const all=(state.orders||[]).filter(o=>(o.mode||'Tilaus')!=='Tarjous').map(v2EnsureProducts);
    let visible=all.filter(o=>v2OrderMatch(o,filter)).sort((a,b)=>(a.deadline||'9999').localeCompare(b.deadline||'9999'));
    if(query){const z=query.toLowerCase();visible=visible.filter(o=>JSON.stringify(o).toLowerCase().includes(z))}
    const filters=['Kaikki','Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu','Myöhässä'];
    const count=f=>all.filter(o=>v2OrderMatch(o,f)).length;
    const row=o=>`<tr data-order-id="${E(o.id)}" style="cursor:pointer"><td><b>${E(o.no)}</b></td><td><b>${E(root.formatDate?root.formatDate(o.deadline):FI_DATE(o.deadline))}</b>${v2OrderLate(o)?'<div class="small" style="color:#b42318;font-weight:800">MYÖHÄSSÄ</div>':''}</td><td>${E(o.company)}</td><td>${o.products.map(p=>`${E(p.name)} · ${E(p.qty)}`).join('<br>')}</td><td><span class="badge ${statusClass(o.status)}">${E(o.status)}</span></td><td>${o.status==='Laskutettu'?'<span class="small">✓ Valmis</span>':o.status==='Vahvistettu'?`<button class="btn orange" data-action="start-production" data-id="${E(o.id)}">Aloita tuotanto →</button>`:`<button class="btn orange" data-action="advance" data-id="${E(o.id)}">${E(v2NextLabel(o))} →</button>`}</td></tr>`;
    host.innerHTML=`<div class="list-shell"><div class="list-tools"><input id="search" placeholder="Hae tilausnumero, asiakas tai tuote" value="${E(query)}"><div class="list-filters">${filters.map(f=>`<button class="list-filter ${filter===f?'on':''} ${f==='Myöhässä'?'late':''}" data-order-filter="${E(f)}">${f==='Myöhässä'?'⚠ ':''}${E(f)}<span class="count">${count(f)}</span></button>`).join('')}</div></div><div class="tablewrap"><table><thead><tr><th>Tilaus</th><th>Deadline</th><th>Asiakas</th><th>Tuotteet</th><th>Status</th><th>Seuraava vaihe</th></tr></thead><tbody>${visible.length?visible.map(row).join(''):'<tr><td colspan="6"><div class="order-empty">Ei tilauksia tällä rajauksella.</div></td></tr>'}</tbody></table></div></div>`;
    host.querySelectorAll('[data-order-filter]').forEach(button=>button.addEventListener('click',()=>{bridge.setFilter(button.dataset.orderFilter);render()}));
    host.querySelectorAll('[data-order-id]').forEach(tr=>tr.addEventListener('click',()=>openOrder(tr.dataset.orderId)));
    host.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();const id=button.dataset.id;if(button.dataset.action==='start-production')copysetStartProduction(id);else if(button.dataset.action==='advance')v2Advance(id)}));
    const input=host.querySelector('#search');
    if(input)input.addEventListener('input',event=>{bridge.setQuery(event.target.value);render();const next=host.querySelector('#search');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}});
  }
  root.renderOrders=render;
})();