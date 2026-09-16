/* CopySet ERP — canonical customer data API.
   UI/form ownership stays in the legacy monolith until Gate D is fully mapped. */
(function(){
  const root=window.CopySet=window.CopySet||{};

  const text=value=>String(value??'').trim();
  const lower=value=>text(value).toLocaleLowerCase('fi-FI');
  const idOf=customer=>text(customer?.id||customer?.customerId||customer?.bid||customer?.businessId);

  function all(){return root.customers?.()||[]}

  function find(id){
    const key=text(id);
    if(!key)return null;
    return all().find(customer=>idOf(customer)===key)||null;
  }

  function search(query){
    const needle=lower(query);
    if(!needle)return all().slice();
    return all().filter(customer=>[
      customer.company,customer.name,customer.contact,customer.email,customer.phone,
      customer.bid,customer.businessId,customer.address,customer.zip,customer.city
    ].some(value=>lower(value).includes(needle)));
  }

  function normalize(customer={}){
    return {
      ...customer,
      company:text(customer.company||customer.name),
      contact:text(customer.contact),
      bid:text(customer.bid||customer.businessId),
      email:text(customer.email),
      phone:text(customer.phone),
      address:text(customer.address),
      zip:text(customer.zip||customer.postalCode),
      city:text(customer.city),
      country:text(customer.country||root.config?.domesticCountry||'Suomi')
    };
  }

  function add(customer){
    const state=root.state?.();
    if(!state||!Array.isArray(state.customers))return null;
    const row=normalize(customer);
    row.id=text(row.id)||`c${Date.now()}`;
    state.customers.push(row);
    root.persist?.({render:false});
    return row;
  }

  function update(id,patch){
    const row=find(id);
    if(!row)return null;
    Object.assign(row,normalize({...row,...patch}),{id:row.id});
    root.persist?.({render:false});
    return row;
  }

  root.customerApi=Object.freeze({all,find,search,normalize,add,update});
})();