/* CopySet ERP — canonical TAR/TIL numbering and legacy-number migration */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const yearOf=o=>{const raw=o?.date||o?.createdAt||o?.orderDate||'';const match=String(raw).match(/(20\d{2})/);return match?match[1]:String(new Date().getFullYear())};
  const prefix=mode=>mode==='Tarjous'?'TAR':'TIL';
  const canonical=(mode,year,n)=>`${prefix(mode)}-${year}-${String(n).padStart(4,'0')}`;
  const canonicalPattern=mode=>new RegExp(`^${prefix(mode)}-20\\d{2}-\\d{4}$`,'i');

  function migrate(){
    const state=root.state?.();
    if(!state||!Array.isArray(state.orders))return false;
    let changed=false;
    ['Tarjous','Tilaus'].forEach(mode=>{
      const rows=state.orders.filter(o=>o.mode===mode);
      const used={};
      const existing=new RegExp(`^${prefix(mode)}-(20\\d{2})-(\\d+)$`,'i');
      rows.forEach(o=>{const match=String(o.no||'').match(existing);if(match){used[match[1]]=used[match[1]]||new Set();used[match[1]].add(Number(match[2]))}});
      rows.sort((a,b)=>String(a.date||a.createdAt||'').localeCompare(String(b.date||b.createdAt||''))||String(a.id).localeCompare(String(b.id))).forEach(o=>{
        if(canonicalPattern(mode).test(String(o.no||'')))return;
        const year=yearOf(o);used[year]=used[year]||new Set();let n=1;while(used[year].has(n))n++;used[year].add(n);o.no=canonical(mode,year,n);changed=true;
      });
    });
    if(changed){root.save?.();root.render?.()}
    return changed;
  }

  function next(mode){
    const state=root.state?.(),year=String(new Date().getFullYear()),pattern=new RegExp(`^${prefix(mode)}-${year}-(\\d+)$`,'i');
    let max=0;
    (state?.orders||[]).filter(o=>o.mode===mode).forEach(o=>{const match=String(o.no||'').match(pattern);if(match)max=Math.max(max,Number(match[1]))});
    return canonical(mode,year,max+1);
  }

  root.numbering={next,migrate};
  window.copysetNextNumber=next;
  window.copysetMigrateNumbers=migrate;
  migrate();
})();