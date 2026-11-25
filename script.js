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

// ---------------------------------------------------------------------------
// Llegada con #ancla desde otra página (ej. "Hacé tu pedido" en precios →
// /#pedidos). El navegador salta apenas carga, pero después el contenido de
// arriba crece (llega el adelanto de precios de la API, terminan las
// imágenes) y la sección queda corrida. Se re-alinea cuando la página se
// acomoda, salvo que la persona ya haya empezado a scrollear por su cuenta.
// ---------------------------------------------------------------------------
let userScrolled = false;
['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((type) =>
  window.addEventListener(type, () => { userScrolled = true; }, { once: true, passive: true }));

function realignHash() {
  if (userScrolled || !location.hash) return;
  let target = null;
  try {
    target = document.querySelector(decodeURIComponent(location.hash));
  } catch {
    return; // hash que no es un selector válido
  }
  // 'instant': si no, el scroll-behavior: smooth del CSS anima un salto que
  // la persona no pidió.
  target?.scrollIntoView({ behavior: 'instant', block: 'start' });
}

window.addEventListener('load', realignHash);

// ---------------------------------------------------------------------------
// Header con sombra apenas se scrollea.
// ---------------------------------------------------------------------------
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  const mark = () => { siteHeader.dataset.scrolled = String(window.scrollY > 8); };
  window.addEventListener('scroll', mark, { passive: true });
  mark();
}

// ---------------------------------------------------------------------------
// Entradas al hacer scroll (.reveal). Sin IntersectionObserver, se muestra todo.
// ---------------------------------------------------------------------------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// ---------------------------------------------------------------------------
// Sucursales: "Abierto ahora" / "Cerrado" en vivo, siempre en hora argentina
// (aunque quien mire esté en otro huso).
// ---------------------------------------------------------------------------
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function nowInBuenosAires() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, hour: Number(get('hour')) + Number(get('minute')) / 60 };
}

function branchStatus(hours) {
  const { day, hour } = nowInBuenosAires();
  const today = hours[day] || [];

  const open = today.find(([from, to]) => hour >= from && hour < to);
  if (open) return { open: true, text: `Abierto · cierra ${open[1]} h` };

  // Próxima apertura: más tarde hoy o en los próximos días.
  const later = today.find(([from]) => from > hour);
  if (later) return { open: false, text: `Cerrado · abre ${later[0]} h` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const first = (hours[d] || [])[0];
    if (first) {
      const when = i === 1 ? 'mañana' : `el ${DAYS[d]}`;
      return { open: false, text: `Cerrado · abre ${when} ${first[0]} h` };
    }
  }
  return { open: false, text: 'Cerrado' };
}

const branches = document.querySelectorAll('[data-hours]');
function paintStatuses() {
  branches.forEach((card) => {
    const badge = card.querySelector('[data-status]');
    if (!badge) return;
    try {
      const { open, text } = branchStatus(JSON.parse(card.dataset.hours));
      badge.dataset.open = String(open);
      badge.textContent = text;
    } catch {
      badge.remove();
    }
  });
}
if (branches.length) {
  paintStatuses();
  setInterval(paintStatuses, 60_000);
}

// ---------------------------------------------------------------------------
// Adelanto de la lista de precios: algunos productos reales. Si la API falla
// o no hay productos, la columna sigue oculta y no se nota nada.
// ---------------------------------------------------------------------------
const teaserList = document.getElementById('teaserList');
if (teaserList) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  fetch(`${API_URL}/products`)
    .then((res) => (res.ok ? res.json() : []))
    .then((products) => {
      if (!Array.isArray(products) || !products.length) return;
      // Los primeros 4 según el orden elegido en el admin.
      const picks = products.slice(0, 4);
      teaserList.innerHTML = picks.map((p) => `
        <li class="leader py-3 border-b border-crema/10 last:border-0">
          <span class="min-w-0">
            <span class="block text-crema text-[1.0625rem]">${esc(p.nombre)}</span>
            <span class="eyebrow text-crema/45 mt-1 block">${esc(p.unidad)}</span>
          </span>
          <span class="leader-fill"></span>
          <span class="display text-xl text-brand-soft tnum shrink-0">${esc(money.format(p.precio))}</span>
        </li>`).join('');
      teaserList.classList.remove('hidden');
      // El adelanto agranda la página por encima de #pedidos y #sucursales.
      requestAnimationFrame(realignHash);
    })
    .catch(() => { /* sin adelanto: la invitación alcanza */ });
}
