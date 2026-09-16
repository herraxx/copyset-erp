/* CopySet ERP — canonical business configuration */
(function(){
  const root=window.CopySet=window.CopySet||{};
  root.config=Object.freeze({
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
  });
  root.formatDate=function(value){if(!value)return'';const d=/^\d{4}-\d{2}-\d{2}$/.test(String(value))?new Date(value+'T12:00:00'):new Date(value);return Number.isNaN(d.getTime())?String(value):d.toLocaleDateString(root.config.locale)};
  root.formatMoney=function(value){return new Intl.NumberFormat(root.config.locale,{style:'currency',currency:root.config.currency}).format(Number(value)||0)};
  root.vatForCountry=function(country){const x=String(country||root.config.domesticCountry).trim().toLowerCase();return ['suomi','finland','fi'].includes(x)?root.config.domesticVat:root.config.exportVat};
})();