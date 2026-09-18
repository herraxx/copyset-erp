/* CopySet ERP — canonical offer review, send and rejection actions. */
(function(){
 const root=window.CopySet=window.CopySet||{},esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const get=id=>root.getOrder?.(id),body=()=>document.getElementById('mb'),modal=()=>document.getElementById('modal'),title=()=>document.getElementById('mt');
 const products=o=>Array.isArray(o.products)&&o.products.length?o.products:[{name:o.product,qty:o.qty,price:o.price,desc:o.description}];
 function stage(o){return o.quoteStage||o.offerStatus||'Luonnos'}
 function total(o){return products(o).reduce((s,p)=>s+(root.parseNumber?.(p.price,0)||0)+(Array.isArray(p.extras)?p.extras.reduce((a,x)=>a+(root.parseNumber?.(x.price,0)||0),0):0),0)+(root.parseNumber?.(o.setupFee,0)||0)+(root.parseNumber?.(o.billingFee,0)||0)+(root.parseNumber?.(o.deliveryPrice,0)||0)}
 function reviewHtml(o){
  const money=v=>root.formatMoney?.(v)||((Number(v)||0).toLocaleString('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2})+' €');
  const ps=products(o),net=total(o),vatRate=Number(o.vatRate??root.config?.domesticVat??25.5),vat=net*vatRate/100,gross=net+vat;
  const rows=ps.map((p,i)=>{
   const extras=Array.isArray(p.extras)?p.extras:[];
   const productTotal=(Number(p.price)||0)+extras.reduce((s,x)=>s+(Number(x.price)||0),0);
   return `<tr><td><b>${i+1}. ${esc(p.name)}</b>${p.desc?`<div style="margin-top:5px;color:#59636e;white-space:pre-line">${esc(p.desc)}</div>`:''}</td><td>${esc(p.qty)} kpl</td><td style="text-align:right"><b>${money(p.price)}</b></td></tr>${extras.map(x=>`<tr style="background:#fafbfc"><td style="padding-left:28px"><span style="color:#ef7f1a;font-weight:900">+</span> ${esc(x.name)}</td><td>Lisätyö</td><td style="text-align:right">${money(x.price)}</td></tr>`).join('')}${extras.length?`<tr><td colspan="2" style="text-align:right;color:#59636e"><b>${esc(p.name)} yhteensä</b></td><td style="text-align:right"><b>${money(productTotal)}</b></td></tr>`:''}`;
  }).join('');
  const delivery=(o.deliveries||[])[0]||{};
  return `<div class="doc-preview quote-doc"><article class="doc-paper" style="min-height:auto">
   <header class="doc-head"><div class="doc-logo">COPY<span>-SET</span></div><div class="doc-title">TARJOUS<small>${esc(o.no||'')}</small></div></header>
   <div class="doc-accent"></div>
   <div class="doc-grid">
    <div><h3 style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;color:#66707a">ASIAKAS</h3><b>${esc(o.company)}</b><p style="margin:6px 0 0">${esc(o.contact)}<br>${esc(o.email)}${o.phone?' · '+esc(o.phone):''}</p></div>
    <div><h3 style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;color:#66707a">TARJOUSTIEDOT</h3><p style="margin:0"><b>Tarjousnumero:</b> ${esc(o.no)}<br><b>Päiväys:</b> ${esc(root.formatDate?.(o.date)||o.date)}<br><b>Voimassa:</b> ${esc(root.formatDate?.(o.valid)||o.valid)} asti${o.name?`<br><b>Projekti:</b> ${esc(o.name)}`:''}</p></div>
   </div>
   <section class="doc-section"><h3>TUOTTEET, LISÄTYÖT JA HINNAT</h3><table class="doc-table"><thead><tr><th style="width:62%">Tuote / työ</th><th style="width:16%">Määrä</th><th style="width:22%;text-align:right">Hinta alv 0 %</th></tr></thead><tbody>${rows}</tbody></table></section>
   <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.72fr);gap:24px;margin-top:24px;align-items:start">
    <div class="doc-note"><b>Toimitus ja ehdot</b><br>Toimitustapa: ${esc(o.shipping||'—')}<br>${delivery.address?`Toimitusosoite: ${esc(delivery.address)}, ${esc(delivery.zip)} ${esc(delivery.city)}<br>`:''}Maksuehto: ${esc(o.paymentTerms||'21 pv')}<br>Hinnat alv 0 %, ellei toisin mainita.</div>
    <div style="border:1px solid #dfe3e8;border-radius:10px;padding:14px">
     <div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;margin:6px 0"><span>Tuotteet ja lisätyöt</span><b>${money(ps.reduce((s,p)=>s+(Number(p.price)||0)+(Array.isArray(p.extras)?p.extras.reduce((a,x)=>a+(Number(x.price)||0),0):0),0))}</b></div>
     <div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;margin:6px 0"><span>Aloituskustannus</span><b>${money(o.setupFee)}</b></div>
     <div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;margin:6px 0"><span>Laskutuslisä</span><b>${money(o.billingFee)}</b></div>
     ${Number(o.deliveryPrice)?`<div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;margin:6px 0"><span>Toimitus</span><b>${money(o.deliveryPrice)}</b></div>`:''}
     <div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;border-top:1px solid #dfe3e8;padding-top:8px;margin-top:8px"><span>Yhteensä alv 0 %</span><b>${money(net)}</b></div>
     <div class="pricing-line" style="display:flex;justify-content:space-between;gap:16px;margin:6px 0"><span>ALV ${String(vatRate).replace('.',',')} %</span><b>${money(vat)}</b></div>
     <div style="display:flex;justify-content:space-between;gap:16px;margin-top:10px;padding-top:10px;border-top:3px solid #ef7f1a;font-size:18px"><span><b>Yhteensä</b></span><b>${money(gross)}</b></div>
    </div>
   </div>
   <div style="margin-top:26px;padding-top:12px;border-top:1px solid #dfe3e8;color:#68727c;font-size:11px">Copy-Set Oy · Kiitos tarjouspyynnöstä.</div>
  </article></div>`
 }
 function open(id){const o=get(id);if(!o)return false;title().textContent=`Tarjous · ${o.no}`;body().innerHTML=`<div class="mode-banner"><b>TARJOUS</b><span>${esc(stage(o))}</span></div>${reviewHtml(o)}<div class="actions quote-dialog-actions"><button class="btn" data-edit>Muokkaa</button>${stage(o)==='Luonnos'?'<button class="btn orange" data-check>Tarkista tarjous</button>':''}${stage(o)==='Valmis lähetettäväksi'?'<button class="btn orange" data-send>Avaa ja lähetä</button>':''}${stage(o)==='Lähetetty'?'<button class="btn orange" data-accept>Merkitse asiakkaan hyväksymäksi</button>':''}${stage(o)==='Hyväksytty'?'<button class="btn orange" data-accept>Avaa / luo tilaus</button>':''}${!['Hyväksytty','Hylätty'].includes(stage(o))?'<button class="btn" data-reject>Hylkää tarjous</button>':''}</div>`;modal().classList.add('on');body().querySelector('[data-edit]')?.addEventListener('click',()=>root.orderForm?.edit?.(id));body().querySelector('[data-check]')?.addEventListener('click',()=>check(id));body().querySelector('[data-send]')?.addEventListener('click',()=>send(id));body().querySelector('[data-accept]')?.addEventListener('click',()=>stage(o)==='Lähetetty'?askAccept(id):root.quotes?.accept?.(id));body().querySelector('[data-reject]')?.addEventListener('click',()=>reject(id));return true}
 function askAccept(id){const o=get(id);if(!o)return false;if(stage(o)!=='Lähetetty')return root.quotes?.accept?.(id);open(id);const actions=body().querySelector('.quote-dialog-actions');if(!actions)return false;actions.innerHTML=`<div style="width:100%;border:2px solid #ef7f1a;background:#fff8f1;border-radius:12px;padding:16px"><b style="display:block;font-size:16px;margin-bottom:6px">Onko asiakas hyväksynyt tarjouksen?</b><div style="color:#59636e;margin-bottom:14px">Vahvistaminen luo tarjouksesta tilauksen. Tarjous ei muutu ennen vahvistamista.</div><div class="actions" style="justify-content:flex-end"><button type="button" class="btn" data-cancel-accept>Peruuta</button><button type="button" class="btn orange" data-confirm-accept>✓ Vahvista ja luo tilaus</button></div></div>`;actions.querySelector('[data-cancel-accept]')?.addEventListener('click',()=>open(id));actions.querySelector('[data-confirm-accept]')?.addEventListener('click',()=>root.quotes?.accept?.(id));return true}
 function check(id){const o=get(id);if(!o)return false;o.quoteStage=o.offerStatus='Valmis lähetettäväksi';o.quoteReviewed=true;delete o.quoteApproved;logEvent(o,'Tarjous tarkistettu ja hyväksytty lähettämistä varten');root.persist?.({render:false});root.renderQuotes?.();open(id);return true}
 function send(id){const o=get(id);if(!o)return false;o.quoteStage=o.offerStatus='Lähetetty';o.quoteSentAt=new Date().toISOString();logEvent(o,'Tarjous merkitty lähetetyksi asiakkaalle');root.persist?.({render:false});root.renderQuotes?.();open(id);return true}
 function reject(id){const o=get(id);if(!o||!confirm('Merkitäänkö tarjous hylätyksi?'))return false;o.quoteStage=o.offerStatus='Hylätty';logEvent(o,'Tarjous merkitty hylätyksi');root.persist?.({render:false});root.renderQuotes?.();open(id);return true}
 window.openQuoteWork=open;window.showPreflight=check;window.showQuote=send;window.rejectQuote=reject;root.quoteActions=Object.freeze({open,check,send,askAccept,reject});
})();
