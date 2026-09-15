/* CopySet ERP canonical core — one public API for state, persistence and workflow */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const legacyState=()=>{try{return typeof st!=='undefined'?st:window.st}catch(_e){return window.st}};
  root.state=legacyState;
  root.getOrder=id=>legacyState()?.orders?.find(o=>String(o.id)===String(id))||null;
  root.orders=()=>legacyState()?.orders||[];
  root.save=function(){try{if(typeof save==='function')return save()}catch(e){console.error('CopySet save failed',e)}};
  root.render=function(){try{if(typeof renderAll==='function')return renderAll()}catch(e){console.error('CopySet render failed',e)}};
  root.persist=function(){root.save();root.render()};
  root.statuses=['Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu'];
  root.setStatus=function(id,status,eventText){const o=root.getOrder(id);if(!o||!root.statuses.includes(status))return false;o.status=status;if(status==='Tuotannossa'&&!o.productionStep)o.productionStep='Aloitettu';if(status==='Valmis')o.productionStep='Valmis';if(status==='Laskutusvalmis'){o.invoiceStatus='Tarkastettavana';o.invoiceCreatedAt=o.invoiceCreatedAt||new Date().toISOString()}if(status==='Laskutettu'){o.invoiceStatus='Hyväksytty';o.invoiceApprovedAt=o.invoiceApprovedAt||new Date().toISOString();o.invoicedAt=o.invoicedAt||new Date().toISOString()}if(eventText&&typeof logEvent==='function')try{logEvent(o,eventText)}catch(_e){}root.persist();return o};
  root.nextStatus=function(status){const i=root.statuses.indexOf(status);return i>=0&&i<root.statuses.length-1?root.statuses[i+1]:null};
})();