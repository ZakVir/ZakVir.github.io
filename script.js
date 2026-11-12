/* Zakir Virani portfolio — theme toggle, live Chicago clock, Grit calculator.
   All client-side, no data leaves the page. */
(function () {
  // Theme toggle
  var btn = document.getElementById('theme-toggle');
  function setLabel() {
    if (btn) btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
  }
  setLabel();
  if (btn) btn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('zv-theme', next); } catch (e) {}
    setLabel();
  });

  // Live Chicago time (Glenview, IL) — one small human touch
  function tick() {
    var els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    var now = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', second: '2-digit'
    });
    els.forEach(function (el) { el.textContent = 'Chicago ' + now; });
  }
  tick();
  setInterval(tick, 1000);

  // Grit calculator — Angela Duckworth's Grit Scale (adapted), as on the
  // Unit 2 sheet. Items 2, 4, 7, 8, 9, 10 scored as-is; items 1, 3, 5, 6
  // reverse-scored (1→5, 2→4, 3→3, 4→2, 5→1). Total ÷ 10. Top quartile 3.8+.
  var form = document.getElementById('grit-form');
  if (!form) return;
  var result = document.getElementById('grit-result');
  var scoreEl = document.getElementById('grit-score');
  var bandEl = document.getElementById('grit-band');
  var barEl = document.getElementById('grit-bar-fill');
  var noteEl = document.getElementById('grit-note');
  var REVERSE = [1, 3, 5, 6];
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var total = 0, answered = 0;
    for (var i = 1; i <= 10; i++) {
      var picked = form.querySelector('input[name="q' + i + '"]:checked');
      if (!picked) continue;
      var v = parseInt(picked.value, 10);
      if (REVERSE.indexOf(i) !== -1) v = 6 - v;
      total += v;
      answered++;
    }
    if (answered < 10) {
      noteEl.textContent = 'Answer all 10 statements first — ' + (10 - answered) + ' to go.';
      result.classList.add('show');
      return;
    }
    var score = Math.round((total / 10) * 100) / 100;
    scoreEl.innerHTML = score.toFixed(2) + ' <small>/ 5.0</small>';
    barEl.style.width = (score / 5 * 100) + '%';
    var band, note;
    if (score >= 3.8) {
      band = 'Top quartile — 3.8+';
      note = 'That is in the top quartile of the scale. Grit is not a fixed trait, so the work now is keeping it there.';
    } else if (score >= 3.0) {
      band = 'Developing — solid middle ground';
      note = 'Above the middle of the scale. The passion/focus items (1, 3, 5, 6) are usually where the points are lost.';
    } else {
      band = 'A starting point — room to grow';
      note = 'A baseline, not a verdict. Grit can be deliberately developed — that is the whole point of measuring it twice.';
    }
    bandEl.textContent = band;
    noteEl.textContent = note + ' My score on August 30, 2026 was 2.85 / 5.0 — this is the number to beat next time I take it.';
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
