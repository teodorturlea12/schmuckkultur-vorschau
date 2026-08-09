// Social-Feeds (Facebook/Instagram) — 2-Klick-Lösung:
// Meta-Inhalte laden erst nach Klick; die Zustimmung wird lokal gemerkt.
(function () {
  var KEY = 'schmuckkultur-social-consent';
  var cards = document.querySelectorAll('.feed-card');
  if (!cards.length) return;
  function loadCard(card) {
    var slot = card.querySelector('.feed-slot');
    if (!slot || slot.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.src = card.getAttribute('data-src');
    f.height = card.getAttribute('data-h') || '500';
    f.title = card.getAttribute('data-title') || 'Social-Media-Beiträge';
    f.loading = 'lazy';
    f.setAttribute('allow', 'encrypted-media');
    f.style.height = f.height + 'px';
    slot.innerHTML = '';
    slot.appendChild(f);
  }
  function loadAll() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    cards.forEach(loadCard);
  }
  cards.forEach(function (card) {
    var btn = card.querySelector('.feed-load');
    if (btn) btn.addEventListener('click', loadAll);
  });
  var ok = false;
  try { ok = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (ok) cards.forEach(loadCard);
})();
