/* CopySet ERP — explicit offer/order form lifecycle. */
(function(){
 const root=window.CopySet=window.CopySet||{};let activeForm=null;
 function announce(form,order){const current=form||document.getElementById('modal');if(!current||!current.classList.contains('on'))return false;activeForm=current;document.dispatchEvent(new CustomEvent('copyset:order-form-rendered',{detail:{root:current,order:order||null}}));return true}
 function clear(form){if(!form||form===activeForm)activeForm=null}
 root.formLifecycle=Object.freeze({announce,clear,current:()=>activeForm});
})();