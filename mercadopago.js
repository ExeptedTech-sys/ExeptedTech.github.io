/* Mercado Pago · Cobro mediante enlace público de monto abierto, verificación manual. */
(() => {
  'use strict';
  const form = document.getElementById('mp-quote-form');
  if (!form) return;
  const url = 'https://link.mercadopago.com.mx/exeptedtechluviaco';
  const amount = document.getElementById('mp-quote-amount');
  const concept = document.getElementById('mp-quote-concept');
  const checkbox = document.getElementById('mp-quote-confirmed');
  const preview = document.getElementById('mp-total-preview');
  const status = document.getElementById('mp-form-status');
  const pay = document.getElementById('mp-pay-open');
  const copy = document.getElementById('mp-copy-amount');
  const whatsapp = document.getElementById('mp-confirm-whatsapp');
  const formatter = new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN'});
  const amountValue = () => Number(amount.value);
  const validAmount = () => amount.value.trim() && Number.isFinite(amountValue()) && amountValue() >= 1 && amountValue() <= 100000 && /^\d+(?:\.\d{1,2})?$/.test(amount.value);
  const printable = () => amountValue().toFixed(2);
  function refresh(){
    preview.textContent = validAmount() ? formatter.format(amountValue())+' MXN' : '$0.00 MXN';
    const message = `Hola ExeptedTech, quiero que verifiquen este pago de Mercado Pago.\nConcepto/cotización: ${concept.value.trim() || '(sin especificar)'}\nImporte declarado: ${validAmount()?formatter.format(amountValue()):'(sin especificar)'} MXN.\nAdjuntaré la referencia oficial de mi operación. Entiendo que deben verificarlo en su cuenta.`;
    whatsapp.href='https://wa.me/525566147938?text='+encodeURIComponent(message);
  }
  amount.addEventListener('input',refresh);
  concept.addEventListener('input',refresh);
  const validate = () => {
    if(!validAmount()) {amount.setCustomValidity('Escribe un importe válido de 1 a 100000 MXN con máximo dos decimales.');amount.reportValidity();amount.setCustomValidity('');status.textContent='Introduce el importe final confirmado de tu compra.';return false;}
    if(!concept.checkValidity()){concept.reportValidity();status.textContent='Escribe tu concepto o número de cotización.';return false;}
    if(!checkbox.checked){checkbox.reportValidity();status.textContent='Antes de continuar, confirma que tu compra ya fue aprobada por ExeptedTech.';return false;}
    return true;
  };
  async function copyText(value){
    if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
    const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok) throw new Error('No fue posible copiar automáticamente.');
  }
  copy.addEventListener('click',async()=>{
    if(!validAmount()){amount.focus();status.textContent='Primero escribe un importe válido.';return;}
    try{await copyText(printable());status.textContent='Importe copiado: $'+printable()+' MXN. Pega esa cantidad en el enlace de Mercado Pago.';}
    catch{status.textContent='No fue posible copiar. Escribe manualmente '+formatter.format(amountValue())+' en Mercado Pago.';}
  });
  pay.addEventListener('click',e=>{
    if(!validate()){e.preventDefault();return;}
    // This link is the merchant-provided payment page: never pass or derive card details, prices, or secrets in query parameters.
    pay.href=url;
    status.textContent='Mercado Pago se abrirá en otra pestaña. Escribe allí exactamente '+formatter.format(amountValue())+' MXN y confirma el nombre del comercio. El pedido NO queda pagado automáticamente.';
  });
  form.addEventListener('submit', e=>e.preventDefault());
  refresh();
})();
