/* NOVA v7: on-device recommendations, no profiling servers, no marketing claims */
(()=>{'use strict';
 const $=s=>document.querySelector(s); const catalog=Array.isArray(window.EXEPTED_CATALOG)?window.EXEPTED_CATALOG:[];
 const make=(tag,cls,content)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(content!=null)e.textContent=String(content);return e;};
 const format=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'});const form=$('#nova-form');const results=$('#nova-results');
 const categories=[...new Set(catalog.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 if(!form||!results)return;
 for(const category of categories){const o=make('option','',category);o.value=category;form.elements.category.append(o);}
 const score=(p,objective)=>{const t=(p.name+' '+p.description+' '+p.category).toLowerCase();let val=0;
  if(objective==='project'&&/web|negocio|diseño|aplicac|ads|mantenimiento|desarrollo/.test(t))val+=5;
  if(objective==='entertainment'&&/juego|gaming|stream|membres|película|música|xbox|playstation/.test(t))val+=5;
  if(objective==='budget'&&typeof p.priceCents==='number')val+=3;
  if(!p.restricted)val+=2;
  return val;
 };
 form.addEventListener('submit',event=>{event.preventDefault();const category=form.elements.category.value;const objective=form.elements.objective.value;
  const budgetValue=form.elements.budget.value.trim();const budget=budgetValue!==''?Number(budgetValue):null;
  if(budget!==null&&(!Number.isFinite(budget)||budget<0||budget>1000000)){form.elements.budget.focus();return;}
  const picks=catalog.filter(p=>Number.isSafeInteger(p.priceCents)&&p.priceCents>0 &&(category==='all'||p.category===category)&& (budget===null||p.priceCents<=budget*100));
  picks.sort((a,b)=>score(b,objective)-score(a,objective)||a.priceCents-b.priceCents);
  results.replaceChildren();results.hidden=false;
  if(!picks.length){results.append(make('p','nova-empty','No encontramos productos con esos filtros. Amplía tu presupuesto o consulta por WhatsApp.'));return;}
  picks.slice(0,3).forEach(p=>{const card=make('article','nova-result');card.append(make('small','',p.category),make('strong','',p.name),make('p','',p.description));
   card.append(make('b','',format.format(p.priceCents/100)));const link=make('a','',p.restricted?'Consultar disponibilidad ↗':'Ver producto en tienda ↗');
   if(p.restricted){link.href='https://wa.me/525566147938?text='+encodeURIComponent('Hola ExeptedTech, deseo consultar condiciones de '+p.name);link.target='_blank';link.rel='noopener noreferrer';}
   else{link.href='#tienda';link.addEventListener('click',()=>{const s=$('#store-search');if(s){s.value=p.name;s.dispatchEvent(new Event('input',{bubbles:true}));}});}
   card.append(link);results.append(card);});
  results.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
 });
 $('#nova-mobile-cart')?.addEventListener('click',()=>document.dispatchEvent(new Event('exepted:open-cart')));
 $('#nova-transfer-details')?.addEventListener('click',e=>{e.preventDefault();document.dispatchEvent(new Event('exepted:close-cart'));$('#xt-donation-bank-options')?.scrollIntoView({behavior:'smooth'});});
 // Account recommendations are anonymous, local and removable: existing component handles storage.
})();
