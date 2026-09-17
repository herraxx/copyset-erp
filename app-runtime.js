/* CopySet ERP controlled compatibility runtime.
   This is the single integration point between the verified legacy data/document
   runtime and the extracted pricing and order-workspace modules. */
(function initializeCopySetRuntime() {
  'use strict';

  const app = window.CopySet = window.CopySet || {};
  const legacy = Object.freeze({
    renderQuotes: typeof window.renderQuotes === 'function' ? window.renderQuotes : null,
    renderOrders: typeof window.renderOrders === 'function' ? window.renderOrders : null,
    showConfirmation: typeof window.showConfirmation === 'function' ? window.showConfirmation : null,
    showInvoiceReview: typeof window.showInvoiceReview === 'function' ? window.showInvoiceReview : null,
    editOrder: typeof window.editOrder === 'function' ? window.editOrder : null
  });

  function resetScroll() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function ensureRuntimeStyle() {
    if (document.getElementById('copyset-runtime-style')) return;
    const style = document.createElement('style');
    style.id = 'copyset-runtime-style';
    style.textContent =
      '#title{color:#fff!important}' +
      '.top-title-icon{display:none!important}' +
      '#quotes>.quote-summary{display:none!important}';
    document.head.appendChild(style);
  }

  function normalizeQuoteList() {
    const root = document.getElementById('quotes');
    if (!root) return;

    const cards = root.querySelectorAll(':scope > .card');
    const intro = cards[0];
    const listCard = cards[cards.length - 1];
    const summary = root.querySelector(':scope > .quote-summary');

    if (intro) intro.hidden = true;
    if (summary) {
      summary.hidden = true;
      summary.style.setProperty('display', 'none', 'important');
    }
    if (!listCard) return;

    listCard.classList.add('list-shell');
    const toolbar = listCard.querySelector('.quote-toolbar');
    if (toolbar) {
      toolbar.classList.add('list-tools');
      const filters = toolbar.querySelector('.quote-filters');
      if (filters) {
        filters.classList.add('list-filters');
        const stages = ['Kaikki', 'Luonnos', 'Valmis lähetettäväksi', 'Lähetetty', 'Hyväksytty', 'Hylätty'];
        const offers = typeof window.st !== 'undefined'
          ? (window.st.orders || []).filter(order => order.mode === 'Tarjous')
          : (typeof st !== 'undefined' ? (st.orders || []).filter(order => order.mode === 'Tarjous') : []);

        filters.querySelectorAll('.quote-filter').forEach((button, index) => {
          button.classList.add('list-filter');
          if (button.querySelector('.count')) return;
          const name = stages[index] || button.textContent.trim();
          const count = name === 'Kaikki'
            ? offers.length
            : offers.filter(order => typeof quoteStage === 'function' && quoteStage(order) === name).length;
          button.insertAdjacentHTML('beforeend', '<span class="count">' + count + '</span>');
        });
      }
    }

    listCard.querySelectorAll('tbody tr').forEach(row => {
      const stage = row.querySelector('.quote-stage')?.textContent.trim();
      const actions = row.querySelector('.quote-actions');
      if (!actions || !stage) return;
      const buttons = Array.from(actions.querySelectorAll('button'));
      const openButton = buttons.find(button => button.textContent.trim() === 'Avaa');
      if (['Luonnos', 'Valmis lähetettäväksi', 'Lähetetty', 'Hyväksytty'].includes(stage)) {
        openButton?.remove();
      }
      buttons
        .find(button => button.textContent.trim() === 'Lähetä')
        ?.replaceChildren('Avaa ja lähetä');
    });
  }

  function normalizeOrderList() {
    const root = document.getElementById('orders');
    const shell = root?.querySelector(':scope > .card');
    if (!shell) return;

    shell.classList.add('list-shell');
    const toolbar = shell.querySelector(':scope > .toolbar');
    const filters = shell.querySelector(':scope > .order-filterbar');
    if (toolbar) toolbar.classList.add('list-tools');
    if (!filters) return;

    filters.classList.add('list-filters');
    filters.querySelectorAll('.order-filter').forEach(button => {
      button.classList.add('list-filter');
      button.querySelector('b')?.classList.add('count');
    });
    if (toolbar && filters.parentElement !== toolbar) toolbar.appendChild(filters);
  }

  function renderQuotes() {
    legacy.renderQuotes?.();
    normalizeQuoteList();
  }

  function renderOrders() {
    legacy.renderOrders?.();
    normalizeOrderList();
  }

  function openPricingView() {
    document.querySelectorAll('.nav').forEach(item => item.classList.remove('on'));
    document.querySelectorAll('.view').forEach(item => item.classList.remove('on'));

    const button = document.querySelector('.nav[data-v="pricing"]');
    const view = document.getElementById('pricing');
    button?.classList.add('on');
    view?.classList.add('on');

    const title = document.getElementById('title');
    if (title) title.textContent = 'Hinnoittelu';

    app.renderPricing?.();
    app.pricing?.enhance?.();
    resetScroll();
  }

  function runtimeHealth() {
    const checks = {
      quotesView: Boolean(document.getElementById('quotes')),
      ordersView: Boolean(document.getElementById('orders')),
      pricingNavigation: Boolean(document.querySelector('.nav[data-v="pricing"]')),
      pricingView: Boolean(document.getElementById('pricing')),
      pricingModule: typeof app.renderPricing === 'function',
      pricingCalculator: typeof app.pricing?.enhance === 'function',
      orderWorkspace: typeof app.orderPage?.open === 'function',
      quoteRenderer: typeof window.renderQuotes === 'function',
      orderRenderer: typeof window.renderOrders === 'function'
    };
    return {
      ok: Object.values(checks).every(Boolean),
      checks,
      version: '20260917-cleanup-preview-01'
    };
  }

  ensureRuntimeStyle();

  window.renderQuotes = renderQuotes;
  window.renderOrders = renderOrders;
  app.renderQuotes = renderQuotes;
  app.renderOrders = renderOrders;

  if (legacy.showConfirmation) app.confirmation = { open: id => legacy.showConfirmation(id) };
  if (legacy.showInvoiceReview) app.invoiceReview = { open: id => legacy.showInvoiceReview(id) };
  if (legacy.editOrder) app.orderForm = { edit: id => legacy.editOrder(id) };
  if (app.orderPage?.open) window.openOrder = id => app.orderPage.open(id);

  const pricingButton = document.querySelector('.nav[data-v="pricing"]');
  if (pricingButton) pricingButton.onclick = openPricingView;

  document.querySelectorAll('.side .nav').forEach(button => {
    button.addEventListener('click', () => setTimeout(resetScroll, 0));
  });
  document.addEventListener('click', event => {
    if (event.target.closest('.nav[data-v="pricing"]')) setTimeout(openPricingView, 0);
    if (event.target.closest('.top-create-actions')) {
      setTimeout(() => app.pricing?.enhance?.(), 0);
    }
  });

  renderQuotes();
  renderOrders();
  app.renderPricing?.();
  app.pricing?.enhance?.();

  app.openPricingView = openPricingView;
  app.runtimeHealth = runtimeHealth;
  document.dispatchEvent(new CustomEvent('copyset:runtime-ready', { detail: runtimeHealth() }));
})();