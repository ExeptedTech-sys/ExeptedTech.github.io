/* One navigation controller, bounded scroll work, viewport-aware motion. */
(() => {
  'use strict';
  const header=document.querySelector('#header');
  const menu=document.querySelector('#menu');
  const nav=document.querySelector('#nav');
  const scrim=document.createElement('button');
  scrim.type='button';scrim.className='menu-scrim';scrim.hidden=true;
  scrim.setAttribute('aria-label','Cerrar menú de navegación');scrim.tabIndex=-1;
  document.body.append(scrim);
  const small=window.matchMedia('(max-width: 1150px)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function setMenu(open,restoreFocus=false){
    nav.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    scrim.hidden=!open;
    if(restoreFocus)menu.focus();
  }
  menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  scrim.addEventListener('click',()=>setMenu(false,true));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav.classList.contains('open'))setMenu(false,true);
  });
  document.addEventListener('focusin',event=>{
    if(nav.classList.contains('open')&&!header.contains(event.target))setMenu(false);
  });
  function resized(){if(!small.matches)setMenu(false);}
  if(small.addEventListener)small.addEventListener('change',resized);else small.addListener(resized);
  const progress=document.querySelector('.reading-progress');
  let queued=false;
  function updateScroll(){
    const y=window.scrollY||0;
    const total=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=`${total>0?Math.min(100,Math.max(0,y/total*100)):0}%`;
    header.classList.toggle('scrolled',y>24);queued=false;
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll);}},{passive:true});
  window.addEventListener('resize',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll);}},{passive:true});
  updateScroll();
  if('IntersectionObserver' in window){
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      if(!reduced.matches)entry.target.classList.add('motion-ready');
      reveal.unobserve(entry.target);
    }),{threshold:.08});
    document.querySelectorAll('.reveal,.music-studio,.song-brief,.bank-panel').forEach(el=>reveal.observe(el));
    const motion=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-sleep',!entry.isIntersecting)),{rootMargin:'60px'});
    document.querySelectorAll('.brand-stage,.music-art,.retro-art,.ticker').forEach(el=>{el.classList.add('motion-sleep');motion.observe(el);});
  }
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-inactive',document.hidden));
})();
