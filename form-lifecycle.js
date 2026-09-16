/* CopySet ERP — explicit lifecycle bridge for legacy offer/order forms.
   Transitional Gate D adapter: observes modal OPEN state only; business behavior remains event-driven. */
(function(){
  const root=window.CopySet=window.CopySet||{};
  let activeForm=null;

  function formRoot(){
    const modal=document.querySelector('.modal.on');
    if(!modal)return null;
    const hasOrderFields=modal.querySelector('input,select,textarea')&&(
      modal.querySelector('[id*="customer" i],[name*="customer" i]')||
      modal.querySelector('[id*="company" i],[name*="company" i]')||
      modal.querySelector('[id*="deadline" i],[name*="deadline" i]')||
      modal.querySelector('[id*="product" i],[name*="product" i]')
    );
    return hasOrderFields?modal:null;
  }

  function announce(){
    const current=formRoot();
    if(!current||current===activeForm)return false;
    activeForm=current;
    document.dispatchEvent(new CustomEvent('copyset:order-form-rendered',{detail:{root:current}}));
    return true;
  }

  function clearIfClosed(){if(activeForm&&!activeForm.classList.contains('on'))activeForm=null}

  document.addEventListener('click',()=>queueMicrotask(()=>{clearIfClosed();announce()}),true);
  document.addEventListener('copyset:clean-ready',announce);

  root.formLifecycle=Object.freeze({announce,current:()=>activeForm});
})();