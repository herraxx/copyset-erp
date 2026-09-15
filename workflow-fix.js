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
   if(typeof window.renderAll==='function')window.renderAll();
   setTimeout(function(){
     if(typeof window.copysetPrintWorkCard==='function')return window.copysetPrintWorkCard(id);
     if(typeof window.showProductionDoc==='function')return window.showProductionDoc(id);
     if(typeof window.openOrder==='function')window.openOrder(id);
   },0);
 }
 window.copysetStartProduction=start;
 const oldAdvance=window.v2Advance;
 window.v2Advance=function(id){const o=getOrder(id);if(o&&String(o.status).trim()==='Vahvistettu')return start(id);return typeof oldAdvance==='function'?oldAdvance.apply(this,arguments):undefined;};
 function productionButton(b){
   if(!b)return false;
   const text=(b.textContent||'').trim().toLowerCase();
   const code=(b.getAttribute('onclick')||'').toLowerCase();
   return text.includes('aloita tuotanto')||text.includes('siirrä tuotantoon')||code.includes('copysetstartproduction');
 }
 document.addEventListener('click',function(e){
   const b=e.target.closest&&e.target.closest('button'); if(!productionButton(b))return;
   let id='';
   const code=b.getAttribute('onclick')||'';
   let m=code.match(/copysetStartProduction\(['\"]([^'\"]+)['\"]\)/i);
   if(!m)m=code.match(/v2Advance\(['\"]([^'\"]+)['\"]\)/i);
   if(m)id=m[1];
   if(!id){const tr=b.closest('tr');const rc=tr&&tr.getAttribute('onclick')||'';const rm=rc.match(/openOrder\(['\"]([^'\"]+)['\"]\)/i);if(rm)id=rm[1];}
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
   if(id)start(id);
 },true);
})();