// Light / dark mode.
// Loaded in <head> so the right theme is set before the page draws (no white flash).
// Uses the visitor's saved choice if they've flipped the switch, otherwise their device setting.
(function () {
  var KEY = 'theme';
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }
  function current() { return saved() || (systemDark.matches ? 'dark' : 'light'); }

  function apply(t) {
    document.documentElement.setAttribute('data-bs-theme', t);
    document.querySelectorAll('.theme-switch input').forEach(function (i) { i.checked = (t === 'dark'); });
  }
  function choose(t) { save(t); apply(t); }

  apply(current());

  // On the first page of a visit, the sun and moon in the navbar glow once to show they're links
  // (see .hint-glow in css/stylesheet.css). Clicking around the site doesn't replay it.
  var firstPage = true;
  try { firstPage = !sessionStorage.getItem('sunHint'); sessionStorage.setItem('sunHint', '1'); } catch (e) {}
  if (firstPage) document.documentElement.classList.add('hint-glow');

  // Glow again when they come back (from another tab or another app), but only after being away
  // a while, and at most twice. Being away over an hour starts the count again.
  var AWAY_MS = 60 * 1000, RESET_MS = 60 * 60 * 1000, MAX_REPLAYS = 2, leftAt = 0;
  function leave() { if (!leftAt) leftAt = Date.now(); }
  function back() {
    if (!leftAt) return;
    var away = Date.now() - leftAt;
    leftAt = 0;
    if (away < AWAY_MS) return;
    var n = 0;
    try {
      n = away > RESET_MS ? 0 : +sessionStorage.getItem('sunHintReplays') || 0;
      sessionStorage.setItem('sunHintReplays', n + 1);
    } catch (e) {}
    if (n >= MAX_REPLAYS) return;
    var root = document.documentElement;
    root.classList.remove('hint-glow');
    void root.offsetWidth;                 // restart the animation
    root.classList.add('hint-glow');
  }
  // Switching tabs hides the page; switching to another app only takes focus away from the window
  document.addEventListener('visibilitychange', function () { if (document.hidden) leave(); else back(); });
  window.addEventListener('blur', leave);
  window.addEventListener('focus', back);

  // If they haven't chosen, follow the device when it changes (e.g. at sunset)
  systemDark.addEventListener('change', function () { if (!saved()) apply(current()); });

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
    document.querySelectorAll('.theme-switch input').forEach(function (i) {
      i.addEventListener('change', function () { choose(i.checked ? 'dark' : 'light'); });
    });
  });
})();
