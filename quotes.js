/* CopySet ERP — canonical quote workflow actions. */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const clone=value=>typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));
  const state=()=>root.state?.();
  const findQuote=id=>(state()?.orders||[]).find(o=>String(o.id)===String(id)&&o.mode==='Tarjous')||null;
  const linkedOrder=quote=>{const rows=state()?.orders||[];return(quote.convertedOrderId&&rows.find(o=>String(o.id)===String(quote.convertedOrderId)&&o.mode==='Tilaus'))||rows.find(o=>o.mode==='Tilaus'&&(String(o.sourceQuoteId||'')===String(quote.id)||String(o.sourceQuoteNo||'')===String(quote.no)))||null};
  function nextInternalId(){const used=new Set((state()?.orders||[]).map(o=>String(o.id)));let n=1;while(used.has(`o${n}`))n++;return `o${n}`}
  function accept(id){
    const s=state(),quote=findQuote(id);if(!s||!quote)return null;
    if(!root.numbering?.next)throw new Error('CopySet numbering module is not ready');
    const quoteStage=quote.quoteStage||quote.offerStatus||quote.status;if(!['Lähetetty','Hyväksytty'].includes(quoteStage))return null;if(quoteStage==='Lähetetty'&&!confirm('Onko asiakas varmasti hyväksynyt tarjouksen? Hyväksyminen luo tarjouksesta tilauksen.'))return null;
    const existing=linkedOrder(quote);if(existing){if(quote.convertedOrderId!==existing.id){quote.convertedOrderId=existing.id;root.persist?.({render:false})}root.orderPage?.open?.(existing.id);return existing}
    const order=clone(quote);
    order.id=nextInternalId();
    order.mode='Tilaus';
    order.no=root.numbering.next('Tilaus',order.date);
    order.status='Vahvistettu';
    order.productionStep='';
    delete order.quoteStage;
    delete order.offerStatus;
    delete order.convertedOrderId;
    order.sourceQuoteId=quote.id;
    order.sourceQuoteNo=quote.no;
    order.quoteAcceptedAt=new Date().toISOString();
    quote.quoteStage='Hyväksytty';
    quote.offerStatus='Hyväksytty';
    quote.convertedOrderId=order.id;
    quote.quoteAcceptedAt=order.quoteAcceptedAt;
    s.orders.push(order);
    root.persist?.({render:false});
    root.render?.();
    root.renderQuotes?.();
    root.renderOrders?.();
    root.orderPage?.open?.(order.id);
    return order;
  }
  root.quotes=Object.freeze({find:findQuote,accept});
})();
