/* CopySet ERP clean19 — final same-view Tarjous/Tilaus flow */
(function(){
  function byId(id){ return (window.st?.orders||[]).find(o=>String(o.id)===String(id)); }

  /* Keep native calendars on every create/edit render. */
  const previousOrderForm=window.orderForm;
  if(typeof previousOrderForm==='function'){
    window.orderForm=function(o){
      let html=previousOrderForm(o);
      const vals={fdate:o.date||'',fvalid:o.valid||'',fdeliverydate:o.deliveryDate||o.deadline||'',fdeadline:o.deadline||''};
      Object.entries(vals).forEach(([id,val])=>{
        const re=new RegExp('<input id="'+id+'"[^>]*>');
        const iso=(typeof ISO_DATE==='function'?ISO_DATE(val):val)||'';
        html=html.replace(re,'<input id="'+id+'" type="date" value="'+(typeof E==='function'?E(iso):iso)+'">');
      });
      /* Calculator wording follows the actual document type. */
      html=html.replace('✓ Käytä tässä tarjouksessa','✓ Käytä tässä '+((o.mode||window.mode)==='Tilaus'?'tilauksessa':'tarjouksessa'));
      return html;
    };
  }

  /* After a direct order is confirmed, stay in the same view and allow production to start immediately. */
  const previousShowConfirmation=window.showConfirmation;
  if(typeof previousShowConfirmation==='function'){
    window.showConfirmation=function(id){
      previousShowConfirmation(id);
      const o=byId(id), body=document.getElementById('mb');
      if(!o||!body||o.mode!=='Tilaus') return;
      const actions=body.querySelector('.actions:last-child');
      if(actions && !actions.querySelector('[data-start-production]')){
        const b=document.createElement('button');
        b.className='btn orange';
        b.dataset.startProduction='1';
        b.textContent='▶ Vie tuotantoon';
        b.onclick=function(){
          if(typeof window.copysetStartProduction==='function') window.copysetStartProduction(id);
        };
        actions.insertBefore(b,actions.firstChild);
      }
    };
  }

  /* Quote preview never exposes a production action. */
  const previousShowQuote=window.showQuote;
  if(typeof previousShowQuote==='function'){
    window.showQuote=function(id){
      previousShowQuote(id);
      const body=document.getElementById('mb');
      if(!body)return;
      [...body.querySelectorAll('button')].forEach(b=>{
        if(/vie tuotantoon/i.test(b.textContent||'')) b.remove();
      });
    };
  }

  /* Creation is always explicit: quote or order. */
  const previousNewOrder=window.newOrder;
  if(typeof previousNewOrder==='function'){
    window.newOrder=function(kind){
      const k=kind==='Tilaus'?'Tilaus':'Tarjous';
      return previousNewOrder(k);
    };
  }
})();