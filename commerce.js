/* Módulo comercial opcional, activar SOLO después de publicar Edge Functions y aprobar productos. */
(() => {
 'use strict';
 const cfg=window.EXEPTED_CONFIG||{};
 if (!cfg.commerceEnabled || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
 // Evitar que el cliente crea que un pago manual quedará verificado por webhook.

 // Los pagos manuales de cotizaciones/transferencias permanecen en sección aparte
 // y NO actualizan el historial ni envían correos automáticos.
 const legacyWarning=document.querySelector('#store-cart-overlay .store-cart-foot > p');
 if(legacyWarning)legacyWarning.textContent='El pago seguro se genera con el importe verificado por nuestro servidor. Solo se pueden cobrar automáticamente servicios autorizados. Otros servicios se cotizan por WhatsApp.';
 const legacyStatus=document.querySelector('#store-checkout-status');
 if(legacyStatus)legacyStatus.textContent='Para comprar en línea, inicia sesión y usa el botón de pago seguro. Para otros productos solicita cotización.';
 const q=sel=>document.querySelector(sel);
 const text=(tag,value,cls='')=>{const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=String(value);return e;};
 const format = n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n/100);
 const sess=()=>window.EXEPTED_AUTH?.getSession?.()||null;
 const api=async (path,{method='GET',body=null}={})=>{
   const session=sess();if(!session?.access_token)throw Error('Inicia sesión en Exepted ID para continuar.');
   const r=await fetch(`${cfg.supabaseUrl}${path}`,{method,headers:{'apikey':cfg.supabaseAnonKey,'Authorization':`Bearer ${session.access_token}`,...(body?{'Content-Type':'application/json','Prefer':'return=representation'}:{})},body:body?JSON.stringify(body):null});
   const out=await r.json().catch(()=>({}));if(!r.ok)throw Error(out.error||out.message||'No se completó la operación.');return out;
 };
 const status=text('p','Los importes definitivos los valida nuestro servidor.','commerce-note');status.setAttribute('role','status');
 const foot=q('#store-cart-overlay .store-cart-foot');
 if (foot){
   const btn=text('button','Pagar pedido seguro con Mercado Pago','commerce-primary');btn.type='button';btn.id='commerce-pay';
   foot.append(btn,status);
   btn.addEventListener('click',async()=>{
     const account=sess();if(!account?.access_token){status.textContent='Para comprar, inicia sesión en Exepted ID y verifica tu correo.';return;}
     let items=[];
     try{const obj=JSON.parse(localStorage.getItem('exeptedtech-cart-v1')||'{}');items=Object.entries(obj).map(([sku,qty])=>({sku,qty}));}catch{}
     if(!items.length){status.textContent='Agrega primero algún producto al carrito.';return;}
     btn.disabled=true;status.textContent='Validando disponibilidad y preparando el pedido…';
     try{
       // Antes de crear un pedido verificamos qué referencias están autorizadas.
       // La validación definitiva de cantidades y precios ocurre dentro del servidor.
       const approved=await api('/rest/v1/commerce_products?select=sku,name,price_cents&enabled=eq.true&stock_enabled=eq.true');
       const allowed=new Set(approved.map(p=>p.sku));
       const unauthorized=items.filter(i=>!allowed.has(i.sku));
       if(unauthorized.length){
         throw Error('Tu carrito contiene '+unauthorized.length+' producto(s) sin pago automático autorizado. Quítalos del carrito o solicita disponibilidad por WhatsApp.');
       }
       const result=await api('/functions/v1/create-checkout',{method:'POST',body:{items}});
       let paymentUrl; try {paymentUrl=new URL(result.checkout_url)} catch {throw Error('Enlace de pago inválido.')}
       const host=paymentUrl.hostname.toLowerCase();
       if(paymentUrl.protocol!=='https:' || !(host==='mercadopago.com.mx'||host==='www.mercadopago.com.mx'||host==='mercadopago.com'||host==='www.mercadopago.com'||host.endsWith('.mercadopago.com.mx')||host.endsWith('.mercadopago.com'))) throw Error('Enlace de cobro no pertenece a Mercado Pago.');
       status.textContent=`Pedido ${result.order_id.slice(0,8)} creado. Total verificado: ${format(result.total_cents)}. Abriendo Mercado Pago…`;
       window.location.assign(paymentUrl.href); // El WebView abre Mercado Pago en navegador externo.
     }catch(err){status.textContent=err.message||'No se pudo iniciar el cobro. No se ha efectuado ningún pago.';}
     finally{btn.disabled=false;}
   });
 }
 const returnedId=new URLSearchParams(location.search).get('pedido');
 if(returnedId && /^[0-9a-f-]{36}$/i.test(returnedId)){
   const notice=text('div','Regresaste del proveedor de pagos. La compra se confirma en el servidor, no por esta pantalla. Inicia sesión y consulta tu pedido #'+returnedId.slice(0,8)+'.','commerce-note');
   const after=document.querySelector('#tienda .section-head')||document.querySelector('#tienda');
   if(after)after.after(notice);
 }
 const dashboard=q('[data-dash-view="orders"]');if(!dashboard)return;
 const panel=text('section','','commerce-panel');
 panel.append(text('h4','Centro de seguimiento comercial'),text('p','Consulta el avance de cada servicio y abre un ticket si necesitas ayuda.'));
 const refresh=text('button','Actualizar seguimiento','commerce-action');refresh.type='button';
 const list=text('div','');list.id='commerce-orders';
 const ticketTitle=text('h4','Nuevo ticket de soporte');
 const subject=document.createElement('input');subject.placeholder='Asunto del ticket';subject.maxLength=120;subject.minLength=5;subject.required=true;
 const body=document.createElement('textarea');body.placeholder='Explica tu situación (no incluyas contraseñas ni códigos).';body.maxLength=4000;body.required=true;
 const send=text('button','Enviar solicitud de soporte','commerce-action');send.type='button';
 const ticketStatus=text('p','','commerce-note');ticketStatus.setAttribute('role','status');
 const ticketsTitle=text('h4','Mis tickets');const tickets=text('div','');
 panel.append(refresh,list,ticketTitle,subject,body,send,ticketStatus,ticketsTitle,tickets);
 dashboard.append(panel);
 const statuses={pending:'Pendiente de pago',paid:'Pago confirmado',rejected:'Pago rechazado',cancelled:'Cancelado',refunded:'Reembolsado',chargeback:'Contracargo',under_review:'Revisión necesaria'};
 const delivery={not_started:'Pendiente',queued:'En cola',in_progress:'En proceso',delivered:'Entregado',issue:'Requiere atención'};
 async function load(){
   list.textContent='Cargando pedidos…';tickets.textContent='Cargando tickets…';
   if(!sess()){list.textContent='Accede a tu cuenta para consultar pedidos.';tickets.textContent='Accede a tu cuenta.';return;}
   try{
     const orders=await api('/rest/v1/commerce_orders?select=id,total_cents,status,delivery_status,created_at&order=created_at.desc&limit=30');
     list.replaceChildren();
     for(const order of orders){const row=text('article','','commerce-entry');
       row.append(text('strong',`#${order.id.slice(0,8)} · ${format(order.total_cents)}`),text('p',`Pago: ${statuses[order.status]||order.status} · Entrega: ${delivery[order.delivery_status]||order.delivery_status}`),text('small',new Date(order.created_at).toLocaleDateString('es-MX')));
       const more=text('button','Ver historial','commerce-link');more.type='button';
       more.addEventListener('click',async()=>{more.disabled=true;try{const updates=await api(`/rest/v1/commerce_order_updates?select=status,note,created_at&order_id=eq.${order.id}&order=created_at.asc`);const detail=text('div','','commerce-history');for(const u of updates)detail.append(text('p',`${new Date(u.created_at).toLocaleDateString('es-MX')}: ${statuses[u.status]||u.status}${u.note?' — '+u.note:''}`));row.append(detail);}catch(e){row.append(text('p',e.message));}more.remove();});
       row.append(more);list.append(row);
     }
     if(!orders.length)list.append(text('p','No tienes compras registradas en el nuevo sistema.'));
     const myTickets=await api('/rest/v1/commerce_tickets?select=id,subject,status,created_at&order=created_at.desc&limit=30');
     tickets.replaceChildren();
     for(const t of myTickets){const item=text('article','','commerce-entry');item.append(text('strong',t.subject),text('p',`Estado: ${t.status} · #${t.id.slice(0,8)}`));
       const open=text('button','Ver conversación','commerce-link');open.type='button';open.addEventListener('click',async()=>{
         open.disabled=true;try{const messages=await api(`/rest/v1/commerce_ticket_messages?select=sender,body,created_at&ticket_id=eq.${t.id}&order=created_at.asc`);
           const conversation=text('div','','commerce-history');for(const m of messages)conversation.append(text('p',`${m.sender==='support'?'Soporte':'Tú'}: ${m.body}`));
           const reply=document.createElement('textarea');reply.placeholder='Escribe tu respuesta';reply.maxLength=4000;
           const replyBtn=text('button','Responder','commerce-action');replyBtn.type='button';replyBtn.disabled= t.status==='closed'||t.status==='resolved';
           replyBtn.addEventListener('click',async()=>{if(!reply.value.trim())return;replyBtn.disabled=true;try{await api('/rest/v1/commerce_ticket_messages',{method:'POST',body:{ticket_id:t.id,sender:'customer',body:reply.value.trim()}});reply.value='';open.remove();conversation.remove();const msg=text('p','Respuesta enviada. Actualiza seguimiento para verla.');item.append(msg);}catch(e){item.append(text('p',e.message));}finally{replyBtn.disabled=false;}});
           item.append(conversation,reply,replyBtn);open.remove();
         }catch(e){item.append(text('p',e.message));open.disabled=false;}});
       item.append(open);tickets.append(item);
     }
     if(!myTickets.length)tickets.append(text('p','Todavía no tienes tickets.'));
   }catch(err){list.textContent=err.message||'No fue posible cargar los pedidos.';tickets.textContent='Intenta actualizar el seguimiento.';}
 }
 refresh.addEventListener('click',load);
 send.addEventListener('click',async()=>{
   if(subject.value.trim().length<5||!body.value.trim())return ticketStatus.textContent='Escribe un asunto (5 caracteres mínimo) y tu mensaje.';
   send.disabled=true;
   try{const created=await api('/rest/v1/commerce_tickets?select=id',{method:'POST',body:{user_id:sess().user.id,subject:subject.value.trim(),status:'open'}});
     // POST sin Prefer: return=representation puede devolver [] en versiones de PostgREST; solicitamos lectura posterior.
     let ticketId=Array.isArray(created)&&created[0]?.id;
     if(!ticketId){const found=await api('/rest/v1/commerce_tickets?select=id&order=created_at.desc&limit=1');ticketId=found[0]?.id;}
     if(!ticketId)throw Error('Se creó el ticket pero no fue posible cargar su identificador. Revisa Mis tickets.');
     await api('/rest/v1/commerce_ticket_messages',{method:'POST',body:{ticket_id:ticketId,sender:'customer',body:body.value.trim()}});
     ticketStatus.textContent='Ticket registrado correctamente.';subject.value='';body.value='';await load();
   }catch(e){ticketStatus.textContent=e.message||'No se pudo registrar tu solicitud.';}finally{send.disabled=false;}
 });
 document.addEventListener('exepted:auth',()=>{if(q('[data-dash-view="orders"]')&&!q('[data-dash-view="orders"]').hidden)load();});
 document.addEventListener('exepted:orders',()=>setTimeout(load,0));
 q('#orders-refresh')?.addEventListener('click',load);
})();
