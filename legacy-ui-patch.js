/* CopySet ERP compatibility bridge.
   Keeps the verified legacy document/workflow runtime and normalizes only the offer list UI. */
(function(){
  if(typeof renderQuotes!=='function')return;
  const baseRenderQuotes=renderQuotes;
  const polish=document.createElement('style');
  polish.textContent='#title{color:#fff!important}.top-title-icon{display:none!important}#quotes>.quote-summary{display:none!important}';
  document.head.appendChild(polish);

  function normalizeQuoteList(){
    const root=document.getElementById('quotes');
    if(!root)return;

    const cards=root.querySelectorAll(':scope > .card');
    const intro=cards[0];
    const listCard=cards[cards.length-1];
    const summary=root.querySelector(':scope > .quote-summary');

    if(intro)intro.hidden=true;
    if(summary){summary.hidden=true;summary.style.setProperty('display','none','important');}
    if(!listCard)return;

    listCard.classList.add('list-shell');
    const toolbar=listCard.querySelector('.quote-toolbar');
    if(toolbar){
      toolbar.classList.add('list-tools');
      const filters=toolbar.querySelector('.quote-filters');
      if(filters){
        filters.classList.add('list-filters');
        const stages=['Kaikki','Luonnos','Valmis lähetettäväksi','Lähetetty','Hyväksytty','Hylätty'];
        const offers=typeof st!=='undefined'?(st.orders||[]).filter(o=>o.mode==='Tarjous'):[];
        filters.querySelectorAll('.quote-filter').forEach((button,index)=>{
          button.classList.add('list-filter');
          if(button.querySelector('.count'))return;
          const name=stages[index]||button.textContent.trim();
          const count=name==='Kaikki'?offers.length:offers.filter(o=>quoteStage(o)===name).length;
          button.insertAdjacentHTML('beforeend','<span class="count">'+count+'</span>');
        });
      }
    }

    listCard.querySelectorAll('tbody tr').forEach(row=>{
      const stage=row.querySelector('.quote-stage')?.textContent.trim();
      const actions=row.querySelector('.quote-actions');
      if(!actions||!stage)return;
      const buttons=[...actions.querySelectorAll('button')];
      const open=buttons.find(button=>button.textContent.trim()==='Avaa');
      if(['Luonnos','Valmis lähetettäväksi','Lähetetty','Hyväksytty'].includes(stage))open?.remove();
      buttons.find(button=>button.textContent.trim()==='Lähetä')?.replaceChildren('Avaa ja lähetä');
    });
  }

  renderQuotes=function(){
    baseRenderQuotes();
    normalizeQuoteList();
  };
  renderQuotes();
})();
