/* Purchase routing is delegated so filtering never removes payment behavior. */
(() => {
  'use strict';
  const phone = '525566147938';
  const whatsapp = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-pay-product]');
    if (!link) return;
    const product = link.dataset.payProduct;
    const concept = link.dataset.payConcept || 'Acordar por WhatsApp';
    document.querySelector('#payment-product').textContent = product;
    document.querySelector('#payment-concept').textContent = concept;
    const panel = document.querySelector('#payment-selection');
    panel.hidden = false;
    document.querySelector('#payment-quote').href = whatsapp(`Hola ExeptedTech, quiero solicitar cotización y confirmar el importe y la disponibilidad de ${product} antes de pagar.`);
    document.querySelector('.bank-content .text-link').href = whatsapp(`Hola ExeptedTech, quiero enviar mi comprobante. Producto: ${product}. Concepto: ${concept}. Importe acordado: `);
    requestAnimationFrame(() => panel.focus({preventScroll:true}));
  });
  document.querySelector('#song-brief').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const occasion = form.elements.occasion.value.trim();
    if (!occasion) { form.elements.occasion.setCustomValidity('Cuéntanos la ocasión o para quién es.'); form.elements.occasion.reportValidity(); return; }
    const message = `Hola ExeptedTech, quiero cotizar una canción personalizada con IA desde $250 MXN, con dos versiones. Ritmo: ${form.elements.genre.value}. Ocasión o destinatario: ${occasion}. ¿Me confirmas el precio final y la entrega de 1 a 3 días?`;
    window.open(whatsapp(message), '_blank', 'noopener,noreferrer');
  });
  document.querySelector('#song-brief input').addEventListener('input', event => event.target.setCustomValidity(''));
})();
