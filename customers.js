/* CopySet ERP — canonical customer data API.
   UI/form ownership stays in the legacy monolith until Gate D is fully mapped. */
(function(){
  const root=window.CopySet=window.CopySet||{};

  const text=value=>String(value??'').trim();
  const lower=value=>text(value).toLocaleLowerCase('fi-FI');
  const businessId=value=>text(value).toUpperCase().replace(/\s+/g,'');
  const idOf=customer=>text(customer?.id||customer?.customerId);

  function all(){return root.customers?.()||[]}

  function find(id){
    const key=text(id);
    if(!key)return null;
    return all().find(customer=>idOf(customer)===key)||null;
  }

  function findByBusinessId(value){
    const key=businessId(value);
    if(!key)return null;
    return all().find(customer=>businessId(customer.bid||customer.businessId)===key)||null;
  }

  function search(query){
    const needle=lower(query);
    if(!needle)return all().slice();
    return all().filter(customer=>[
      customer.company,customer.name,customer.contact,customer.email,customer.phone,
      customer.bid,customer.businessId,customer.address,customer.zip,customer.postalCode,customer.city
    ].some(value=>lower(value).includes(needle)));
  }

  function normalize(customer={}){
    const bid=businessId(customer.bid||customer.businessId);
    return {
      ...customer,
      company:text(customer.company||customer.name),
      contact:text(customer.contact),
      bid,
      businessId:bid,
      email:text(customer.email).toLowerCase(),
      phone:text(customer.phone),
      address:text(customer.address),
      zip:text(customer.zip||customer.postalCode),
      city:text(customer.city),
      country:text(customer.country||root.config?.domesticCountry||'Suomi')
    };
  }

  function nextId(){
    const used=new Set(all().map(idOf).filter(Boolean));
    let n=1;
    while(used.has(`c${n}`))n++;
    return `c${n}`;
  }

  function add(customer){
    const state=root.state?.();
    if(!state||!Array.isArray(state.customers))return null;
    const row=normalize(customer);
    const duplicate=findByBusinessId(row.bid);
    if(duplicate)return duplicate;
    row.id=idOf(row)||nextId();
    state.customers.push(row);
    root.persist?.({render:false});
    return row;
  }

  function update(id,patch){
    const row=find(id);
    if(!row)return null;
    const next=normalize({...row,...patch});
    const duplicate=findByBusinessId(next.bid);
    if(duplicate&&duplicate!==row)return null;
    Object.assign(row,next,{id:row.id});
    root.persist?.({render:false});
    return row;
  }

  root.customerApi=Object.freeze({all,find,findByBusinessId,search,normalize,add,update});
})();