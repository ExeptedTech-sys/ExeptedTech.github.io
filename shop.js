/* ExeptedTech Market · UI publica: carrito sin datos de pago, acceso vinculado a Supabase */
(() => {
  'use strict';
  const catalog = Array.isArray(window.EXEPTED_CATALOG) ? window.EXEPTED_CATALOG : [];
  const config = window.EXEPTED_CONFIG || {};
  const bySku = new Map(catalog.map(p => [p.sku,p]));
  const $ = sel => document.querySelector(sel);
  const cartKey = 'exeptedtech-cart-v1';
  const waHelp = p => 'https://wa.me/525566147938?text='+encodeURIComponent(`Hola ExeptedTech, necesito asistencia sobre ${p.name}. ¿Me ayudan con disponibilidad, condiciones y cómo comprar?`);
  const pesos = cents => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(cents/100);
  const validQ = n => Number.isInteger(n) && n > 0 && n <= 10;
  let cart = {};
  let session = window.EXEPTED_AUTH?.getSession?.() || null;
  let previousFocus = null;
  const overlay = $('#store-cart-overlay');

  try {
    const saved = JSON.parse(localStorage.getItem(cartKey) || '{}');
    if (saved && typeof saved === 'object') for (const [sku,q] of Object.entries(saved)) {
      if (bySku.has(sku) && !bySku.get(sku).restricted && typeof bySku.get(sku).priceCents === "number" && validQ(q)) cart[sku] = q;
    }
  } catch { cart = {}; }
  const persist = () => {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* Cart still functions in memory */ }
  };
  function make(tag, cls, txt) {
    const el = document.createElement(tag);
    if (cls) el.className=cls;
    if (txt !== undefined) el.textContent=String(txt);
    return el;
  }
  const sum = () => Object.entries(cart).reduce((acc,[sku,q]) => acc + (bySku.get(sku)?.priceCents || 0)*q,0);
  const lines = () => Object.entries(cart).map(([sku,q]) => ({...bySku.get(sku),q})).filter(x=>x.sku);
  function renderStore() {
    const filter = $('#store-category').value;
    const search = $('#store-search').value.trim().toLocaleLowerCase('es');
    const list = catalog.filter(p => (filter==='all'||p.category===filter) && `${p.name} ${p.description}`.toLocaleLowerCase('es').includes(search));
    const grid = $('#store-items');
    grid.replaceChildren();
    for (const product of list) {
      const card = make('article','store-card');
      const meta = make('div','store-card-meta');
      meta.append(make('span','',product.category),make('span','',product.duration));
      card.append(meta,make('h3','',product.name),make('p','',product.description));
      card.addEventListener('click', event=>{if(event.target.closest('button,a'))return;document.dispatchEvent(new CustomEvent('exepted:product-view',{detail:{sku:product.sku,category:product.category}}));});
      const price=make('div','store-price',product.priceCents!==null?pesos(product.priceCents):'Consultar');
      price.append(make('small','',product.priceCents!==null?' MXN':' · precio por confirmar'));
      card.append(price);
      const actions=make('div','xt-store-actions');
      const button = make('button','',(product.priceCents === null || product.restricted) ? 'Solicitar información ↗' : 'Agregar al carrito +');
      button.type='button';
      button.addEventListener('click',()=>{
        document.dispatchEvent(new CustomEvent('exepted:product-view',{detail:{sku:product.sku,category:product.category}}));
        if (product.priceCents===null || product.restricted) {
          window.open('https://wa.me/525566147938?text='+encodeURIComponent(`Hola ExeptedTech, quiero cotizar ${product.name}. ¿Tienen disponibilidad?`),'_blank','noopener,noreferrer');
          return;
        }
        if((cart[product.sku]||0)>=10) return;
        cart[product.sku]=(cart[product.sku]||0)+1;
        persist();renderCart();document.dispatchEvent(new CustomEvent('exepted:cart-added'));
        button.textContent='Agregado ✓';
        setTimeout(()=>button.textContent='Agregar al carrito +',950);
      });
      const help=make('a','xt-store-help','Asistencia y ayuda ↗');help.href=waHelp(product);help.target='_blank';help.rel='noopener noreferrer';help.setAttribute('aria-label',`Pedir ayuda sobre ${product.name} por WhatsApp`);
      actions.append(button,help);card.append(actions);grid.append(card);
    }
    $('#store-empty').hidden=list.length!==0;
  }
  function renderCart() {
    const products = lines();
    $('#cart-count').textContent=products.reduce((n,p)=>n+p.q,0);
    $('#store-cart-total').textContent=pesos(sum());
    const region=$('#store-cart-lines');region.replaceChildren();
    if(!products.length) region.append(make('p','', 'Tu carrito está vacío. Explora el catálogo y agrega productos.'));
    for(const p of products) {
      const line=make('article','store-cart-line');
      const description=make('div');description.append(make('h3','',p.name),make('small','',`${pesos(p.priceCents)} × ${p.q}`));
      const actions=make('div','store-cart-line-actions');
      const minus=make('button','', '−');minus.type='button';minus.setAttribute('aria-label',`Quitar una unidad de ${p.name}`);
      const counter=make('output','',p.q);
      const plus=make('button','', '+');plus.type='button';plus.setAttribute('aria-label',`Agregar una unidad de ${p.name}`);
      minus.addEventListener('click',()=>adjust(p.sku,-1));plus.addEventListener('click',()=>adjust(p.sku,1));
      actions.append(minus,counter,plus);line.append(description,actions);region.append(line);
    }
    const msg= products.length ? `Hola ExeptedTech, quisiera consultar la disponibilidad, licencias y forma de pago de este pedido:\n${products.map(p=>`• ${p.name} × ${p.q} = ${pesos(p.priceCents*p.q)}`).join('\n')}\nTotal de referencia publicado: ${pesos(sum())}. ¿Está autorizado y disponible el pedido, y cuáles son sus condiciones de entrega?` : 'Hola ExeptedTech, quiero información de sus productos.';
    $('#store-whatsapp-checkout').href='https://wa.me/525566147938?text='+encodeURIComponent(msg);
    const cardButton = $('#store-card-checkout');
    cardButton.disabled = products.length === 0;
    cardButton.textContent = 'Preparar importe del pedido ↗';
    cardButton.title = 'Consultar y preparar importe para Mercado Pago';
    $('#store-checkout-status').textContent = products.length ? 'Confirma que ExeptedTech autorice el pedido antes de pagar. El enlace de monto abierto requiere verificación manual.' : 'Agrega productos para preparar tu consulta.';
  }
  function adjust(sku,d){const next=(cart[sku]||0)+d;if(next<1) delete cart[sku];else if(next<=10) cart[sku]=next;persist();renderCart();}
  function cartOpen(){previousFocus=document.activeElement;overlay.hidden=false;document.body.classList.add('modal-open');overlay.querySelector('[data-cart-close]')?.focus();}
  function cartClose(){overlay.hidden=true;document.body.classList.remove('modal-open');previousFocus?.focus();}
  $('#open-cart')?.addEventListener('click',cartOpen);
  $('#dashboard-open-cart')?.addEventListener('click',cartOpen);
  overlay.querySelectorAll('[data-cart-close]').forEach(button=>button.addEventListener('click',cartClose));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden)cartClose();});
  $('#store-search').addEventListener('input',renderStore);
  $('#store-category').addEventListener('change',renderStore);
  const categories=[...new Set(catalog.map(p=>p.category))];
  for(const category of categories) {const option=make('option','',category);option.value=category;$('#store-category').append(option);}
  function feedback(message,isError=false){const box=$('#dashboard-feedback');box.textContent=message;box.dataset.kind=isError?'error':'success';}
  function checkoutStatus(message){$('#store-checkout-status').textContent=message;}

  async function authPut(payload) {
    const token=session?.access_token;
    if(!token) throw new Error('Inicia sesión nuevamente para modificar la cuenta.');
    const response=await fetch(`${config.supabaseUrl}/auth/v1/user`,{method:'PUT',headers:{'Content-Type':'application/json',apikey:config.supabaseAnonKey,Authorization:`Bearer ${token}`},body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.msg||data.message||data.error_description||'No se pudo actualizar la cuenta.');
    if(session.user) session.user={...session.user,...data};
    return data;
  }
  function dashboardTab(name) {
    document.querySelectorAll('[data-dash-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.dashTab===name));
    document.querySelectorAll('[data-dash-view]').forEach(el=>el.hidden=el.dataset.dashView!==name);
    if(name==='orders') loadOrders();
  }
  document.querySelectorAll('[data-dash-tab]').forEach(btn=>btn.addEventListener('click',()=>dashboardTab(btn.dataset.dashTab)));
  document.addEventListener('exepted:auth',event=>{
    session=event.detail.session||null;
    if(session){
      $('#dashboard-email').textContent=session.user?.email||'';
      $('#profile-update-form').elements.nickname.value=session.user?.user_metadata?.nickname||'';
      dashboardTab('summary');feedback('');
    } else {
      $('#orders-list').textContent='Inicia sesión para consultar tus pedidos.';
      feedback('');
    }
  });
  $('#profile-update-form')?.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget;const nick=form.elements.nickname.value.trim();
    if(nick.length<2) return feedback('Introduce un apodo de al menos dos caracteres.',true);
    const button=form.querySelector('button');button.disabled=true;
    try{await authPut({data:{nickname:nick}});$('#welcome').textContent=`Hola, ${nick}.`;feedback('Perfil actualizado.');document.dispatchEvent(new CustomEvent('exepted:profile-update',{detail:{nickname:nick}}));}
    catch(err){feedback(err.message,true);}finally{button.disabled=false;}
  });
  $('#password-update-form')?.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget;const password=form.elements.new_password.value;
    if(password!==form.elements.confirm_password.value) return feedback('Las contraseñas no coinciden.',true);
    if(password.length<12) return feedback('Tu contraseña debe tener mínimo 12 caracteres.',true);
    const button=form.querySelector('button');button.disabled=true;
    try{await authPut({password});form.reset();feedback('Contraseña actualizada.');}
    catch(err){feedback(err.message,true);}finally{button.disabled=false;}
  });
  async function loadOrders() {
    const list=$('#orders-list');list.textContent='Consultando pedidos…';
    if(!session?.access_token) return list.textContent='Inicia sesión para ver tus pedidos.';
    try{
      const response=await fetch(`${config.supabaseUrl}/rest/v1/shop_orders?select=id,status,total_cents,created_at&order=created_at.desc&limit=20`,{headers:{apikey:config.supabaseAnonKey,Authorization:`Bearer ${session.access_token}`}});
      if(!response.ok) throw new Error('Pedidos aún no configurados en Supabase o sesión expirada.');
      const data=await response.json();list.replaceChildren();
      if(!data.length){list.textContent='Aún no tienes pedidos registrados.';return;}
      for(const order of data){const item=make('article');item.append(make('h4','',`Pedido ${order.id.slice(0,8)} · ${pesos(order.total_cents)}`),make('small','',`${new Date(order.created_at).toLocaleDateString('es-MX')} · ${order.status}`));list.append(item);}
    } catch(err){list.textContent=err.message;}
  }
  $('#orders-refresh')?.addEventListener('click',loadOrders);
  $('#store-card-checkout')?.addEventListener('click', () => {
    if (!lines().length) return;
    const concept = $('#mp-quote-concept');
    const amount = $('#mp-quote-amount');
    if (concept && amount) {
      concept.value = 'Pedido de catálogo ExeptedTech — confirmar disponibilidad';
      amount.value = (sum() / 100).toFixed(2);
      amount.dispatchEvent(new Event('input', {bubbles: true}));
    }
    document.getElementById('xt-payment-chooser').hidden=false;
    document.getElementById('xt-payment-chooser').scrollIntoView({behavior:'smooth',block:'nearest'});
    const status=document.getElementById('mp-form-status');
    if(status) status.textContent='Importe preparado. Antes de pagar, confirma disponibilidad y autorización del pedido por WhatsApp. La compra solo se verificará en tu cuenta de Mercado Pago.';
  });
  document.addEventListener('exepted:add-to-cart', event => {
    const items=Array.isArray(event.detail?.skus)?event.detail.skus:[event.detail?.sku];
    let updated=false;
    for(const sku of items){const p=bySku.get(sku);if(p && !p.restricted && typeof p.priceCents === "number" && (cart[sku]||0)<10){cart[sku]=(cart[sku]||0)+1;updated=true;}}
    if(updated){persist();renderCart();document.dispatchEvent(new CustomEvent('exepted:cart-added'));} 
  });
  document.addEventListener('exepted:open-cart', cartOpen);
  document.addEventListener('exepted:close-cart',()=>{if(!overlay.hidden)cartClose();});
  document.addEventListener('exepted:orders',()=>{dashboardTab('orders');loadOrders();});
  document.addEventListener('exepted:recommend',()=>dashboardTab('recommend'));
  document.addEventListener('exepted:settings',()=>dashboardTab('settings'));
  document.addEventListener('exepted:catalog-view',renderStore);
  renderStore();renderCart();
})();
