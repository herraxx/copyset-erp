/* CopySet ERP — clean save controller for the legacy-rendered offer/order form. */
(function(){
 const root=window.CopySet=window.CopySet||{};
 function formRoot(){return root.formLifecycle?.current?.()||document.querySelector('.modal.on')}
 function showError(result){const form=formRoot();if(!form)return alert(result?.error||'Tarkista puuttuvat tiedot.');let box=form.querySelector('#copyset-form-error');if(!box){box=document.createElement('div');box.id='copyset-form-error';box.className='copyset-form-error';form.prepend(box)}box.textContent=result?.error||'Tarkista puuttuvat tiedot.';const first=result?.errors?.[0]?.field;if(first)box.dataset.field=first;box.scrollIntoView({block:'nearest'});return false}
 function clearError(){formRoot()?.querySelector('#copyset-form-error')?.remove()}
 function closeLegacyModal(){try{if(typeof closeM==='function'){closeM();return}}catch(_e){}const modal=formRoot();modal?.classList.remove('on')}
 function save(options={}){clearError();const result=root.orderFormData?.save?.(options);if(!result?.ok)return showError(result||{error:'Tallennus ei onnistunut.'});closeLegacyModal();root.renderQuotes?.();root.renderOrders?.();document.dispatchEvent(new CustomEvent('copyset:order-form-save-complete',{detail:{order:result.order,editing:result.editing}}));return result}
 function bind(){const form=formRoot();if(!form||form.dataset.copysetSaveBound==='1')return false;const buttons=[...form.querySelectorAll('button,input[type="button"],input[type="submit"]')];const saveButton=buttons.find(el=>/^(tallenna|save)(\s|$)/i.test(String(el.textContent||el.value||'').trim()));if(!saveButton)return false;form.dataset.copysetSaveBound='1';saveButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();save()},{capture:true});return true}
 document.addEventListener('copyset:order-form-rendered',()=>queueMicrotask(bind));
 root.orderFormSave=Object.freeze({save,bind});
 window.copysetSaveOrder=save;
})();