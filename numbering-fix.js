/* CopySet ERP — canonical TAR/TIL numbering and one-time migration of legacy numeric demo numbers */
(function(){
 const state=()=>{try{return typeof st!=='undefined'?st:window.st}catch(_e){return window.st}};
 const yearOf=o=>{const raw=o?.date||o?.createdAt||o?.orderDate||'';const m=String(raw).match(/(20\d{2})/);return m?m[1]:String(new Date().getFullYear())};
 const canonical=(mode,year,n)=>`${mode==='Tarjous'?'TAR':'TIL'}-${year}-${String(n).padStart(4,'0')}`;
 function migrate(){
   const s=state();if(!s||!Array.isArray(s.orders))return false;
   let changed=false;
   ['Tarjous','Tilaus'].forEach(mode=>{
     const rows=s.orders.filter(o=>o.mode===mode);
     const used={};
     rows.forEach(o=>{const m=String(o.no||'').match(new RegExp(`^${mode==='Tarjous'?'TAR':'TIL'}-(20\\d{2})-(\\d+)$`,'i'));if(m){used[m[1]]=used[m[1]]||new Set();used[m[1]].add(+m[2])}});
     rows.sort((a,b)=>String(a.date||a.createdAt||'').localeCompare(String(b.date||b.createdAt||''))||String(a.id).localeCompare(String(b.id))).forEach(o=>{
       if(new RegExp(`^${mode==='Tarjous'?'TAR':'TIL'}-20\\d{2}-\\d{4}$`,'i').test(String(o.no||'')))return;
       const y=yearOf(o);used[y]=used[y]||new Set();let n=1;while(used[y].has(n))n++;used[y].add(n);o.no=canonical(mode,y,n);changed=true;
     });
   });
   if(changed){if(typeof save==='function')save();if(typeof renderAll==='function')renderAll()}
   return changed;
 }
 function next(mode){const s=state(),y=String(new Date().getFullYear()),re=new RegExp(`^${mode==='Tarjous'?'TAR':'TIL'}-${y}-(\\d+)$`,'i');let max=0;(s?.orders||[]).filter(o=>o.mode===mode).forEach(o=>{const m=String(o.no||'').match(re);if(m)max=Math.max(max,+m[1])});return canonical(mode,y,max+1)}
 window.copysetNextNumber=next;window.copysetMigrateNumbers=migrate;
 setTimeout(migrate,0);
})();