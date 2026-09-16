/* CopySet ERP — canonical customer data API. */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const text=value=>String(value??'').trim();
  const lower=value=>text(value).toLocaleLowerCase('fi-FI');
  const businessId=value=>text(value).toUpperCase().replace(/\s+/g,'');
  const idOf=customer=>text(customer?.id||customer?.customerId);
  function all(){return root.customers?.()||[]}
  function find(id){const key=text(id);return key?all().find(c=>idOf(c)===key)||null:null}
  function findByBusinessId(value){const key=businessId(value);return key?all().find(c=>businessId(c.bid||c.businessId)===key)||null:null}
  function search(query){const needle=lower(query);if(!needle)return all().slice();return all().filter(c=>[c.company,c.name,c.contact,c.email,c.phone,c.bid,c.businessId,c.address,c.zip,c.postalCode,c.city].some(v=>lower(v).includes(needle)))}
  function normalize(customer={}){const bid=businessId(customer.bid||customer.businessId);return {...customer,company:text(customer.company||customer.name),contact:text(customer.contact),bid,businessId:bid,email:text(customer.email).toLowerCase(),phone:text(customer.phone),address:text(customer.address),zip:text(customer.zip||customer.postalCode),city:text(customer.city),country:text(customer.country||root.config?.domesticCountry||'Suomi'),billing:text(customer.billing||customer.billingAddress)}}
  function nextId(){const used=new Set(all().map(idOf).filter(Boolean));let n=1;while(used.has(`c${n}`))n++;return `c${n}`}
  function add(customer){const state=root.state?.();if(!state||!Array.isArray(state.customers))return null;const row=normalize(customer),duplicate=findByBusinessId(row.bid);if(duplicate)return duplicate;row.id=idOf(row)||nextId();state.customers.push(row);root.persist?.({render:false});return row}
  function update(id,patch){const row=find(id);if(!row)return null;const next=normalize({...row,...patch}),duplicate=findByBusinessId(next.bid);if(duplicate&&duplicate!==row)return null;Object.assign(row,next,{id:row.id});root.persist?.({render:false});return row}
  const aliases={company:['customerCompany','company','customerName'],contact:['fcontact','customerContact','contact','contactPerson'],bid:['customerBid','businessId','bid','ytunnus'],email:['femail','customerEmail','email'],phone:['fphone','customerPhone','phone'],address:['customerAddress','address'],zip:['customerZip','postalCode','zip','postinumero'],city:['customerCity','city'],country:['customerCountry','country'],billing:['fbilling','customerBilling','billing','billingAddress']};
  function field(form,names){for(const name of names){const el=form.querySelector(`#${CSS.escape(name)},[name="${name}"]`);if(el)return el}return null}
  function readForm(form){const out={};for(const [key,names] of Object.entries(aliases)){const el=field(form,names);if(el)out[key]=el.value}return normalize(out)}
  function fillForm(form,customer){const row=normalize(customer);for(const [key,names] of Object.entries(aliases)){const el=field(form,names);if(el&&key in row)el.value=row[key]??''}const select=form.querySelector('#fcustomer');if(select&&idOf(row))select.value=idOf(row);form.dispatchEvent(new CustomEvent('copyset:customer-filled',{bubbles:true,detail:{customer:row}}));return row}
  root.customerApi=Object.freeze({all,find,findByBusinessId,search,normalize,add,update,readForm,fillForm});
})();