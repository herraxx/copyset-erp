/* CopySet visible pricing calculator launcher + legacy apply safeguard */
(function(){
 function firstProductRow(){ return document.querySelector('#v2products .v2-product'); }
 function launch(){
   if(typeof window.copysetEnhancePricing==='function') window.copysetEnhancePricing();
   const rows=document.querySelectorAll('#v2products .v2-product');
   if(rows.length && typeof window.v2PricingOpen==='function') return window.v2PricingOpen(0);
   if(typeof window.v2OpenCalc==='function') return window.v2OpenCalc(0);
   if(typeof window.openCalc==='function') return window.openCalc();
   alert('Hintalaskuri ei ole vielä käytettävissä tässä näkymässä.');
 }
 function applyLegacyPrice(){
   try{
     if(typeof window.recalc==='function') window.recalc();
     const row=firstProductRow();
     if(row && window.priceCtx){
       const qty=row.querySelector('.v2p-qty'), price=row.querySelector('.v2p-price'), desc=row.querySelector('.v2p-desc');
       if(qty) qty.value=priceCtx.qty||qty.value;
       if(price && Number.isFinite(+priceCtx.total)) price.value=(+priceCtx.total).toFixed(2);
       const setup=document.getElementById('fsetup');
       if(setup && Number.isFinite(+priceCtx.setup)) setup.value=(+priceCtx.setup).toFixed(2);
       if(desc && priceCtx.note) desc.value+=(desc.value?'\n':'')+'Hinnoittelu: '+priceCtx.note;
       if(typeof window.v2SaveTempProducts==='function') try{window.v2SaveTempProducts();}catch(_e){}
       const calc=document.getElementById('calc'); if(calc)calc.classList.remove('on');
       return;
     }
     const fq=document.getElementById('fqty'),fp=document.getElementById('fprice'),fs=document.getElementById('fstatus'),fd=document.getElementById('fdesc'),setup=document.getElementById('fsetup');
     if(window.priceCtx){
       if(fq)fq.value=priceCtx.qty||fq.value;
       if(fp&&Number.isFinite(+priceCtx.total))fp.value=(+priceCtx.total).toFixed(2);
       if(setup&&Number.isFinite(+priceCtx.setup))setup.value=(+priceCtx.setup).toFixed(2);
       if(fs)fs.value='Tarjous';
       if(fd&&priceCtx.note)fd.value+=(fd.value?'\n':'')+'Hinnoittelu: '+priceCtx.note;
     }
     if(typeof window.setMode==='function')try{window.setMode('Tarjous');}catch(_e){}
     const calc=document.getElementById('calc'); if(calc)calc.classList.remove('on');
   }catch(e){ console.error('CopySet pricing apply failed',e); alert('Hinnan siirto epäonnistui. Yritä uudelleen.'); }
 }
 window.useCalc=applyLegacyPrice;
 function ensure(){
   const body=document.getElementById('mb'); if(!body)return;
   const txt=(body.textContent||'').toLowerCase();
   if(!(txt.includes('tarjous')||txt.includes('tilaus')||document.getElementById('v2products')))return;
   if(body.querySelector('#pricingLauncher'))return;
   const b=document.createElement('button');
   b.id='pricingLauncher'; b.type='button'; b.className='btn orange';
   b.style.cssText='width:100%;margin:10px 0 14px;padding:13px;font-size:14px;font-weight:900';
   b.textContent='💶 HINTALASKURI / LASKE HINTA'; b.onclick=launch;
   const host=body.querySelector('#v2ProductHost')||body.querySelector('#v2products')||body.querySelector('.section');
   if(host)host.parentNode.insertBefore(b,host); else body.insertBefore(b,body.firstChild);
 }
 setInterval(ensure,300); setTimeout(ensure,0);
})();