/* Language selection shared by every page (French / English).
   Order of precedence: ?lang= in the URL, then the visitor's saved choice, then the browser language.
   Load it in <head>, before the content, so the right language is set before the first paint.
   Per page: <html data-title-fr="..." data-title-en="..."> sets the tab title, and links to another
   page of the site carry data-page="other.html" so the chosen language follows the visitor. */
(function () {
  var root = document.documentElement;
  var KEY = 'sentier-lang';

  function valid(lang) { return lang === 'fr' || lang === 'en'; }

  var lang = null;
  try { lang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (!valid(lang)) { try { lang = localStorage.getItem(KEY); } catch (e) {} }
  if (!valid(lang)) { lang = /^fr\b/i.test(navigator.language || '') ? 'fr' : 'en'; }

  function apply(next) {
    root.lang = next;
    root.setAttribute('data-lang', next);
    var title = root.getAttribute('data-title-' + next);
    if (title) document.title = title;
    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-set-lang') === next));
    });
    document.querySelectorAll('a[data-page]').forEach(function (link) {
      link.href = link.getAttribute('data-page') + '?lang=' + next;
    });
  }

  apply(lang);

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
      button.addEventListener('click', function () {
        var chosen = button.getAttribute('data-set-lang');
        apply(chosen);
        try { localStorage.setItem(KEY, chosen); } catch (e) {}
      });
    });
    apply(root.getAttribute('data-lang'));
  });
})();
