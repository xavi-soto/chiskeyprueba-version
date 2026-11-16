// ==========================================================
// PROYECTOS · /proyectos/
// Los tickets "se imprimen": caen con fundido al entrar en pantalla, una sola vez,
// escalonados 80 ms entre los que entran juntos (CSS en proyectos.css).
// Se apaga con ENTRADA_ACTIVA en /entrada.js (html.entrada-off).
// El hover, el panel de info y el foco de teclado son solo CSS.
// No toca el modal de Reservas (#myModal): lo maneja main.js.
// ==========================================================
(function () {
    const galeria = document.querySelector('.pr-galeria');
    if (!galeria) return;

    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || html.classList.contains('entrada-off') || !('IntersectionObserver' in window)) return;

    const PASO_MS = 80;
    const tarjetas = Array.from(galeria.querySelectorAll('.ticket'));
    galeria.classList.add('pr-anim');
    const obs = new IntersectionObserver(entries => {
        // el observer respondió: la red de seguridad del <head> ya no hace falta
        html.classList.add('pr-armado');
        entries.filter(e => e.isIntersecting)
            .sort((a, b) => tarjetas.indexOf(a.target) - tarjetas.indexOf(b.target))
            .forEach((entry, i) => {
                const t = entry.target;
                t.style.transitionDelay = (i * PASO_MS) + 'ms';
                t.classList.add('visible');
                // al terminar, sin retraso: el hover responde al instante
                t.addEventListener('transitionend', function limpiar(ev) {
                    if (ev.propertyName !== 'translate') return;
                    t.style.transitionDelay = '';
                    t.removeEventListener('transitionend', limpiar);
                });
                obs.unobserve(t);
            });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    tarjetas.forEach(t => obs.observe(t));
})();
