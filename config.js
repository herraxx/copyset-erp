/* CopySet ERP — canonical business configuration */
(function(){
  const root=window.CopySet=window.CopySet||{};
  const config={
    locale:'fi-FI',
    currency:'EUR',
    domesticCountry:'Suomi',
    domesticVat:25.5,
    exportVat:0,
    setupFee:50,
    billingFee:6,
    paymentTermsDays:21,
    workflow:Object.freeze(['Tarjous','Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu']),
    orderStatuses:Object.freeze(['Vahvistettu','Tuotannossa','Valmis','Laskutusvalmis','Laskutettu']),
    productionSteps:Object.freeze(['Aloitettu','Käynnissä','Valmis'])
  };
  root.config=Object.freeze(config);

  const moneyFormatter=new Intl.NumberFormat(config.locale,{style:'currency',currency:config.currency});
  const domesticCountries=new Set(['suomi','finland','fi']);
  const isoDate=/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/;
  const finnishDate=/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  const pad=value=>String(value).padStart(2,'0');

  root.formatDate=function(value){
    if(value===null||value===undefined||value==='')return'';
    const text=String(value).trim();
    let match=text.match(isoDate);
    if(match)return `${match[3]}.${match[2]}.${match[1]}`;
    match=text.match(finnishDate);
    if(match)return `${pad(match[1])}.${pad(match[2])}.${match[3]}`;
    if(value instanceof Date&&!Number.isNaN(value.getTime()))return `${pad(value.getDate())}.${pad(value.getMonth()+1)}.${value.getFullYear()}`;
    return text;
  };

  root.parseNumber=function(value,fallback=0){
    if(typeof value==='number')return Number.isFinite(value)?value:fallback;
    const normalized=String(value??'').trim().replace(/\s/g,'').replace(',','.');
    const number=Number(normalized);
    return Number.isFinite(number)?number:fallback;
  };

  root.formatMoney=function(value){return moneyFormatter.format(root.parseNumber(value,0))};

  root.vatForCountry=function(country){
    const normalized=String(country||config.domesticCountry).trim().toLowerCase();
    return domesticCountries.has(normalized)?config.domesticVat:config.exportVat;
  };
})();