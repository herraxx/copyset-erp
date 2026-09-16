/* CopySet ERP — canonical offer/order form data serializer.
   Gate D extraction: reads the current legacy form without owning rendering yet. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 const byId=id=>document.getElementById(id);
 const value=(id,fallback='')=>byId(id)?.value??fallback;
 const checked=name=>document.querySelector(`[name="${name}"]:checked`)?.value||'';
 const rows=selector=>[...document.querySelectorAll(selector)].map(row=>{const out={};row.querySelectorAll('[data-k]').forEach(el=>out[el.dataset.k]=el.value);return out});
 const iso=value=>{const d=root.parseDate?.(value);if(!d)return String(value||'');return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const num=value=>root.parseNumber?root.parseNumber(value,0):(Number(value)||0);
 function legacyContext(){let editing=null,formMode=null;try{editing=typeof edit!=='undefined'?edit:null}catch(_e){}try{formMode=typeof mode!=='undefined'?mode:null}catch(_e){}return{editing,mode:formMode}}
 function build(options={}){
   const context=legacyContext(),editing=options.id??context.editing,modeValue=options.mode||context.mode||'Tarjous',existing=editing?root.getOrder?.(editing):null;
   const production=checked('prod')||existing?.production||'Copy-Set',supplierId=production==='Alihankkija'?value('fvendor',existing?.supplierId||''):'';
   if(production==='Alihankkija'&&!supplierId)return{ok:false,error:'Valitse alihankkija.'};
   const deliveries=rows('[data-del]'),customerId=value('fcustomer',existing?.customerId||''),customer=root.customerApi?.find?.(customerId)||root.getCustomer?.(customerId)||null;
   const selectedProduct=value('fproduct',existing?.product||'');const product=selectedProduct==='Oma tuote'?(value('fcustom')||'Oma tuote'):selectedProduct;
   const order={...(existing||{}),id:editing||options.newId||null,mode:modeValue,customerId,date:iso(value('fdate',existing?.date||'')),deadline:iso(value('fdeadline',existing?.deadline||'')),valid:iso(value('fvalid',existing?.valid||'')),deliveryDate:iso(value('fdeliverydate',existing?.deliveryDate||'')),company:customer?.company||deliveries[0]?.recipient||existing?.company||'',contact:value('fcontact',existing?.contact||''),email:value('femail',existing?.email||''),phone:value('fphone',existing?.phone||''),product,qty:num(value('fqty',existing?.qty||0)),price:num(value('fprice',existing?.price||0)),deliveryPrice:num(value('fdeliveryprice',existing?.deliveryPrice||existing?.deliveryFee||0)),status:value('fstatus',modeValue==='Tarjous'?'Tarjous':'Vahvistettu'),production,supplierId,shipping:value('fship',existing?.shipping||'Posti'),description:value('fdesc',existing?.description||''),contacts:rows('[data-con]'),deliveries,billingAddress:value('fbilling',existing?.billingAddress||''),setupFee:existing?.setupFee??root.config?.setupFee??50,billingFee:existing?.billingFee??root.config?.billingFee??6,paymentTerms:existing?.paymentTerms||existing?.paymentTerm||`${root.config?.paymentTermsDays||21} pv`,customerCountry:existing?.customerCountry||customer?.country||'Suomi',customerBid:existing?.customerBid||customer?.bid||customer?.businessId||'',demo:false};
   if(!order.id)order.id=nextId();
   if(!order.no||String(order.no).match(/^\d+$/))order.no=root.numbering?.next?.(modeValue,order.date)||order.no||'';
   return{ok:true,order,editing:!!editing};
 }
 function nextId(){const used=new Set((root.orders?.()||[]).map(o=>String(o.id)));let n=1;while(used.has(`o${n}`))n++;return`o${n}`}
 function save(options={}){const result=build(options);if(!result.ok)return result;const state=root.state?.();if(!state||!Array.isArray(state.orders))return{ok:false,error:'Tilaustietoja ei voitu avata.'};const index=state.orders.findIndex(o=>String(o.id)===String(result.order.id));if(index>=0)state.orders[index]=result.order;else state.orders.push(result.order);root.persist?.();document.dispatchEvent(new CustomEvent('copyset:order-saved',{detail:{order:result.order,editing:index>=0}}));return result}
 root.orderFormData=Object.freeze({build,save,rows});
})();