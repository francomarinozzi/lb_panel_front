// Landing — menú móvil y detalles menores.
// El scroll suave y el offset del header sticky se resuelven en CSS
// (scroll-behavior + scroll-padding-top), así que acá no hace falta nada.

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  // El panel se anima por CSS a partir de data-open (grid-template-rows).
  const setOpen = (open) => {
    mobileMenu.dataset.open = String(open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  menuBtn.addEventListener('click', () => {
    setOpen(mobileMenu.dataset.open !== 'true');
  });

  // Al elegir un destino, el menú se cierra solo.
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuBtn.focus();
    }
  });

  // Si se pasa al layout de escritorio con el menú abierto, hay que resetearlo:
  // el panel queda oculto por CSS pero el botón seguiría diciendo "expandido".
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
