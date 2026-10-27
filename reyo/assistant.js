/* Reyo Assistant 3.0 — widget sin dependencias, seguro ante HTML en respuestas. */
(() => {
  'use strict';
  if (document.getElementById('reyo-assistant-root')) return;
  const opts = window.ReyoAssistantConfig || {};
  const getParams = new URLSearchParams(location.search);
  const app = ['web', 'retrolib', 'pulso', 'center'].includes(opts.appId || getParams.get('app')) ? (opts.appId || getParams.get('app')) : 'web';
  const apiBase = String(opts.apiBaseUrl || '').replace(/\/$/, '');
  const root = document.createElement('div');
  root.id = 'reyo-assistant-root';
  // This HTML is a developer-owned constant; AI / user text never gets assigned to innerHTML.
  root.innerHTML = `
  <section id="reyo-panel" class="reyo-panel" role="dialog" aria-label="Chat de Reyo Assistant" aria-modal="false" hidden>
    <header class="reyo-head">
      <div class="reyo-mark" aria-hidden="true"><img src="assets/reyo-assistant-icon.webp" width="46" height="46" alt=""></div>
      <div class="reyo-head-copy"><div class="reyo-title">Reyo Assistant <span class="reyo-head-tag">FREE</span></div><div class="reyo-subtitle"><i></i> Tecnología y aprendizaje · Luvia Company</div></div>
      <button type="button" id="reyo-reset" class="reyo-icon-button" aria-label="Nueva conversación" title="Nueva conversación">↻</button>
      <button type="button" id="reyo-close" class="reyo-icon-button" aria-label="Cerrar chat" title="Cerrar">×</button>
    </header>
    <div class="reyo-toolbar"><span class="reyo-toolbar-label">MODO</span>
      <label class="reyo-field-label" for="reyo-mode">Tipo de ayuda</label>
      <select id="reyo-mode" class="reyo-select" aria-label="Modo de ayuda"><option value="tutor">Tutor</option><option value="asesor">Asesor</option><option value="proyecto">Proyecto</option></select>
      <label class="reyo-field-label" for="reyo-level">Nivel</label>
      <select id="reyo-level" class="reyo-select" aria-label="Nivel de conocimiento"><option value="principiante">Inicial</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select>
      <span class="reyo-plan">REYO FREE</span>
    </div>
    <div id="reyo-usage" class="reyo-usage" aria-live="polite"><span>Plan Reyo Free</span><strong id="reyo-remaining">Uso responsable</strong></div>
    <div id="reyo-messages" class="reyo-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Mensajes de la conversación"></div>
    <footer class="reyo-foot">
      <form id="reyo-form" class="reyo-form"><label class="reyo-field-label" for="reyo-input">Tu pregunta</label><textarea id="reyo-input" class="reyo-input" aria-label="Escribe tu pregunta" placeholder="Pregúntame algo sobre tecnología..." rows="1" maxlength="1000" required></textarea><button id="reyo-send" class="reyo-send" type="submit" aria-label="Enviar mensaje">➤</button></form>
      <div class="reyo-bottom"><button class="reyo-report" id="reyo-report" type="button">Reportar respuesta</button><span>Puede equivocarse · No envíes datos privados</span></div>
    </footer>
  </section>
  <button id="reyo-open" type="button" class="reyo-launcher" title="Hablar con Reyo Assistant" aria-label="Abrir Reyo Assistant" aria-expanded="false"><img src="assets/reyo-assistant-icon.webp" alt="" width="64" height="64" loading="eager"><span class="reyo-launcher-glow"></span></button>`;
  document.body.append(root);
  // iOS Safari / Android: keep the chat above the on-screen keyboard.
  // visualViewport events are coalesced to avoid heavy layout work while typing.
  if (window.visualViewport) {
    let queued = false;
    const updateViewport = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        root.style.setProperty('--reyo-visual-height', Math.round(window.visualViewport.height) + 'px');
      });
    };
    window.visualViewport.addEventListener('resize', updateViewport, {passive:true});
    updateViewport();
  }
  // Always load branded images from the hosting website, not from the AI API server.
  const assetBase = new URL('assets/reyo-assistant-icon.webp', location.href).href;
  root.querySelectorAll('img[src="assets/reyo-assistant-icon.webp"]').forEach(img => {img.src = assetBase; img.decoding = 'async';});
  const el = id => root.querySelector('#' + id);
  const panel = el('reyo-panel'), opener = el('reyo-open'), messages = el('reyo-messages');
  const form = el('reyo-form'), input = el('reyo-input'), send = el('reyo-send');
  const mode = el('reyo-mode'), level = el('reyo-level');
  let history = [], busy = false, lastReply = '', abortRequest = null, currentRequestId=0, session=null;
  const sessionKey='reyo3_session';
  async function getSession(force=false) {
    if(!force && session) return session;
    if(!force) { try {session=localStorage.getItem(sessionKey);}catch{} }
    if(session && !force)return session;
    const r=await fetch(apiBase+'/api/session');if(!r.ok)throw Error('No pude iniciar tu sesión de Reyo.');
    const data=await r.json();session=data.session;try{localStorage.setItem(sessionKey,session);}catch{}
    return session;
  }
  function showUsage(s){const el=root.querySelector('#reyo-remaining');if(el && Number.isFinite(Number(s)))el.textContent='Consultas restantes hoy: '+s;}
  function formatWait(n){const sec=Math.max(1,Math.ceil(Number(n)||3600));if(sec>=86400)return Math.ceil(sec/86400)+' día(s)';if(sec>=3600)return Math.ceil(sec/3600)+' hora(s)';return Math.ceil(sec/60)+' minuto(s)';}
  const friendlyErrors = {429:'Reyo está atendiendo muchas consultas o llegó al límite de uso. Inténtalo más tarde.',503:'Reyo todavía no tiene configurado el servicio de IA.',502:'No pudimos consultar al motor de IA. Inténtalo de nuevo.'};
  const safeDomains = new Set(['exeptedtech.xyz','www.exeptedtech.xyz','play.google.com','developer.android.com','developer.mozilla.org','developers.google.com','skillshop.withgoogle.com','docs.github.com','developers.openai.com']);
  function validUrl(s) {try {const u = new URL(s);return u.protocol === 'https:' && safeDomains.has(u.hostname) ? u.href : null;}catch{return null;}}
  function renderInline(container, s) {
    // Small whitelist: **bold**, `code`, http(s) links. All text is constructed as DOM text nodes.
    const source = String(s || '');
    const pattern = /(\*\*[^*\n]+\*\*|`[^`\n]+`|https:\/\/[^\s<>"']+)/g;
    let pos = 0;
    for (const match of source.matchAll(pattern)) {
      const raw = match[0]; container.append(document.createTextNode(source.slice(pos, match.index)));
      if (raw.startsWith('**') && raw.endsWith('**')) {const b = document.createElement('strong');b.textContent = raw.slice(2,-2);container.append(b);}
      else if (raw.startsWith('`') && raw.endsWith('`')) {const code = document.createElement('code');code.textContent = raw.slice(1,-1);container.append(code);}
      else {
        const trimmed = raw.replace(/[.,;!?)}\]]+$/, ''), tail = raw.slice(trimmed.length);
        const href = validUrl(trimmed);
        if (href) {const a = document.createElement('a');a.href = href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=trimmed;container.append(a);} else container.append(document.createTextNode(trimmed));
        container.append(document.createTextNode(tail));
      }
      pos = match.index + raw.length;
    }
    container.append(document.createTextNode(source.slice(pos)));
  }
  function displayMessage(target, text) {
    target.replaceChildren();
    const paragraphs = String(text || '').split(/\n/);
    const group = document.createElement('div');group.className='reyo-rendered';
    for (const line of paragraphs) {
      const p = document.createElement('p');p.className='reyo-line';
      const listMatch = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/);
      if (listMatch) {p.classList.add('reyo-line-list');const marker = document.createElement('span');marker.className='reyo-list-marker';marker.textContent='•';p.append(marker);renderInline(p,listMatch[1]);}
      else renderInline(p,line);
      group.append(p);
    }
    target.append(group);
  }
  function addMessage(text, who='bot') {
    const item=document.createElement('article');item.className='reyo-message reyo-message--'+who;
    const content=document.createElement('div');content.className='reyo-message-body';displayMessage(content,text);item.append(content);
    if (who==='bot') {const actions=document.createElement('div');actions.className='reyo-message-tools';
      const copy=document.createElement('button');copy.type='button';copy.textContent='Copiar';copy.setAttribute('aria-label','Copiar respuesta');copy.addEventListener('click',()=>{if(navigator.clipboard?.writeText) navigator.clipboard.writeText(content.textContent).then(()=>{copy.textContent='Copiado';}).catch(()=>{copy.textContent='No disponible';});});actions.append(copy);
      if ('speechSynthesis' in window) {const speak=document.createElement('button');speak.type='button';speak.textContent='Escuchar';speak.addEventListener('click',()=>{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(content.textContent);utterance.lang='es-MX';utterance.rate=1;window.speechSynthesis.speak(utterance);});actions.append(speak);}
      item.append(actions);
    }
    messages.append(item);messages.scrollTop=messages.scrollHeight;
    return {item,content};
  }
  function chip(text){const b=document.createElement('button');b.type='button';b.className='reyo-chip';b.textContent=text;b.addEventListener('click',()=>ask(text,mode.value));return b;}
  function reset(){
    currentRequestId++;if (abortRequest) abortRequest.abort();abortRequest=null;busy=false;send.disabled=false;input.disabled=false;
    history=[];lastReply='';messages.replaceChildren();
    const welcome=app==='pulso'?'Soy Reyo, tu asistente de soporte técnico. Te ayudo con el uso de esta app, sin acceder a tus datos personales.':app==='retrolib'?'Soy Reyo, tu guía de RetroLib y tecnología. ¿Qué quieres configurar hoy?':'¡Hola! Soy **Reyo Assistant**, tu mentor tecnológico de ExeptedTech. Podemos aprender, resolver un error o construir un proyecto paso a paso. ¿Qué te gustaría hacer?';
    addMessage(welcome);
    const chips=document.createElement('div');chips.className='reyo-chips';
    ['Enséñame HTML desde cero','Quiero hacer una app Android','¿Quién te creó?'].forEach(q=>chips.append(chip(q)));
    messages.append(chips);
  }
  function toggle(open){
    const show = open === undefined ? panel.hidden : Boolean(open);
    panel.hidden=!show;opener.setAttribute('aria-expanded',String(show));opener.hidden=show;
    document.body.classList.toggle('reyo-chat-open',show);
    if (show) {panel.setAttribute('aria-modal','true');input.focus({preventScroll:true});}
    else {panel.setAttribute('aria-modal','false');opener.focus({preventScroll:true});}
  }
  async function ask(question, suggestedMode){
    if (busy || !question || !String(question).trim()) return;
    if (suggestedMode && ['asesor','tutor','proyecto'].includes(suggestedMode)) mode.value=suggestedMode;
    const message=String(question).trim().slice(0,1000);const requestId=++currentRequestId;busy=true;send.disabled=true;input.disabled=true;input.value='';root.querySelector('.reyo-chips')?.remove();
    addMessage(message,'user');const replyEl=addMessage('Reyo está pensando…','bot');replyEl.item.classList.add('reyo-message--waiting');
    const controller=new AbortController();abortRequest=controller;
    const timer=setTimeout(()=>controller.abort(),65000);
    try{
      const token=await getSession();
      let response=await fetch(apiBase+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Reyo-Session':token},body:JSON.stringify({message,history,app,mode:mode.value,level:level.value}),signal:controller.signal});
      let data;try{data=await response.json();}catch{throw new Error('El servidor no devolvió una respuesta válida.');}
      if(response.status===401&&data?.code==='SESSION_INVALID'){
        const renewed=await getSession(true);
        response=await fetch(apiBase+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Reyo-Session':renewed},body:JSON.stringify({message,history,app,mode:mode.value,level:level.value}),signal:controller.signal});
        data=await response.json();
      }
      if(requestId!==currentRequestId)return;
      if(!response.ok){const suffix=data?.retry_after_seconds?' Intenta de nuevo en '+formatWait(data.retry_after_seconds)+'.':'';throw new Error((data?.error||friendlyErrors[response.status]||'No se pudo completar la consulta.')+suffix);}
      showUsage(data?.remaining_today);
      replyEl.item.classList.remove('reyo-message--waiting');displayMessage(replyEl.content,data.reply||'No se obtuvo contenido.');lastReply=String(data.reply||'');
      history.push({role:'user',content:message},{role:'assistant',content:lastReply});history=history.slice(-8);
    }catch(e){if(requestId!==currentRequestId)return;replyEl.item.classList.remove('reyo-message--waiting');replyEl.item.classList.add('reyo-message--error');displayMessage(replyEl.content,e.name==='AbortError'?'La consulta tardó demasiado. Intenta otra vez.':e.message||'Error al conectar con Reyo.');}
    finally{clearTimeout(timer);if(requestId===currentRequestId){if(abortRequest===controller)abortRequest=null;busy=false;send.disabled=false;input.disabled=false;if(!panel.hidden)input.focus();}}
  }
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
  opener.addEventListener('click',()=>toggle(true));el('reyo-close').addEventListener('click',()=>toggle(false));el('reyo-reset').addEventListener('click',reset);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false);});
  el('reyo-report').addEventListener('click',async()=>{
    if(!lastReply){alert('Primero recibe una respuesta para reportarla.');return;}
    if(!confirm('¿Reportar la última respuesta de Reyo?'))return;
    try{const r=await fetch(apiBase+'/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({app,reply:lastReply})});if(!r.ok)throw Error();alert('Reporte recibido en la versión de prueba. El registro persistente está pendiente.');}catch{alert('No se pudo registrar el reporte. Inténtalo después.');}
  });
  fetch(apiBase+'/api/meta').then(r=>r.ok?r.json():null).then(d=>{if(d?.plans?.free?.limits?.questions_day)root.querySelector('#reyo-remaining').textContent='Hasta '+d.plans.free.limits.questions_day+' consultas de IA/día';}).catch(()=>{});
  reset();window.ReyoAssistant={open:()=>toggle(true),close:()=>toggle(false),reset,ask};
  document.addEventListener('click', (event)=>{
    const opener = event.target.closest('[data-reyo-open]');
    if (!opener) return;
    event.preventDefault();toggle(true);
  });
  if(opts.openOnLoad)toggle(true);
})();
