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
  const isoDate=/^(\d{4})-(\d{2})-(\d{2})$/;

  root.formatDate=function(value){
    if(value===null||value===undefined||value==='')return'';
    const text=String(value).trim();
    const iso=text.match(isoDate);
    if(iso)return `${iso[3]}.${iso[2]}.${iso[1]}`;
    const date=value instanceof Date?value:new Date(value);
    return Number.isNaN(date.getTime())?text:date.toLocaleDateString(config.locale);
  };

  root.formatMoney=function(value){
    const number=typeof value==='number'?value:Number(String(value??'').replace(',','.'));
    return moneyFormatter.format(Number.isFinite(number)?number:0);
  };

  root.vatForCountry=function(country){
    const normalized=String(country||config.domesticCountry).trim().toLowerCase();
    return domesticCountries.has(normalized)?config.domesticVat:config.exportVat;
  };
})();