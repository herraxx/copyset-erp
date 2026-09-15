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
   if(typeof window.openOrder==='function')window.openOrder(id);
 }
 window.copysetStartProduction=start;
 const oldAdvance=window.v2Advance;
 window.v2Advance=function(id){const o=getOrder(id);if(o&&String(o.status).trim()==='Vahvistettu')return start(id);return typeof oldAdvance==='function'?oldAdvance.apply(this,arguments):undefined;};
 document.addEventListener('click',function(e){
   const b=e.target.closest&&e.target.closest('button'); if(!b)return;
   const text=(b.textContent||'').trim().toLowerCase();
   if(!text.includes('aloita tuotanto')&&!text.includes('siirrä tuotantoon'))return;
   let id='';
   const code=b.getAttribute('onclick')||'';
   const m=code.match(/['\"]([^'\"]+)['\"]/); if(m)id=m[1];
   if(!id){const tr=b.closest('tr');const rc=tr&&tr.getAttribute('onclick')||'';const rm=rc.match(/openOrder\(['\"]([^'\"]+)['\"]\)/);if(rm)id=rm[1];}
   if(!id)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(id);
 },true);
})();