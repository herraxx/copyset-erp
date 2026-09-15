/* CopySet persistent pricing launcher + universal apply sync */
(function(){
 function rows(){return [...document.querySelectorAll('#v2products .v2-product')];}
 function currentRow(){return window.copysetPricingRow||rows()[0]||null;}
 function syncProduct(row,qty,total,note){
   if(!row)return false;
   const q=row.querySelector('.v2p-qty'),p=row.querySelector('.v2p-price'),d=row.querySelector('.v2p-desc');
   if(q)q.value=qty;
   if(p&&Number.isFinite(+total))p.value=(+total).toFixed(2);
   if(d&&note)d.value+=(d.value?'\n':'')+'Hinnoittelu: '+note;
   ['input','change'].forEach(type=>{if(q)q.dispatchEvent(new Event(type,{bubbles:true}));if(p)p.dispatchEvent(new Event(type,{bubbles:true}))});
   if(typeof window.v2SaveTempProducts==='function')try{window.v2SaveTempProducts();}catch(_e){}
   if(typeof window.v2RefreshProducts==='function')try{window.v2RefreshProducts();}catch(_e){}
   return true;
 }
 function syncLegacy(qty,total,setup,note){
   const fq=document.getElementById('fqty'),fp=document.getElementById('fprice'),fs=document.getElementById('fsetup'),fd=document.getElementById('fdesc');
   if(fq)fq.value=qty;
   if(fp&&Number.isFinite(+total))fp.value=(+total).toFixed(2);
   if(fs&&Number.isFinite(+setup))fs.value=(+setup).toFixed(2);
   if(fd&&note)fd.value+=(fd.value?'\n':'')+'Hinnoittelu: '+note;
   [fq,fp,fs].filter(Boolean).forEach(el=>['input','change'].forEach(type=>el.dispatchEvent(new Event(type,{bubbles:true}))));
 }
 function readModernCalc(){
   const cq=document.getElementById('cq'),cu=document.getElementById('cu'),cs=document.getElementById('cs'),cw=document.getElementById('cw'),ce=document.getElementById('ce'),cm=document.getElementById('cm'),cn=document.getElementById('cn');
   if(!cq)return null;
   const qty=+cq.value||1,setup=+cs?.value||0,cost=setup+qty*(+cu?.value||0)*(1+(+cw?.value||0)/100)+(+ce?.value||0),total=cost*(+cm?.value||1);
   return{qty,total,setup,note:cn?.value||''};
 }
 function applyEverywhere(){
   try{
     if(typeof window.recalc==='function')try{window.recalc();}catch(_e){}
     const modern=readModernCalc();
     const legacy=window.priceCtx?{qty:+priceCtx.qty||1,total:+priceCtx.total||0,setup:+priceCtx.setup||0,note:priceCtx.note||''}:null;
     const x=modern||legacy;if(!x)return;
     syncProduct(currentRow(),x.qty,x.total,x.note);
     syncLegacy(x.qty,x.total,x.setup,x.note);
     const calc=document.getElementById('calc');if(calc)calc.classList.remove('on');
   }catch(e){console.error('CopySet pricing apply failed',e);alert('Hinnan siirto epäonnistui. Yritä uudelleen.');}
 }
 window.copysetApplyPrice=applyEverywhere;
 window.useCalc=applyEverywhere;
 function wireModern(){
   const btn=document.getElementById('v2UsePrice');if(btn&&!btn.dataset.copysetUniversal){btn.dataset.copysetUniversal='1';btn.onclick=applyEverywhere;}
 }
 function launch(){
   if(typeof window.copysetEnhancePricing==='function')window.copysetEnhancePricing();
   const rs=rows();
   if(rs.length&&typeof window.v2PricingOpen==='function'){window.copysetPricingRow=rs[0];window.v2PricingOpen(0);setTimeout(wireModern,0);return;}
   if(typeof window.v2OpenCalc==='function'){window.v2OpenCalc(0);return;}
   if(typeof window.openCalc==='function'){window.openCalc();return;}
   alert('Hintalaskuri ei ole vielä käytettävissä tässä näkymässä.');
 }
 function ensure(){
   const body=document.getElementById('mb');if(!body)return;
   const txt=(body.textContent||'').toLowerCase();
   if(!(txt.includes('tarjous')||txt.includes('tilaus')||document.getElementById('v2products')))return;
   wireModern();
   rows().forEach((r,i)=>{const b=r.querySelector('.v2-price-btn');if(b&&!b.dataset.copysetUniversal){b.dataset.copysetUniversal='1';b.onclick=()=>{window.copysetPricingRow=r;if(typeof window.v2PricingOpen==='function'){window.v2PricingOpen(i);setTimeout(wireModern,0);}};}});
   if(body.querySelector('#pricingLauncher'))return;
   const b=document.createElement('button');b.id='pricingLauncher';b.type='button';b.className='btn orange';b.style.cssText='width:100%;margin:10px 0 14px;padding:13px;font-size:14px;font-weight:900';b.textContent='💶 HINTALASKURI / LASKE HINTA';b.onclick=launch;
   const host=body.querySelector('#v2ProductHost')||body.querySelector('#v2products')||body.querySelector('.section');if(host)host.parentNode.insertBefore(b,host);else body.insertBefore(b,body.firstChild);
 }
 setInterval(ensure,300);setTimeout(ensure,0);
})();