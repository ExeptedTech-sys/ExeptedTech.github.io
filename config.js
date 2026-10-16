// Solo configuraciones públicas. La API key de Resend, el secreto de Turnstile,
// service_role y las contraseñas NUNCA van en este archivo ni en GitHub.
window.EXEPTED_CONFIG = Object.freeze({
  supabaseUrl: 'https://nzxzuuognbvluxshflua.supabase.co',
  supabaseAnonKey: 'sb_publishable_iWJGEfOHWijAEbZxppsjRQ_EMrVCpnh',
  // Requiere configurar la Secret Key del widget en Supabase y SMTP operativo.
  registrationEnabled: true,
  // Site Key pública de Turnstile; no contiene la clave secreta.
  turnstileSiteKey: '0x4AAAAAAFYxb2xDzYnW3nHF'
});
