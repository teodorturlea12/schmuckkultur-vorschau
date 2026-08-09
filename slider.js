// Startseiten-Slider (ohne Fremdbibliotheken)
(function () {
  var root = document.getElementById('home-slider');
  if (!root) return;
  var slides = root.querySelectorAll('.slide');
  var dotsBox = root.querySelector('.sl-dots');
  var idx = 0, timer = null;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Bild ' + (i + 1) + ' anzeigen');
    b.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(b);
  });
  var dots = dotsBox.querySelectorAll('button');
  function go(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) { s.classList.toggle('on', j === idx); });
    dots.forEach(function (d, j) { d.classList.toggle('on', j === idx); });
  }
  function restart() { clearInterval(timer); if (!still) timer = setInterval(function () { go(idx + 1); }, 4500); }
  root.querySelector('.sl-prev').addEventListener('click', function () { go(idx - 1); restart(); });
  root.querySelector('.sl-next').addEventListener('click', function () { go(idx + 1); restart(); });
  root.addEventListener('mouseenter', function () { clearInterval(timer); });
  root.addEventListener('mouseleave', restart);
  var x0 = null;
  root.addEventListener('pointerdown', function (e) { x0 = e.clientX; clearInterval(timer); });
  root.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    restart();
  });
  go(0); restart();
})();
