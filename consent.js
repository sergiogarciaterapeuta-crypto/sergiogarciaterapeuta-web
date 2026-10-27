/* Aviso de cookies — sergiogarciaterapeuta.es
   Consent Mode v2: por defecto todo "denied" (se fija en <head> antes de gtag).
   Aquí solo se muestra el aviso y se actualiza el consentimiento. */
(function () {
  var KEY = 'sg_consent_v1';
  var GRANTED = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' };
  var DENIED  = { ad_storage: 'denied',  ad_user_data: 'denied',  ad_personalization: 'denied',  analytics_storage: 'denied' };

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) { if (typeof window.gtag === 'function') window.gtag('consent', 'update', v === 'granted' ? GRANTED : DENIED); }

  var css = '#sg-cc{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:560px;margin:0 auto;background:#fff;color:#222;' +
    'border:1px solid #ddd;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.15);padding:12px 14px;font:13px/1.45 inherit;font-family:inherit}' +
    '#sg-cc p{margin:0 0 10px}#sg-cc a{color:inherit;text-decoration:underline}' +
    '#sg-cc .sg-cc-btns{display:flex;gap:10px;flex-wrap:wrap}' +
    '#sg-cc button{flex:1 1 120px;padding:9px 12px;border-radius:7px;font:600 14px/1 inherit;font-family:inherit;cursor:pointer;border:1px solid #222;background:#fff;color:#222}' +
    '#sg-cc button.sg-cc-ok{background:#222;color:#fff}' +
    /* Mientras el aviso está abierto, el botón de WhatsApp sube por encima para que nunca quede tapado */
    'html.sg-cc-open #sg-widget{bottom:calc(var(--sg-cc-h,160px) + 24px)!important;transition:bottom .2s}' +
    '@media (max-width:480px){#sg-cc{left:8px;right:8px;bottom:8px;padding:10px 12px;font-size:12.5px}#sg-cc p{margin:0 0 8px}#sg-cc button{padding:8px 10px;font-size:13px}}';

  function show() {
    if (document.getElementById('sg-cc')) return;
    if (!document.getElementById('sg-cc-css')) {
      var st = document.createElement('style'); st.id = 'sg-cc-css'; st.textContent = css; document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.id = 'sg-cc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Uso cookies de Google para medir la web y mis anuncios. Solo si aceptas. <a href="/privacidad#cookies">Más información sobre las cookies</a>.</p>' +
      '<div class="sg-cc-btns"><button type="button" class="sg-cc-no">Rechazar</button>' +
      '<button type="button" class="sg-cc-ok">Aceptar</button></div>';
    document.body.appendChild(box);
    var root = document.documentElement;
    function fit() { root.style.setProperty('--sg-cc-h', box.offsetHeight + 'px'); }
    root.classList.add('sg-cc-open'); fit(); window.addEventListener('resize', fit);
    function close() { root.classList.remove('sg-cc-open'); window.removeEventListener('resize', fit); box.remove(); }
    box.querySelector('.sg-cc-ok').addEventListener('click', function () { save('granted'); apply('granted'); close(); });
    box.querySelector('.sg-cc-no').addEventListener('click', function () { save('denied'); apply('denied'); close(); });
  }

  // Permite reabrir el aviso desde un enlace "Configurar cookies"
  window.sgOpenConsent = function () { show(); return false; };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-sg-cookies]');
    if (a) { e.preventDefault(); show(); }
  });

  function init() { if (!read()) show(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
