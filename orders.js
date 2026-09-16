/* CopySet ERP — canonical order commands. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 const clone=value=>JSON.parse(JSON.stringify(value));
 function nextId(){const used=new Set((root.orders?.()||[]).map(o=>String(o.id)));let n=1;while(used.has(`o${n}`))n++;return `o${n}`}
 function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
 function duplicate(id){const source=root.getOrder?.(id),state=root.state?.();if(!source||!state?.orders)return false;const date=today(),copy={...clone(source),id:nextId(),mode:'Tilaus',status:'Vahvistettu',date,no:root.numbering?.next?.('Tilaus',date)||'',sourceOrderId:source.id,sourceQuoteId:source.sourceQuoteId||null,invoiceStatus:'',invoiceCreatedAt:null,invoiceApprovedAt:null,invoicedAt:null,productionStep:'',history:[{at:new Date().toISOString(),text:`Kopioitu tilauksesta ${source.no||''}`}],demo:false};state.orders.push(copy);root.persist?.({render:false});root.renderOrders?.();document.dispatchEvent(new CustomEvent('copyset:order-duplicated',{detail:{source,order:copy}}));root.orderPage?.close?.();root.orderForm?.edit?.(copy.id);return copy}
 function remove(id){const state=root.state?.(),index=state?.orders?.findIndex(o=>String(o.id)===String(id))??-1;if(index<0)return false;const order=state.orders[index];if(!confirm(`Poistetaanko ${order.no||'tilaus'} pysyvästi?`))return false;state.orders.splice(index,1);root.persist?.({render:false});root.orderPage?.close?.();root.renderQuotes?.();root.renderOrders?.();document.dispatchEvent(new CustomEvent('copyset:order-deleted',{detail:{order}}));return true}
 root.orderCommands=Object.freeze({duplicate,remove});
 root.duplicateOrder=duplicate;
})();
