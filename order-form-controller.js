/* CopySet ERP — canonical offer/order form controller.
   Owns opening, mode selection and post-save navigation while legacy orderForm() still renders the fields. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 function modal(){return document.getElementById('modal')}
 function body(){return document.getElementById('mb')}
 function title(){return document.getElementById('mt')}
 function legacyRender(order){try{if(typeof orderForm==='function')return orderForm(order)}catch(_e){}return''}
 function legacySetContext(id,modeValue){try{edit=id||null}catch(_e){}try{mode=modeValue}catch(_e){}}
 function blank(modeValue='Tarjous'){
   const today=new Date(),add=days=>{const d=new Date(today);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
   return{id:null,no:root.numbering?.next?.(modeValue,add(0))||'',name:'',mode:modeValue,customerId:'',date:add(0),deadline:add(3),valid:add(14),deliveryDate:add(3),company:'',contact:'',email:'',phone:'',product:'',qty:100,price:0,deliveryPrice:0,status:modeValue==='Tarjous'?'Tarjous':'Vahvistettu',production:'Copy-Set',supplierId:'',shipping:'Posti',description:'',contacts:[],deliveries:[{recipient:'',address:'',zip:'',city:'',country:'Suomi',info:''}],billingAddress:'',setupFee:root.config?.setupFee??50,billingFee:root.config?.billingFee??6,paymentTerms:`${root.config?.paymentTermsDays||21} pv`,customerCountry:'Suomi',demo:false}
 }
 function open(order,options={}){const m=modal(),b=body(),t=title();if(!m||!b||!t)return false;const modeValue=options.mode||order?.mode||'Tarjous';legacySetContext(order?.id||null,modeValue);const html=legacyRender(order);if(!html)return false;t.textContent=order?.id?`Muokkaa ${order.no||''}`:(modeValue==='Tarjous'?'Uusi tarjous':'Uusi tilaus');b.innerHTML=html;m.classList.add('on');queueMicrotask(()=>root.formLifecycle?.announce?.());return true}
 function create(modeValue='Tarjous'){return open(blank(modeValue),{mode:modeValue})}
 function editOrder(id){const order=root.getOrder?.(id);return order?open(order,{mode:order.mode}):false}
 function setMode(modeValue){if(!['Tarjous','Tilaus'].includes(modeValue))return false;try{mode=modeValue}catch(_e){}const quote=document.getElementById('tQuote'),order=document.getElementById('tOrder'),status=document.getElementById('fstatus'),number=document.getElementById('fno');quote?.classList.toggle('on',modeValue==='Tarjous');order?.classList.toggle('on',modeValue==='Tilaus');if(status)status.value=modeValue==='Tarjous'?'Tarjous':'Vahvistettu';if(number&&!String(number.value||'').match(new RegExp(`^${modeValue==='Tarjous'?'TAR':'TIL'}-`)))number.value=root.numbering?.next?.(modeValue,document.getElementById('fdate')?.value)||number.value;document.dispatchEvent(new CustomEvent('copyset:order-form-mode',{detail:{mode:modeValue}}));return true}
 function close(){modal()?.classList.remove('on')}
 document.addEventListener('copyset:order-form-save-complete',event=>{const order=event.detail?.order;if(!order)return;if(order.mode==='Tarjous')root.renderQuotes?.();else root.renderOrders?.()});
 root.orderForm=Object.freeze({blank,open,create,edit:editOrder,setMode,close});
 window.copysetNewOrder=create;window.copysetEditOrder=editOrder;window.copysetSetMode=setMode;
})();