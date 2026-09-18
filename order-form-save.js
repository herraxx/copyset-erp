/* CopySet ERP — canonical offer/order save controller. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 function formRoot(){return root.formLifecycle?.current?.()||document.getElementById('modal')}
 function showError(result){const form=formRoot();if(!form)return alert(result?.error||'Tarkista puuttuvat tiedot.');let box=form.querySelector('#copyset-form-error');if(!box){box=document.createElement('div');box.id='copyset-form-error';box.className='copyset-form-error';form.prepend(box)}box.textContent=result?.error||'Tarkista puuttuvat tiedot.';const first=result?.errors?.[0]?.field;if(first)box.dataset.field=first;box.scrollIntoView({block:'nearest'});return false}
 function clearError(){formRoot()?.querySelector('#copyset-form-error')?.remove()}
 function save(options={}){clearError();const result=root.orderFormData?.save?.(options);if(!result?.ok)return showError(result||{error:'Tallennus ei onnistunut.'});root.renderQuotes?.();root.renderOrders?.();if(result.order?.mode==='Tarjous')root.quoteActions?.open?.(result.order.id);else root.confirmation?.open?.(result.order.id);document.dispatchEvent(new CustomEvent('copyset:order-form-save-complete',{detail:{order:result.order,editing:result.editing}}));return result}
 function bind(form=formRoot()){if(!form||form.dataset.copysetSaveBound==='1')return false;const saveButton=form.querySelector('[data-form-save]');if(!saveButton)return false;form.dataset.copysetSaveBound='1';saveButton.addEventListener('click',event=>{event.preventDefault();save()});return true}
 document.addEventListener('copyset:order-form-rendered',event=>bind(event.detail?.root));root.orderFormSave=Object.freeze({save,bind});window.copysetSaveOrder=save;
})();