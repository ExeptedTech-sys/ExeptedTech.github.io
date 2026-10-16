/* ExeptedTech | Autenticación pública. Sin secretos y sin persistencia de tokens. */
(() => {
  'use strict';
  const config = window.EXEPTED_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const authForm = $('#auth-form');
  const verifyForm = $('#verify-form');
  const resetForm = $('#reset-form');
  const signedIn = $('#signed-in');
  let mode = 'signup';
  let pendingEmail = '';
  let pendingType = 'signup';
  let session = null;
  let lastSent = 0;
  const CAPTCHA = Boolean(config.turnstileSiteKey);
  const captchaWidgets = new Map();

  const configured = () => config.registrationEnabled === true &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl || '') &&
    /^(sb_publishable_|eyJ)/.test(config.supabaseAnonKey || '') && CAPTCHA;

  function status(message, kind = 'info') {
    const field = $('#auth-status');
    field.textContent = message;
    field.dataset.kind = kind;
  }

  function available() {
    if (configured()) return true;
    status('El acceso de clientes está en preparación. Pronto podrás registrarte y verificar tu correo. Mientras tanto, puedes solicitar información por WhatsApp.', 'info');
    return false;
  }

  function failure(error) {
    if (error?.name === 'AbortError') return status('La conexión tardó demasiado. Inténtalo nuevamente.', 'error');
    if (error?.http === 429 || error?.code === 'over_email_send_rate_limit' || error?.code === 'over_request_rate_limit')
      return status('Se alcanzó el límite de solicitudes. Espera unos minutos y vuelve a intentarlo.', 'error');
    if (error?.code === 'email_not_confirmed')
      return status('Todavía falta confirmar ese correo. Selecciona “Ya tengo un código de verificación”.', 'error');
    if (error?.code === 'invalid_credentials')
      return status('No pudimos iniciar sesión. Comprueba tu correo y contraseña.', 'error');
    if (error?.code === 'captcha_failed' || error?.code === 'captcha_invalid')
      return status('La verificación de seguridad no se completó. Inténtalo de nuevo.', 'error');
    if (error?.code === 'weak_password')
      return status('La contraseña fue rechazada por seguridad. Elige otra más larga y diferente.', 'error');
    if (error?.code === 'signup_disabled')
      return status('El registro todavía no está habilitado en Supabase. Comunícate con soporte.', 'error');
    if (error?.code === 'otp_expired' || error?.code === 'otp_disabled')
      return status('El código ya no es válido. Solicita uno nuevo.', 'error');
    status('No pudimos completar esta operación. Comprueba tu conexión y los datos. Si el problema continúa, intenta más tarde.', 'error');
  }

  async function request(path, body, token = null, method = 'POST') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const headers = { 'apikey': config.supabaseAnonKey, 'Content-Type': 'application/json' };
    // sb_publishable_* no es JWT: nunca enviarlo como Authorization: Bearer.
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      const response = await fetch(`${config.supabaseUrl}/auth/v1/${path}`, {
        method, headers, body: JSON.stringify(body), signal: controller.signal, cache: 'no-store'
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error('Authentication request failed');
        error.code = data.error_code || data.code || '';
        error.http = response.status;
        throw error;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function captchaRender(formId) {
    if (!CAPTCHA || !window.turnstile) return;
    if (captchaWidgets.has(formId)) return;
    const target = formId === 'auth' ? '#captcha-auth' : '#captcha-verify';
    const widgetId = window.turnstile.render(target, {
      sitekey: config.turnstileSiteKey,
      theme: 'dark', language: 'es', appearance: 'always',
      'error-callback': () => status('No se pudo cargar la verificación antirrobots. Desactiva el bloqueador para este sitio y actualiza la página.', 'error'),
      'expired-callback': () => status('La comprobación de seguridad venció. Vuelve a completarla.', 'info')
    });
    captchaWidgets.set(formId, widgetId);
  }

  function captchaToken(formId) {
    if (!CAPTCHA) return '';
    captchaRender(formId);
    const widgetId = captchaWidgets.get(formId);
    const token = widgetId !== undefined && window.turnstile?.getResponse(widgetId);
    if (!token) status('Completa primero la verificación de seguridad para continuar.', 'error');
    return token || '';
  }

  function captchaReset(formId) {
    const widgetId = captchaWidgets.get(formId);
    if (widgetId !== undefined && window.turnstile) window.turnstile.reset(widgetId);
  }

  function loadCaptcha() {
    if (!CAPTCHA || config.registrationEnabled !== true) return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      if (!authForm.hidden) captchaRender('auth');
      if (!verifyForm.hidden) captchaRender('verify');
    };
    script.onerror = () => status('La verificación antirrobots no está disponible. Revisa tu conexión e inténtalo de nuevo.', 'error');
    document.head.append(script);
  }

  async function busy(form, action) {
    const buttons = [...form.querySelectorAll('button')];
    buttons.forEach(button => { button.disabled = true; });
    form.setAttribute('aria-busy', 'true');
    try { await action(); }
    catch (error) { failure(error); }
    finally {
      form.removeAttribute('aria-busy');
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  function showUser(data) {
    // Las sesiones se mantienen en memoria: sin localStorage, sessionStorage ni cookies propias.
    if (!data?.access_token || !data?.user?.email_confirmed_at) {
      status('La cuenta necesita confirmar su correo antes de acceder.', 'error');
      return;
    }
    session = data;
    authForm.reset();
    verifyForm.reset();
    resetForm.reset();
    authForm.hidden = true;
    verifyForm.hidden = true;
    resetForm.hidden = true;
    signedIn.hidden = false;
    $('#auth-title').textContent = 'Acceso confirmado';
    $('#auth-subtitle').textContent = 'Tu información está protegida.';
    const nickname = data.user.user_metadata?.nickname || 'bienvenido';
    $('#welcome').textContent = `Hola, ${nickname}.`;
    status('Sesión iniciada. Para proteger tu acceso, deberás ingresar de nuevo después de recargar esta página.', 'success');
  }

  function setMode(next) {
    mode = next;
    authForm.hidden = false;
    verifyForm.hidden = true;
    resetForm.hidden = true;
    signedIn.hidden = true;
    const signUp = next === 'signup';
    $('#signup-fields').hidden = !signUp;
    $('#signup-password-extra').hidden = !signUp;
    $('#consent-label').hidden = !signUp;
    for (const input of $('#signup-fields').querySelectorAll('input')) input.required = signUp;
    for (const input of $('#signup-password-extra').querySelectorAll('input')) input.required = signUp;
    authForm.elements.consent.required = signUp;
    authForm.elements.password.autocomplete = signUp ? 'new-password' : 'current-password';
    authForm.elements.password.minLength = signUp ? 12 : 1;
    $('#auth-title').textContent = signUp ? 'Crea tu identidad digital' : 'Qué bueno verte de nuevo';
    $('#auth-subtitle').textContent = signUp ? 'Completa tus datos y confirma tu correo con un código de un solo uso.' : 'Entra con tu correo verificado y tu contraseña.';
    $('#auth-submit').innerHTML = signUp ? 'Crear cuenta <span aria-hidden="true">→</span>' : 'Entrar a mi cuenta <span aria-hidden="true">→</span>';
    $('#recover').hidden = signUp;
    $('#enter-code').hidden = !signUp;
    document.querySelectorAll('.account-tabs [data-auth-mode]').forEach(button => {
      const active = button.dataset.authMode === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (configured()) status(''); else available();
    captchaReset('auth');
    captchaRender('auth');
  }

  function showVerification(type) {
    if (!pendingEmail) { status('Introduce primero tu correo electrónico.', 'error'); return; }
    pendingType = type;
    authForm.hidden = true;
    signedIn.hidden = true;
    resetForm.hidden = true;
    verifyForm.hidden = false;
    $('#verification-address').textContent = pendingEmail;
    $('#verify-heading').textContent = type === 'recovery' ? 'Confirma tu recuperación' : 'Comprueba tu correo';
    captchaRender('verify');
    verifyForm.elements.token.focus();
  }

  document.querySelectorAll('[data-auth-mode]').forEach(button => button.addEventListener('click', () => {
    if (document.querySelector('[aria-busy="true"]')) return;
    if (session) return status('Finaliza la recuperación o cierra tu sesión antes de cambiar de cuenta.', 'info');
    setMode(button.dataset.authMode);
  }));

  for (const button of document.querySelectorAll('[data-toggle-password]')) {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Ocultar' : 'Mostrar';
      button.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  }

  authForm.elements.password.addEventListener('input', () => {
    const password = authForm.elements.password.value;
    const strength = $('#password-strength');
    if (!password) return strength.textContent = 'Utiliza al menos 12 caracteres y una contraseña única.';
    if (password.length < 12) return strength.textContent = `Faltan ${12 - password.length} caracteres para el mínimo de seguridad.`;
    const families = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    strength.textContent = families >= 3 && password.length >= 15 ? 'Buena combinación. Evita reutilizar contraseñas.' : 'Longitud aceptable. Para mayor protección, usa una frase larga y única.';
  });

  authForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!available()) return;
    const email = authForm.elements.email.value.trim().toLowerCase();
    const password = authForm.elements.password.value;
    if (mode === 'signup') {
      if (password !== authForm.elements.confirm_password.value) return status('Las contraseñas no coinciden.', 'error');
      if (!authForm.elements.consent.checked) return status('Debes revisar y aceptar las condiciones de registro.', 'error');
      if (authForm.elements.name.value.trim().length < 2 || authForm.elements.nickname.value.trim().length < 2) return status('Completa tu nombre y un apodo de al menos dos caracteres.', 'error');
    }
    const token = captchaToken('auth');
    if (!token) return;
    busy(authForm, async () => {
      try {
        if (mode === 'login') {
          const response = await request('token?grant_type=password', { email, password, gotrue_meta_security: { captcha_token: token } });
          showUser(response);
          return;
        }
        const response = await request('signup', {
          email, password,
          data: {
            full_name: authForm.elements.name.value.trim(), nickname: authForm.elements.nickname.value.trim(),
            privacy_version: '2026-10-16', privacy_accepted_at: new Date().toISOString()
          },
          gotrue_meta_security: { captcha_token: token }
        });
        authForm.elements.password.value = '';
        authForm.elements.confirm_password.value = '';
        if (response.access_token) {
          // Si Confirm Email está desactivado, Supabase devuelve una sesión.
          await request('logout', {}, response.access_token).catch(() => {});
          status('El administrador debe activar Confirm email en Supabase antes de usar el registro.', 'error');
          return;
        }
        pendingEmail = email;
        pendingType = 'signup';
        lastSent = Date.now();
        showVerification('signup');
        status('Si procede el registro, recibirás un código de verificación. Ingresa el más reciente. No lo compartas.', 'success');
      } finally { captchaReset('auth'); }
    });
  });

  $('#enter-code').addEventListener('click', () => {
    if (!available()) return;
    if (!authForm.elements.email.reportValidity()) return;
    pendingEmail = authForm.elements.email.value.trim().toLowerCase();
    showVerification('signup');
    status('Ingresa el código que recibiste al registrarte. Si ya expiró, pide otro.', 'info');
  });

  verifyForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!available()) return;
    busy(verifyForm, async () => {
      const data = await request('verify', {
        email: pendingEmail,
        token: verifyForm.elements.token.value.trim(),
        type: pendingType === 'signup' ? 'email' : pendingType
      });
      verifyForm.elements.token.value = '';
      if (pendingType === 'recovery') {
        if (!data.access_token) return status('No pudo verificarse el código de recuperación.', 'error');
        session = data;
        verifyForm.hidden = true;
        resetForm.hidden = false;
        status('Código correcto. Define una nueva contraseña de al menos 12 caracteres.', 'success');
        resetForm.elements.password.focus();
      } else {
        showUser(data);
      }
    });
  });

  $('#resend').addEventListener('click', () => {
    if (!available()) return;
    if (Date.now() - lastSent < 60000) return status('Espera al menos un minuto antes de solicitar otro código.', 'info');
    const token = captchaToken('verify');
    if (!token) return;
    busy(verifyForm, async () => {
      try {
        if (pendingType === 'recovery') {
          await request('recover', { email: pendingEmail, gotrue_meta_security: { captcha_token: token } });
        } else {
          await request('resend', { type: 'signup', email: pendingEmail, gotrue_meta_security: { captcha_token: token } });
        }
        lastSent = Date.now();
        status('Si corresponde, llegará otro código. Usa únicamente el más reciente.', 'success');
      } finally { captchaReset('verify'); }
    });
  });

  $('#back-auth').addEventListener('click', () => {
    verifyForm.reset();
    setMode(mode);
  });

  $('#recover').addEventListener('click', () => {
    if (!available()) return;
    if (!authForm.elements.email.reportValidity()) return;
    const token = captchaToken('auth');
    if (!token) return;
    busy(authForm, async () => {
      try {
        pendingEmail = authForm.elements.email.value.trim().toLowerCase();
        await request('recover', { email: pendingEmail, gotrue_meta_security: { captcha_token: token } });
        pendingType = 'recovery';
        lastSent = Date.now();
        authForm.elements.password.value = '';
        showVerification('recovery');
        status('Si existe esa cuenta, recibirás un código de recuperación. Revisa también spam.', 'info');
      } finally { captchaReset('auth'); }
    });
  });

  resetForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!session?.access_token) return status('Verifica primero el código de recuperación.', 'error');
    const password = resetForm.elements.password.value;
    if (password !== resetForm.elements.confirm_password.value) return status('Las contraseñas no coinciden.', 'error');
    busy(resetForm, async () => {
      const response = await request('user', { password }, session.access_token, 'PUT');
      if (response?.email_confirmed_at && !session.user?.email_confirmed_at) session.user = response;
      showUser(session);
      status('Contraseña actualizada. Tu sesión está iniciada.', 'success');
    });
  });

  $('#logout').addEventListener('click', async () => {
    const active = session;
    session = null;
    authForm.reset();
    if (active?.access_token) {
      try { await request('logout', {}, active.access_token); } catch { /* Borrar la sesión local aunque no responda la red. */ }
    }
    setMode('login');
    status('Sesión cerrada. Los datos de acceso ya no están en esta página.', 'success');
  });

  setMode('signup');
  loadCaptcha();
})();
