/* CopySet production transition guard — loaded last */
(function(){
 function getOrder(id){return window.st&&Array.isArray(st.orders)?st.orders.find(o=>o.id===id):null;}
 function start(id){
   const o=getOrder(id); if(!o)return;
   o.mode='Tilaus';
   o.status='Tuotannossa';
   o.productionStep='Aloitettu';
   o.artworkStatus='Aineisto OK';
   if(typeof window.logEvent==='function')try{window.logEvent(o,'Tuotanto aloitettu');}catch(_e){}
   if(typeof window.save==='function')window.save();
   /* Open from the actual user click so the browser does not block the work card popup. */
   if(typeof window.copysetPrintWorkCard==='function')window.copysetPrintWorkCard(id);
   else if(typeof window.showProductionDoc==='function')window.showProductionDoc(id);
   if(typeof window.renderAll==='function')window.renderAll();
 }
 window.copysetStartProduction=start;
 const oldAdvance=window.v2Advance;
 window.v2Advance=function(id){const o=getOrder(id);if(o&&String(o.status).trim()==='Vahvistettu')return start(id);return typeof oldAdvance==='function'?oldAdvance.apply(this,arguments):undefined;};
 function isProductionStart(b){
   if(!b)return false;
   const text=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
   const code=(b.getAttribute('onclick')||'').toLowerCase();
   return text.includes('aloita tuotanto')||text.includes('siirrä tuotantoon')||(text.includes('seuraava vaihe')&&text.includes('tuotannossa'))||code.includes('copysetstartproduction');
 }
 function idFromButton(b){
   let code=b.getAttribute('onclick')||'',m=code.match(/(?:copysetStartProduction|v2Advance|advance|setStatus)\(['\"]([^'\"]+)['\"]/i);
   if(m)return m[1];
   const tr=b.closest&&b.closest('tr');
   code=tr&&tr.getAttribute('onclick')||'';m=code.match(/openOrder\(['\"]([^'\"]+)['\"]\)/i);if(m)return m[1];
   const body=document.getElementById('mb');
   if(body){const title=(document.querySelector('#mt')?.textContent||body.textContent||'');const no=(title.match(/Tilaus\s*#?([A-Za-z0-9-]+)/i)||[])[1];if(no){const o=window.st?.orders?.find(x=>String(x.no||'').replace(/^TIL-/i,'')===no||String(x.no||'')===no);if(o)return o.id;}}
   return '';
 }
 document.addEventListener('click',function(e){
   const b=e.target.closest&&e.target.closest('button');if(!isProductionStart(b))return;
   const id=idFromButton(b);if(!id)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(id);
 },true);
})();