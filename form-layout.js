/* CopySet ERP — automatically applies one form structure to dynamic views. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 const fieldSelector='input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),select,textarea';
 function labelFor(field){
  const box=field.parentElement;
  if(!box)return'';
  return box.querySelector(':scope > .lab,:scope > label,.pricing-label')?.textContent?.trim()||field.getAttribute('placeholder')||'';
 }
 function enhanceFields(scope){
  scope.querySelectorAll(fieldSelector).forEach(field=>{
   const parent=field.parentElement;
   if(parent&&parent!==scope&&!parent.classList.contains('actions')&&!parent.classList.contains('toolbar'))parent.classList.add('copyset-field');
   if(!field.getAttribute('aria-label')&&!field.getAttribute('aria-labelledby')){
    const label=labelFor(field);if(label)field.setAttribute('aria-label',label.replace(/\s+/g,' '));
   }
  });
 }
 function enhance(scope=document){
  const surfaces=[];
  if(scope.matches?.('#modal #mb,.pricing-sheet,#copyset-order-page,#copyset-invoice-review'))surfaces.push(scope);
  scope.querySelectorAll?.('#modal #mb,.pricing-sheet,#copyset-order-page,#copyset-invoice-review').forEach(x=>surfaces.push(x));
  surfaces.forEach(surface=>{
   surface.classList.add('copyset-form-layout');
   enhanceFields(surface);
   surface.querySelectorAll('.section,.pricing-block,.op-section,.wo-section').forEach(x=>x.classList.add('copyset-form-section'));
   surface.querySelectorAll('.actions').forEach(x=>x.classList.add('copyset-form-actions'));
  });
  scope.querySelectorAll?.('#marketing,#pricing').forEach(surface=>{surface.classList.add('copyset-form-layout');enhanceFields(surface)});
 }
 let queued=false;
 const queue=scope=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance(scope||document)})};
 const observer=new MutationObserver(records=>{for(const record of records){if(record.addedNodes.length){queue(document);break}}});
 function start(){enhance(document);observer.observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 document.addEventListener('copyset:order-form-rendered',e=>enhance(e.detail?.root||document));
 document.addEventListener('copyset:clean-ready',()=>enhance(document));
 root.formLayout=Object.freeze({enhance});
})();
