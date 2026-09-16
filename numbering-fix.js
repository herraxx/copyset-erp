/* CopySet ERP — canonical TAR/TIL numbering */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const MODES=Object.freeze(['Tarjous','Tilaus']);
  const yearOf=o=>{const raw=o?.date||o?.createdAt||o?.orderDate||'';const match=String(raw).match(/(20\d{2})/);return match?match[1]:String(new Date().getFullYear())};
  const prefix=mode=>mode==='Tarjous'?'TAR':'TIL';
  const canonical=(mode,year,n)=>`${prefix(mode)}-${year}-${String(n).padStart(4,'0')}`;
  const canonicalPattern=mode=>new RegExp(`^${prefix(mode)}-20\\d{2}-\\d{4}$`,'i');
  const validMode=mode=>MODES.includes(mode);

  function migrate(options={}){
    const state=root.state?.();
    if(!state||!Array.isArray(state.orders))return{changed:false,count:0};
    let count=0;
    MODES.forEach(mode=>{
      const rows=state.orders.filter(o=>o.mode===mode);
      const used={};
      const existing=new RegExp(`^${prefix(mode)}-(20\\d{2})-(\\d+)$`,'i');
      rows.forEach(o=>{const match=String(o.no||'').match(existing);if(match){used[match[1]]=used[match[1]]||new Set();used[match[1]].add(Number(match[2]))}});
      rows.sort((a,b)=>String(a.date||a.createdAt||'').localeCompare(String(b.date||b.createdAt||''))||String(a.id).localeCompare(String(b.id))).forEach(o=>{
        if(canonicalPattern(mode).test(String(o.no||'')))return;
        const year=yearOf(o);used[year]=used[year]||new Set();let n=1;while(used[year].has(n))n++;used[year].add(n);o.no=canonical(mode,year,n);count++;
      });
    });
    if(count&&options.persist!==false)root.persist?.({render:options.render!==false});
    return{changed:count>0,count};
  }

  function next(mode,date){
    if(!validMode(mode))throw new Error(`Tuntematon numerointityyppi: ${mode}`);
    const state=root.state?.();
    const rawYear=date?yearOf({date}):String(new Date().getFullYear());
    const pattern=new RegExp(`^${prefix(mode)}-${rawYear}-(\\d+)$`,'i');
    let max=0;
    (state?.orders||[]).filter(o=>o.mode===mode).forEach(o=>{const match=String(o.no||'').match(pattern);if(match)max=Math.max(max,Number(match[1]))});
    return canonical(mode,rawYear,max+1);
  }

  root.numbering=Object.freeze({next,migrate,canonical});
  window.copysetNextNumber=next;
  window.copysetMigrateNumbers=migrate;
})();