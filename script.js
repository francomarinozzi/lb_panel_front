// Menu móvil y comportamiento básico
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuBtn.classList.toggle('open');
    });
  }

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          if (menuBtn) menuBtn.classList.remove('open');
        }
      }
    });
  });

  // Manejo simple del formulario
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const phone = form.elements['phone'].value.trim();
      const message = form.elements['message'].value.trim();
      if (!name || !phone || !message) {
        alert('Por favor completá todos los campos.');
        return;
      }
      alert(`Gracias ${name}! Te contactaremos al ${phone}.`);
      form.reset();
    });
  }

  // Lógica del Buscador
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase(); 

      // Usamos window.products que se carga desde el backend
      const sourceData = window.products || [];

      const resultadosFiltrados = sourceData.filter(item => 
        item.producto.toLowerCase().includes(termino)
      );

      // Verificamos que renderTable exista (está definida en precios.html)
      if (typeof window.renderTable === 'function') {
        window.renderTable(resultadosFiltrados);
      }
    });
  }
});