// Solo configuraciones públicas. La API key de Resend, el secreto de Turnstile,
// service_role y las contraseñas NUNCA van en este archivo ni en GitHub.
window.EXEPTED_CONFIG = Object.freeze({
  supabaseUrl: 'https://nzxzuuognbvluxshflua.supabase.co',
  supabaseAnonKey: 'sb_publishable_iWJGEfOHWijAEbZxppsjRQ_EMrVCpnh',
  // Primero termina SMTP, OTP, RLS y Turnstile. Luego cambia a true.
  registrationEnabled: false,
  // SITE KEY PUBLICA que obtendras de Cloudflare Turnstile (NO la secret key).
  turnstileSiteKey: ''
});
