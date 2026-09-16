/* CopySet ERP — canonical pricing tool */
(function(){
  const root=window.CopySet=window.CopySet||{};
  let activeRow=null;
  const money=n=>root.formatMoney?root.formatMoney(n):(Number(n)||0).toLocaleString('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
  const rows=()=>[...document.querySelectorAll('#v2products .v2-product')];
  const presets=()=>{try{return typeof P!=='undefined'&&Array.isArray(P)?P:(Array.isArray(window.P)?window.P:[])}catch(_e){return Array.isArray(window.P)?window.P:[]}};

  function ensureStyle(){
    if(document.getElementById('copysetPricingStyle'))return;
    const s=document.createElement('style');
    s.id='copysetPricingStyle';
    s.textContent=`.pricing-modal{display:none;position:fixed;inset:0;z-index:20000;background:rgba(20,24,27,.72);padding:20px;overflow:auto}.pricing-modal.on{display:flex;align-items:center;justify-content:center}.pricing-sheet{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:16px;padding:18px;box-shadow:0 24px 70px #0006;color:#202428}.pricing-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:20px}.pricing-head button{border:0;background:#eef1f3;border-radius:9px;width:40px;height:40px;font-size:18px}.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.pricing-sheet label{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:800;color:#5d656c}.pricing-sheet input,.pricing-sheet textarea{box-sizing:border-box;width:100%;border:1px solid #ccd2d7;border-radius:9px;padding:11px;font-size:16px;background:#fff;color:#202428}.pricing-sheet textarea{min-height:70px}.pricing-result{margin:14px 0;background:#f5f7f8;border-radius:12px;padding:14px}.pricing-result small{display:block}.pricing-result strong{display:block;font-size:28px;color:#bd620f;margin:4px 0 8px}.pricing-use{width:100%;min-height:50px;border:0;border-radius:10px;background:#ef7f1a;color:#fff;font-size:14px;font-weight:900}.copyset-price-button,#copysetPricingLauncher{width:100%;margin-top:7px;min-height:42px}@media(max-width:650px){.pricing-modal{padding:0}.pricing-modal.on{align-items:flex-end}.pricing-sheet{width:100%;max-height:94dvh;border-radius:18px 18px 0 0;padding:15px}.pricing-grid{grid-template-columns:1fr 1fr}.pricing-head{position:sticky;top:-15px;background:#fff;z-index:2;padding:10px 0}.pricing-result strong{font-size:24px}}`;
    document.head.appendChild(s);
  }

  function ensureModal(){
    ensureStyle();
    let modal=document.getElementById('copysetPricingModal');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='copysetPricingModal';
    modal.className='pricing-modal';
    modal.innerHTML='<div class="pricing-sheet"><div class="pricing-head"><b>Hintalaskuri</b><button type="button" id="pricingClose">✕</button></div><div id="pricingBody"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector('#pricingClose').onclick=()=>modal.classList.remove('on');
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('on')});
    return modal;
  }

  function open(index){
    const all=rows(),r=all[index]||all[0];
    if(!r)return false;
    activeRow=r;
    const name=r.querySelector('.v2p-name')?.value||'Oma tuote';
    const qty=+r.querySelector('.v2p-qty')?.value||100;
    const price=+r.querySelector('.v2p-price')?.value||0;
    const preset=presets().find(x=>x[0]===name)||[name,.10,root.config?.setupFee||50];
    const modal=ensureModal(),body=modal.querySelector('#pricingBody');
    body.innerHTML=`<div class="pricing-grid"><label>Määrä<input id="pq" type="number" value="${qty}"></label><label>Yksikkökustannus €<input id="pu" type="number" step=".001" value="${+preset[1]||0}"></label><label>Tuotannon kiinteä kustannus €<input id="ps" type="number" step=".01" value="${+preset[2]||0}"></label><label>Hukka %<input id="pw" type="number" step=".1" value="5"></label><label>Lisätyöt €<input id="pe" type="number" step=".01" value="0"></label><label>Katekerroin<input id="pm" type="number" step=".01" value="1.55"></label></div><label>Huomio<textarea id="pn" placeholder="Aineistotyö, viimeistely, kiirelisä..."></textarea></label><div class="pricing-result"><small>Tuotteen myyntihinta ALV 0 %</small><strong id="pt">${money(price)}</strong><div id="pd"></div><small>Aloituskustannus ${money(root.config?.setupFee||50)} lisätään tilaukselle erillisenä rivinä.</small></div><button type="button" class="pricing-use" id="pricingUse">✓ Käytä hinta tuotteelle</button>`;
    function calc(){const q=+body.querySelector('#pq').value||1,u=+body.querySelector('#pu').value||0,s=+body.querySelector('#ps').value||0,w=+body.querySelector('#pw').value||0,e=+body.querySelector('#pe').value||0,m=+body.querySelector('#pm').value||1,cost=s+q*u*(1+w/100)+e,total=cost*m;body.querySelector('#pt').textContent=money(total);body.querySelector('#pd').innerHTML=`Kustannus <b>${money(cost)}</b> · Kate <b>${money(total-cost)}</b> · ${money(total/q)}/kpl`;return{q,total,note:body.querySelector('#pn').value}}
    body.querySelectorAll('input').forEach(x=>x.addEventListener('input',calc));
    body.querySelector('#pricingUse').onclick=()=>{const x=calc();activeRow.querySelector('.v2p-qty').value=x.q;activeRow.querySelector('.v2p-price').value=x.total.toFixed(2);activeRow.querySelector('.v2p-price').dispatchEvent(new Event('input',{bubbles:true}));if(x.note){const d=activeRow.querySelector('.v2p-desc');if(d)d.value+=(d.value?'\n':'')+'Hinnoittelu: '+x.note}modal.classList.remove('on')};
    modal.classList.add('on');calc();return true;
  }

  function enhance(){
    rows().forEach((r,i)=>{const price=r.querySelector('.v2p-price');if(price&&!r.querySelector('.copyset-price-button')){const b=document.createElement('button');b.type='button';b.className='btn dark copyset-price-button';b.textContent='💶 Laske hinta';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(i)});price.parentElement.appendChild(b)}});
    const host=document.getElementById('v2products');
    if(host&&!document.getElementById('copysetPricingLauncher')){const b=document.createElement('button');b.id='copysetPricingLauncher';b.type='button';b.className='btn orange';b.textContent='💶 HINTALASKURI / LASKE HINTA';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(0)});host.parentElement.insertBefore(b,host)}
  }

  root.pricing={open,enhance};
  window.copysetPricingOpen=open;
  window.copysetEnhancePricing=enhance;
  document.addEventListener('copyset:order-form-rendered',enhance);
})();