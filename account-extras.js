/* ExeptedTech: navegación de cuenta, recomendaciones locales y avisos de carrito. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const menu = $('xt-account-menu'), toggle = $('xt-account-toggle'), options = $('xt-account-options');
  const historyKey = 'exeptedtech-viewed-categories-v1';
  const catalog = Array.isArray(window.EXEPTED_CATALOG) ? window.EXEPTED_CATALOG : [];
  let categories = {};
  try {const saved = JSON.parse(localStorage.getItem(historyKey)||'{}');if(saved && typeof saved==='object' && !Array.isArray(saved)) for(const [key,value] of Object.entries(saved).slice(0,40)) if(typeof key==='string' && Number.isSafeInteger(value) && value>0 && value<=10000) categories[key]=value;}catch{}
  const close = () => { options.hidden=true;toggle.setAttribute('aria-expanded','false'); };
  function go(view){close();document.getElementById('cuenta')?.scrollIntoView({behavior:'smooth'});document.dispatchEvent(new CustomEvent('exepted:'+view));}
  toggle?.addEventListener('click',()=>{const open=options.hidden;options.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',e=>{if(!menu?.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  const source = $('nav-login');const signIn = document.querySelector('.header-auth-cta');
  document.addEventListener('exepted:auth',e=>{
    const user=e.detail?.session?.user;const loggedIn=Boolean(user);
    menu.hidden=!loggedIn;
    if(source)source.hidden=loggedIn;
    if(signIn)signIn.hidden=loggedIn;
    if(loggedIn){const nick=String(user.user_metadata?.nickname||user.email?.split('@')[0]||'Cliente').slice(0,30);$('xt-account-nick').textContent=nick;$('xt-account-greeting').textContent=`Hola, ${nick}`;}else close();
  });
  document.querySelectorAll('[data-account-action]').forEach(button=>button.addEventListener('click',()=>{
    const action=button.dataset.accountAction;
    if(action==='cart'){close();document.dispatchEvent(new Event('exepted:open-cart'));return;}
    if(action==='logout'){close();$('logout')?.click();return;}
    if(action==='password'){go('settings');document.dispatchEvent(new Event('exepted:secure-password-change'));return;}
    if(action==='orders'){go('orders');return;}
    if(action==='recommend'){go('recommend');renderRecommendations();return;}
    if(action==='profile')go('settings');
  }));
  document.addEventListener('exepted:profile-update', e=>{const nick=String(e.detail?.nickname||'').slice(0,30);if(nick){$('xt-account-nick').textContent=nick;$('xt-account-greeting').textContent=`Hola, ${nick}`;}});
  $('xt-secure-change')?.addEventListener('click',()=>document.dispatchEvent(new Event('exepted:secure-password-change')));
  document.addEventListener('exepted:product-view',e=>{
    const cat=e.detail?.category;
    if(!cat || typeof cat!=='string' || cat.length>80)return;
    categories[cat]=Math.min(10000,(categories[cat]||0)+1);
    try{localStorage.setItem(historyKey,JSON.stringify(categories));}catch{}
  });
  function renderRecommendations(){
    const list=$('xt-recommend-list');if(!list)return;list.replaceChildren();
    const ranked=catalog.filter(p=>!p.restricted && typeof p.priceCents==='number').sort((a,b)=>(categories[b.category]||0)-(categories[a.category]||0));
    const items=ranked.filter(p=>(categories[p.category]||0)>0).slice(0,6);
    if(!items.length){list.textContent='Explora la tienda y selecciona las tarjetas de los productos para empezar a recibir sugerencias.';return;}
    for(const p of items){const card=document.createElement('article');card.className='xt-recommend-card';const name=document.createElement('strong');name.textContent=p.name;const price=document.createElement('span');price.textContent=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(p.priceCents/100);const btn=document.createElement('button');btn.type='button';btn.textContent='Añadir al carrito +';btn.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('exepted:add-to-cart',{detail:{sku:p.sku}})));card.append(name,price,btn);list.append(card);}
  }
  $('xt-clear-history')?.addEventListener('click',()=>{categories={};try{localStorage.removeItem(historyKey);}catch{}renderRecommendations();});
  const toast=$('xt-cart-toast');let timer;
  document.addEventListener('exepted:cart-added',()=>{
    if(!toast)return;
    clearTimeout(timer);toast.hidden=false;
    timer=setTimeout(()=>{toast.hidden=true;},4000);
  });
  $('xt-toast-open-cart')?.addEventListener('click',()=>{clearTimeout(timer);toast.hidden=true;document.dispatchEvent(new Event('exepted:open-cart'));});
  // Desde el carrito, abre el banco elegido sin bloquear el desplazamiento del documento.
  for (const [actionId, detailsId] of [['xt-pay-transfer','transferencia'],['xt-pay-nu','transferencia-nu']]) {
    $(actionId)?.addEventListener('click',event=>{
      event.preventDefault();
      const details=$(detailsId);
      if(!details)return;
      document.dispatchEvent(new Event('exepted:close-cart'));
      details.open=true;
      requestAnimationFrame(()=>{
        details.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
        details.querySelector('summary')?.focus({preventScroll:true});
      });
    });
  }
  renderRecommendations();
})();
