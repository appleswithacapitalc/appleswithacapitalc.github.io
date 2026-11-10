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
  // If they haven't chosen, follow the device when it changes (e.g. at sunset)
  systemDark.addEventListener('change', function () { if (!saved()) apply(current()); });

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
    document.querySelectorAll('.theme-switch input').forEach(function (i) {
      i.addEventListener('change', function () { choose(i.checked ? 'dark' : 'light'); });
    });
    // The moon only turns dark mode ON (the sun is just the Sunrises link)
    document.querySelectorAll('.moon-btn').forEach(function (b) {
      b.addEventListener('click', function () { choose('dark'); });
    });
  });
})();
