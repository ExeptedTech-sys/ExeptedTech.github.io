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
  $$('[data-open-auth-modal]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    openPortal(el.getAttribute('data-open-auth-modal') || 'signup', el);
  }));
  $$('[data-close-auth-modal]').forEach(el => el.addEventListener('click', closePortal));

  // --- RetroLib gate con contraseña ---
  const RETRO_PASSWORD = 'ExeptedLuvia';
  const RETRO_LINK = 'https://drive.google.com/drive/folders/1XLfV8OJsD5VQ97hmtADUnoPaIWk8A0pC?usp=drive_link';
  const gate = $('#retrolib-gate');
  const gateForm = $('#retrolib-form');
  const gateInput = $('#retrolib-password');
  const gateStatus = $('#retrolib-status');
  const gateSuccess = $('#retrolib-success');
  const gateOpen = () => {
    if (!gate) return;
    gate.hidden = false;
    gate.setAttribute('aria-hidden', 'false');
    gateForm.hidden = false;
    gateSuccess.hidden = true;
    gateForm.reset();
    gateStatus.textContent = 'Pista: la contraseña distingue mayúsculas y minúsculas.';
    gateStatus.className = 'retro-gate__status';
    body.classList.add('modal-open');
    setTimeout(() => gateInput?.focus(), 50);
  };
  const gateClose = () => {
    if (!gate) return;
    gate.hidden = true;
    gate.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  };
  $('.download-link')?.addEventListener('click', e => {
    e.preventDefault();
    gateOpen();
  });
  $$('[data-close-retro-gate]', gate).forEach(el => el.addEventListener('click', gateClose));
  gateForm?.addEventListener('submit', e => {
    e.preventDefault();
    const value = gateInput.value.trim();
    if (value !== RETRO_PASSWORD) {
      gateStatus.textContent = 'Contraseña incorrecta. Si no la tienes, solicítala por WhatsApp o Discord.';
      gateStatus.className = 'retro-gate__status error';
      gateInput.focus();
      gateInput.select();
      return;
    }
    gateStatus.textContent = 'Contraseña correcta. Ya puedes descargar RetroLib.';
    gateStatus.className = 'retro-gate__status success';
    gateForm.hidden = true;
    gateSuccess.hidden = false;
    // No apertura diferida: los navegadores pueden bloquear popups abiertos por temporizadores.
    // El botón de Google Drive permanece visible y abre de forma fiable al pulsarlo.
    $('#retrolib-drive-link')?.focus();
  });

  // --- Escape para cerrar modales ---
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      const activeDialog = authOverlay && !authOverlay.hidden ? authPanel : (gate && !gate.hidden ? $('.retro-gate__card', gate) : null);
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
    if (gate && !gate.hidden) gateClose();
  });
})();
