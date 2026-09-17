/* Selective modern runtime: pricing + order workspace only.
   Legacy document generators remain authoritative. */
(function(){
 const root=window.CopySet=window.CopySet||{};

 if(typeof showConfirmation==='function'){
   root.confirmation={open:id=>showConfirmation(id)};
 }
 if(typeof showInvoiceReview==='function'){
   root.invoiceReview={open:id=>showInvoiceReview(id)};
 }
 if(typeof editOrder==='function'){
   root.orderForm={edit:id=>editOrder(id)};
 }
 if(typeof renderOrders==='function')root.renderOrders=renderOrders;
 if(typeof renderQuotes==='function')root.renderQuotes=renderQuotes;

 if(root.orderPage?.open){
   window.openOrder=id=>root.orderPage.open(id);
 }

 function resetScroll(){document.documentElement.scrollTop=0;document.body.scrollTop=0}
 function openPricingView(){
   document.querySelectorAll('.nav').forEach(x=>x.classList.remove('on'));
   document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
   const button=document.querySelector('.nav[data-v="pricing"]');
   const view=document.getElementById('pricing');
   button?.classList.add('on');view?.classList.add('on');
   const title=document.getElementById('title');
   if(title)title.textContent='Hinnoittelu';
   root.renderPricing?.();resetScroll();
 }
 const pricingButton=document.querySelector('.nav[data-v="pricing"]');
 if(pricingButton)pricingButton.onclick=openPricingView;
 root.renderPricing?.();
 root.pricing?.enhance?.();

 document.querySelectorAll('.side .nav').forEach(button=>button.addEventListener('click',()=>setTimeout(resetScroll,0)));
 document.addEventListener('click',event=>{
   if(event.target.closest('.nav[data-v="pricing"]'))setTimeout(openPricingView,0);
   if(event.target.closest('.top-create-actions'))setTimeout(()=>root.pricing?.enhance?.(),0);
 });
 document.dispatchEvent(new CustomEvent('copyset:selective-ready'));
})();
