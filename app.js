/* ExeptedTech v6 - navegación única y scroll ligero. */
const PHONE='525566147938';
function bindWhatsApp(){document.querySelectorAll('a.wa').forEach(a=>{const name=a.dataset.product||'información de servicios';a.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hola ExeptedTech, me interesa ${name}. ¿Me pueden ayudar?`)}`;a.target='_blank';a.rel='noopener noreferrer';});}
bindWhatsApp();
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');observer.unobserve(e.target)}}),{threshold:.05});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
document.querySelector('#year').textContent=new Date().getFullYear();

/* Bank-data copy is handled with validated, labeled controls in next.js. */
// Un solo trabajo visual por fotograma en lugar de dos listeners por scroll.
const pageHeader=document.querySelector('#header');
const readingProgress=document.querySelector('.reading-progress');
let scrollTick=false;
function syncViewport(){
  scrollTick=false;
  const top=window.scrollY;
  pageHeader?.classList.toggle('scrolled',top>24);
  if(readingProgress){
    const total=document.documentElement.scrollHeight-window.innerHeight;
    readingProgress.style.transform='scaleX('+(total>0?Math.min(1,top/total):0)+')';
  }
}
function queueViewport(){if(!scrollTick){scrollTick=true;requestAnimationFrame(syncViewport);}}
addEventListener('scroll',queueViewport,{passive:true});
addEventListener('resize',queueViewport,{passive:true});
queueViewport();

