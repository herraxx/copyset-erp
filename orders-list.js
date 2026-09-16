/* CopySet ERP — canonical Tilaukset list */
(function(){
  const root=window.CopySet=window.CopySet||{};
  function render(){
    const host=document.getElementById('orders');
    if(!host)return;
    const state=root.state?.();
    if(!state)return;
    let all=(state.orders||[]).filter(o=>(o.mode||'Tilaus')!=='Tarjous').map(v2EnsureProducts);
    let rows=all.filter(o=>v2OrderMatch(o,v2OrderFilter)).sort((a,b)=>(a.deadline||'9999').localeCompare(b.deadline||'9999'));
    if(q){const z=q.toLowerCase();rows=rows.filter(o=>JSON.stringify(o).toLowerCase().includes(z))}
    const filters=['Kaikki','Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu','Myöhässä'];
    const count=f=>all.filter(o=>v2OrderMatch(o,f)).length;
    host.innerHTML=`<div class="list-shell"><div class="list-tools"><input id="search" placeholder="Hae tilausnumero, asiakas tai tuote" value="${E(q)}"><div class="list-filters">${filters.map(f=>`<button class="list-filter ${v2OrderFilter===f?'on':''} ${f==='Myöhässä'?'late':''}" data-order-filter="${E(f)}">${f==='Myöhässä'?'⚠ ':''}${E(f)}<span class="count">${count(f)}</span></button>`).join('')}</div></div><div class="tablewrap"><table><tr><th>Tilaus</th><th>Deadline</th><th>Asiakas</th><th>Tuotteet</th><th>Status</th><th>Seuraava vaihe</th></tr>${rows.length?rows.map(o=>`<tr data-order-id="${E(o.id)}" style="cursor:pointer"><td><b>${E(o.no)}</b></td><td><b>${E(root.formatDate?root.formatDate(o.deadline):FI_DATE(o.deadline))}</b>${v2OrderLate(o)?'<div class="small" style="color:#b42318;font-weight:800">MYÖHÄSSÄ</div>':''}</td><td>${E(o.company)}</td><td>${o.products.map(p=>`${E(p.name)} · ${p.qty}`).join('<br>')}</td><td><span class="badge ${statusClass(o.status)}">${E(o.status)}</span></td><td>${o.status==='Laskutettu'?'<span class="small">✓ Valmis</span>':o.status==='Vahvistettu'?`<button class="btn orange" data-start-production="${E(o.id)}">Aloita tuotanto →</button>`:`<button class="btn orange" data-advance-order="${E(o.id)}">${v2NextLabel(o)} →</button>`}</td></tr>`).join(''):'<tr><td colspan="6"><div class="order-empty">Ei tilauksia tällä rajauksella.</div></td></tr>'}</table></div></div>`;
    host.querySelectorAll('[data-order-filter]').forEach(b=>b.onclick=()=>{v2OrderFilter=b.dataset.orderFilter;render()});
    host.querySelectorAll('[data-order-id]').forEach(tr=>tr.onclick=()=>openOrder(tr.dataset.orderId));
    host.querySelectorAll('[data-start-production]').forEach(b=>b.onclick=e=>{e.stopPropagation();copysetStartProduction(b.dataset.startProduction)});
    host.querySelectorAll('[data-advance-order]').forEach(b=>b.onclick=e=>{e.stopPropagation();v2Advance(b.dataset.advanceOrder)});
    const input=document.getElementById('search');
    if(input)input.oninput=e=>{q=e.target.value;render();const n=document.getElementById('search');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}};
  }
  root.renderOrders=render;
})();