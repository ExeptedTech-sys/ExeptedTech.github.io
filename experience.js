/* ExeptedTech Experience, progressive enhancement. No personal data sent to third parties here. */
(() => {
  'use strict';
  const $ = (sel,root=document)=>root.querySelector(sel);
  const $$ = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const money = cents => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(cents/100);
  const planPrice = { personal:null, business:180000, 'business-plus':280000, vip:480000 };
  const maintenance = { personal:['web-personal-maint',25000], business:['web-business-maint',25000], 'business-plus':['web-business-plus-maint',25000], vip:['web-vip-maint',100000] };
  const productSku = {personal:'web-personal',business:'web-business','business-plus':'web-business-plus',vip:'web-vip'};
  function wa(message) { window.open('https://wa.me/525566147938?text='+encodeURIComponent(message),'_blank','noopener,noreferrer'); }
  function updatePlan(card) {
    const slug=card.dataset.plan,extra=card.querySelector('.xt-plan-option')?.checked;
    const amount=planPrice[slug],mnt=maintenance[slug];
    const description=card.querySelector('.xt-plan-total');
    description.textContent=amount===null
      ? (extra?`Sitio: a cotizar · mantenimiento opcional: ${money(mnt[1])} por 15 días.`:'Sitio: a cotizar. El mantenimiento se contrata aparte.')
      :`Tu selección: ${money(amount+(extra?mnt[1]:0))} MXN${extra?' · incluye un primer periodo de mantenimiento':''}.`;
  }
  $$('.xt-plan').forEach(card=>{
    const slug=card.dataset.plan;
    $('.xt-plan-option',card)?.addEventListener('change',()=>updatePlan(card));
    $('[data-configure-plan]',card)?.addEventListener('click',()=>{
      const included=$('.xt-plan-option',card)?.checked||false;
      if(planPrice[slug]===null){
        wa(`Hola ExeptedTech, quiero cotizar el paquete Exepted Personal para mi blog o sitio sencillo.${included?' También quiero mantenimiento de $250 por 15 días.':''} Confírmenme el precio final, el dominio por separado y el alcance.`);return;
      }
      const items=[productSku[slug]];
      if(included) items.push(maintenance[slug][0]);
      document.dispatchEvent(new CustomEvent('exepted:add-to-cart',{detail:{skus:items}}));
    });
    updatePlan(card);
  });
  $$('[data-add-sku]').forEach(btn=>btn.addEventListener('click',()=>{
    document.dispatchEvent(new CustomEvent('exepted:add-to-cart',{detail:{sku:btn.dataset.addSku}}));
  }));
  // Cookie notice is informational; no non-essential tracking is installed by this code.
  const notice=$('#xt-cookie-banner');
  const choiceKey='exeptedtech-privacy-notice-v1';
  if(notice){
    let dismissed=false;
    try { dismissed=localStorage.getItem(choiceKey)==='seen'; }catch{}
    notice.hidden=dismissed;
    $('#xt-cookie-close')?.addEventListener('click',()=>{
      notice.hidden=true;
      try{localStorage.setItem(choiceKey,'seen');}catch{}
    });
  }
  // No always-on canvas or mousemove listeners; style enhancements are GPU-safe CSS.
})();
