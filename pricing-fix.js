/* CopySet visible pricing calculator launcher */
(function(){
 function launch(){
   const rows=document.querySelectorAll('#v2products .v2-product');
   if(rows.length && typeof window.v2PricingOpen==='function') return window.v2PricingOpen(0);
   if(typeof window.v2OpenCalc==='function') return window.v2OpenCalc(0);
   if(typeof window.openCalc==='function') return window.openCalc();
   alert('Hintalaskuri ei ole vielä käytettävissä tässä näkymässä.');
 }
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