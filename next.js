/* ExeptedTech · mejoras accesibles y progresivas. No recibe datos de tarjeta. */
(()=>{'use strict';
 const $=s=>document.querySelector(s);
 const catalog=Array.isArray(window.EXEPTED_CATALOG)?window.EXEPTED_CATALOG:[];
 const input=$('#mp-quote-concept'), output=$('#xt-quote-suggestions'), amount=$('#mp-quote-amount');
 const normalize=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
 const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);
 if(input&&output){
  const close=()=>{output.hidden=true;input.setAttribute('aria-expanded','false');};
  const selectProduct=p=>{input.value=p.name;const price=Number(p.priceCents);if(amount){amount.value=Number.isFinite(price)&&price>0&&!p.restricted?(price/100).toFixed(2):'';amount.dispatchEvent(new Event('input',{bubbles:true}));}if(p.restricted){const status=$('#mp-form-status');if(status)status.textContent='Producto sujeto a licencia y disponibilidad: pide autorización y monto final a ExeptedTech antes de pagar.';}
    input.dispatchEvent(new Event('input',{bubbles:false}));close();input.focus();};
  function render(){
   const q=normalize(input.value);output.replaceChildren();if(q.length<1){close();return;}
   const words=q.split(/\s+/).filter(Boolean);
   const results=catalog.map((p,i)=>{
    const name=normalize(p.name), cat=normalize(p.category), descr=normalize(p.description),sku=normalize(p.sku);
    const joined=[name,cat,descr,sku].join(' ');
    if(!words.every(word=>joined.includes(word)))return null;
    const score=(name.startsWith(q)?100:0)+(name.includes(q)?60:0)+(cat.startsWith(q)?20:0)+(sku.startsWith(q)?15:0)+(1000-i)/1000;
    return{p,score};
   }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,7);
   if(!results.length){close();return;}
   for(let i=0;i<results.length;i++){
    const p=results[i].p;const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.id='xt-quote-item-'+i;b.className='xt-quote-option';
    const name=document.createElement('span');name.textContent=p.name;
    const val=document.createElement('strong');const price=Number(p.priceCents);
    val.textContent=Number.isFinite(price)&&price>0&&!p.restricted?money(price/100):'Solicitar cotización';
    b.append(name,val);b.addEventListener('click',()=>selectProduct(p));
    b.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();close();input.focus();}
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const buttons=[...output.querySelectorAll('button')];const target=buttons[(i+(e.key==='ArrowDown'?1:buttons.length-1))%buttons.length];target?.focus();}
    });output.append(b);
   }
   output.hidden=false;input.setAttribute('aria-expanded','true');
  }
  input.addEventListener('input',render);
  input.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='ArrowDown'&&!output.hidden){e.preventDefault();output.querySelector('button')?.focus();}});
  document.addEventListener('click',e=>{if(!output.contains(e.target)&&e.target!==input)close();});
 }
 async function copyText(value){
   if(navigator.clipboard?.writeText && window.isSecureContext)try {await navigator.clipboard.writeText(value);return;}catch{}
   // iOS Safari y navegadores que bloquean Clipboard API: selección local y execCommand.
   const field=document.createElement('textarea');field.value=value;field.readOnly=true;field.setAttribute('aria-hidden','true');
   field.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
   document.body.append(field);field.focus();field.select();field.setSelectionRange(0,value.length);
   let copied=false;try{copied=document.execCommand('copy');}finally{field.remove();}
   if(!copied)throw new Error('No fue posible copiar automáticamente');
 }
 for(const b of document.querySelectorAll('.xt-copy-specific')){
  b.addEventListener('click',async()=>{
    const card=b.closest('.xt-bank-option,.xt-transfer-content')||document;
    const feedback=card.querySelector('.xt-bank-feedback')||$('#xt-copy-status');
    const label=b.dataset.copyLabel||'dato';
    const original=b.textContent;const value=b.dataset.copyValue||'';
    if(!value)return;
    b.disabled=true;
    try{await copyText(value);b.textContent='✓ '+(label==='CLABE'?'CLABE copiada':'Titular copiado');if(feedback)feedback.textContent=`${label==='CLABE'?'CLABE':'Nombre del titular'} copiado. Verifica los datos en tu banco antes de transferir.`;}
    catch{if(feedback)feedback.textContent=`Tu navegador impidió copiar ${label}. Mantén pulsado el dato mostrado para seleccionarlo.`;b.textContent='Copia manualmente';}
    finally{window.setTimeout(()=>{b.textContent=original;b.disabled=false;},1800);}
  });
 }
})();
