// Schmuck-Viewer (ohne Fremdbibliotheken). Deep-Link: #p<ID>
(function () {
  var dataEl = document.getElementById('v-data');
  if (!dataEl) return;
  var items = JSON.parse(dataEl.textContent);
  if (!items.length) return;
  var img = document.getElementById('v-img');
  var cap = document.getElementById('v-caption');
  var thumbs = document.getElementById('v-thumbs').querySelectorAll('button');
  var idx = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function captionHtml(p) {
    var parts = [];
    if (p.d) parts.push('Designer: ' + (p.ds ? '<a href="designer-' + esc(p.ds) + '.html">' + esc(p.d) + '</a>' : esc(p.d)));
    if (p.b) parts.push('Beschreibung: ' + esc(p.b));
    if (p.pr) parts.push('Preis: ' + esc(p.pr));
    parts.push((idx + 1) + ' / ' + items.length);
    return parts.join(' &nbsp;·&nbsp; ');
  }
  function show(i, setHash) {
    idx = (i + items.length) % items.length;
    var p = items[idx];
    img.src = p.img;
    if (p.img2x) img.srcset = p.img + ' 1x, ' + p.img2x + ' 2x'; else img.removeAttribute('srcset');
    cap.innerHTML = captionHtml(p);
    thumbs.forEach(function (t, j) { t.classList.toggle('on', j === idx); });
    if (thumbs[idx] && thumbs[idx].scrollIntoView) thumbs[idx].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    if (setHash !== false) history.replaceState(null, '', '#p' + p.id);
    [1, -1].forEach(function (o) {
      var n = items[(idx + o + items.length) % items.length];
      var pre = new Image(); pre.src = n.img;
    });
  }
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { show(parseInt(t.getAttribute('data-i'), 10)); });
  });
  document.querySelector('.v-prev').addEventListener('click', function () { show(idx - 1); });
  document.querySelector('.v-next').addEventListener('click', function () { show(idx + 1); });
  document.addEventListener('keydown', function (e) {
    var lbEl = document.getElementById('v-lightbox');
    if (lbEl && !lbEl.hidden) return; // Lightbox offen → deren eigener Handler übernimmt
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  var x0 = null;
  var main = document.querySelector('.v-main');
  main.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  main.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
  });
  // Zoom: Klick aufs Bild öffnet die Großansicht (beste verfügbare Auflösung)
  var lb = document.getElementById('v-lightbox');
  var lbImg = document.getElementById('lb-img');
  function openLb() {
    var p = items[idx];
    lbImg.src = p.img2x || p.img;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
  img.addEventListener('click', openLb);
  img.style.cursor = 'zoom-in';
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { show(idx - 1); lbImg.src = items[idx].img2x || items[idx].img; }
    if (e.key === 'ArrowRight') { show(idx + 1); lbImg.src = items[idx].img2x || items[idx].img; }
  });

  var start = 0;
  var hm = location.hash.match(/^#p(\w+)$/);
  if (hm) {
    var f = items.findIndex(function (p) { return String(p.id) === hm[1]; });
    if (f >= 0) start = f;
  }
  show(start, false);
})();
