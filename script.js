/* Sito personale · script.js
   Caricato con "defer" nell'<head>: gira dopo il parsing dell'HTML. */
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];

  // Anno corrente nel footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Se la foto non esiste, resta il ritratto con le iniziali
  document.querySelectorAll('.portrait img').forEach((img) => {
    const remove = () => img.remove();
    if (img.complete && img.naturalWidth === 0) remove();
    else img.addEventListener('error', remove, { once: true });
  });

  // Home: reimposta il test del Progetto 1 (cancella i dati salvati dal gioco nel browser)
  const resetBtn = document.getElementById('reset-demo');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('famstudio_'))
          .forEach((k) => localStorage.removeItem(k));
      } catch (e) { /* localStorage non disponibile */ }

      const frame = document.querySelector('.phone iframe');
      if (frame) frame.src = frame.src; // ricarica l'anteprima da zero

      const status = document.getElementById('reset-status');
      if (status) status.textContent = 'Test reimpostato: puoi grattare di nuovo.';
    });
  }

  // Indice laterale: sezione corrente (pagine CV e Tesina)
  const items = links
    .map((a) => ({ a, el: document.getElementById(a.hash.slice(1)) }))
    .filter((item) => item.el);
  let activeLink = null;

  const setActive = (a) => {
    if (a === activeLink) return;
    activeLink?.removeAttribute('aria-current');
    a.setAttribute('aria-current', 'true');
    activeLink = a;
  };

  // Aggiorna bordo dell'header e voce attiva dell'indice
  const update = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (!items.length) return;

    const offset = (header ? header.offsetHeight : 0) + 48;
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
    let current = items[0];
    for (const item of items) {
      if (item.el.getBoundingClientRect().top <= offset) current = item;
    }
    if (atBottom) current = items[items.length - 1];
    setActive(current.a);
  };

  // Un solo calcolo per frame, anche con scroll molto veloce
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
