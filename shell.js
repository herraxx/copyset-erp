/* CopySet ERP — the only shell/navigation owner. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 const titles={quotes:'Tarjoukset',orders:'Tilaukset',archive:'Arkisto / vanhat työt',crm:'Asiakas CRM',products:'Tuotteet & hinnat',pricing:'Hinnoittelu',suppliers:'Alihankkijat',marketing:'Markkinointi',dashboard:'Dashboard'};
 function closeM(){document.getElementById('modal')?.classList.remove('on')}window.closeM=closeM;
 function show(view){if(!titles[view])return false;document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('on',x.dataset.v===view));document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===view));const title=document.getElementById('title');if(title)title.textContent=titles[view];history.replaceState(null,'','#'+view);return true}
 function renderAll(){root.renderQuotes?.();root.renderOrders?.();root.renderArchive?.();root.renderCRM?.();root.renderProducts?.();root.renderPricing?.();root.renderSuppliers?.();root.renderMarketing?.();root.renderDashboard?.()}window.renderAll=renderAll;
 document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>show(b.dataset.v)));
 document.getElementById('modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
 renderAll();show(location.hash.slice(1)||'orders');document.dispatchEvent(new CustomEvent('copyset:clean-ready'));
 root.shell=Object.freeze({show,renderAll,close:closeM});
})();
