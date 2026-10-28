/* ExeptedTech 2026 | mejoras accesibles, SEO y experiencia premium */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const body = document.body;

  // Pago manual por enlace externo: el formulario y las verificaciones se manejan en mercadopago.js.
  $('.mobile-pay-nav')?.addEventListener('click', () => {
    $('#nav')?.classList.remove('open');
    $('#menu')?.setAttribute('aria-expanded', 'false');
  });

  // --- Acceso modal: formulario REAL de Supabase, sin duplicar nodos/IDs ---
  const authOverlay = $('#auth-overlay');
  const authPanel = $('#auth-panel');
  const authSection = $('#cuenta');
  if (authOverlay && authSection) authSection.prepend(authOverlay); // conserva el widget CAPTCHA en su nodo original
  let lastAuthTrigger = null;
  const closePortal = () => {
    if (!authOverlay || authOverlay.hidden) return;
    authOverlay.hidden = true;
    body.classList.remove('auth-dialog-open');
    authPanel?.removeAttribute('role');
    authPanel?.removeAttribute('aria-modal');
    authPanel?.removeAttribute('aria-labelledby');
    $('.auth-modal-close', authPanel).hidden = true;
    lastAuthTrigger?.focus();
  };
  const openPortal = (mode = 'signup', trigger = null) => {
    if (!authOverlay || !authPanel) return;
    lastAuthTrigger = trigger;
    authOverlay.hidden = false;
    body.classList.add('auth-dialog-open');
    authPanel.setAttribute('role', 'dialog');
    authPanel.setAttribute('aria-modal', 'true');
    authPanel.setAttribute('aria-labelledby', 'auth-title');
    $('.auth-modal-close', authPanel).hidden = false;
    authPanel.scrollTop = 0;
    const tab = $(`.account-tabs [data-auth-mode="${mode}"]`);
    tab?.click();
    $('.auth-modal-close', authPanel)?.focus();
  };
  // Después de un inicio de sesión válido, cierra el modal para que Mi cuenta sea accesible.
  document.addEventListener('exepted:auth',event=>{
    if(event.detail?.session && authOverlay && !authOverlay.hidden){
      closePortal();
      queueMicrotask(()=>{
        const target=document.getElementById('xt-account-toggle');
        if(target && !target.closest('[hidden]'))target.focus({preventScroll:true});
      });
    }
  });
  $$('[data-open-auth-modal]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    openPortal(el.getAttribute('data-open-auth-modal') || 'signup', el);
  }));
  $$('[data-close-auth-modal]').forEach(el => el.addEventListener('click', closePortal));

  // --- Escape para cerrar modales ---
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      const activeDialog = authOverlay && !authOverlay.hidden ? authPanel : null;
      if (activeDialog) {
        const controls = $$('button:not([disabled]), input:not([disabled]), a[href]', activeDialog).filter(el => !el.hidden && el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (first && last) {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }
    if (e.key !== 'Escape') return;
    if (authOverlay && !authOverlay.hidden) closePortal();
  });
})();
