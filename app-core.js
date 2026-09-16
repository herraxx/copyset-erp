/* CopySet ERP canonical core — one public API for state, persistence and workflow */
(function(){
  const root=window.CopySet=window.CopySet||{};

  const legacy={
    state(){try{return typeof st!=='undefined'?st:window.st}catch(_e){return window.st}},
    save(){try{return typeof save==='function'?save:null}catch(_e){return null}},
    render(){try{return typeof renderAll==='function'?renderAll:null}catch(_e){return null}},
    log(){try{return typeof logEvent==='function'?logEvent:null}catch(_e){return null}}
  };

  root.state=legacy.state;
  root.orders=()=>legacy.state()?.orders||[];
  root.customers=()=>legacy.state()?.customers||[];
  root.getOrder=id=>root.orders().find(o=>String(o.id)===String(id))||null;
  root.getCustomer=id=>root.customers().find(c=>String(c.id)===String(id))||null;

  root.save=function(){
    try{const fn=legacy.save();return fn?fn():undefined}
    catch(error){console.error('CopySet save failed',error);return undefined}
  };
  root.render=function(){
    try{const fn=legacy.render();return fn?fn():undefined}
    catch(error){console.error('CopySet render failed',error);return undefined}
  };
  root.persist=function(options={}){
    root.save();
    if(options.render!==false)root.render();
  };

  root.statuses=(root.config?.orderStatuses||['Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu']).slice();
  root.nextStatus=function(status){
    const index=root.statuses.indexOf(status);
    return index>=0&&index<root.statuses.length-1?root.statuses[index+1]:null;
  };
  root.setStatus=function(id,status,eventText){
    const order=root.getOrder(id);
    if(!order||!root.statuses.includes(status))return false;
    order.status=status;
    if(status==='Tuotannossa'&&!order.productionStep)order.productionStep=root.config?.productionSteps?.[0]||'Aloitettu';
    if(status==='Valmis')order.productionStep=root.config?.productionSteps?.[2]||'Valmis';
    if(status==='Laskutusvalmis'){
      order.invoiceStatus='Tarkastettavana';
      order.invoiceCreatedAt=order.invoiceCreatedAt||new Date().toISOString();
    }
    if(status==='Laskutettu'){
      order.invoiceStatus='Hyväksytty';
      order.invoiceApprovedAt=order.invoiceApprovedAt||new Date().toISOString();
      order.invoicedAt=order.invoicedAt||new Date().toISOString();
    }
    const log=legacy.log();
    if(eventText&&log)try{log(order,eventText)}catch(error){console.error('CopySet event log failed',error)}
    root.persist();
    return order;
  };

  root.legacy=Object.freeze({state:legacy.state});
})();