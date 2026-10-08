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

  var css = '#sg-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;background:#fff;color:#222;' +
    'border:1px solid #ddd;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.15);padding:16px 18px;font:14px/1.5 inherit;font-family:inherit}' +
    '#sg-cc p{margin:0 0 12px}#sg-cc a{color:inherit;text-decoration:underline}' +
    '#sg-cc .sg-cc-btns{display:flex;gap:10px;flex-wrap:wrap}' +
    '#sg-cc button{flex:1 1 140px;padding:10px 14px;border-radius:7px;font:600 14px/1 inherit;font-family:inherit;cursor:pointer;border:1px solid #222;background:#fff;color:#222}' +
    '#sg-cc button.sg-cc-ok{background:#222;color:#fff}';

  function show() {
    if (document.getElementById('sg-cc')) return;
    if (!document.getElementById('sg-cc-css')) {
      var st = document.createElement('style'); st.id = 'sg-cc-css'; st.textContent = css; document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.id = 'sg-cc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Uso cookies de Google Analytics y Google Ads para saber cómo se usa esta web y medir mis anuncios. ' +
      'Solo se activan si aceptas. Más información en la <a href="/privacidad#cookies">política de privacidad</a>.</p>' +
      '<div class="sg-cc-btns"><button type="button" class="sg-cc-no">Rechazar</button>' +
      '<button type="button" class="sg-cc-ok">Aceptar</button></div>';
    document.body.appendChild(box);
    box.querySelector('.sg-cc-ok').addEventListener('click', function () { save('granted'); apply('granted'); box.remove(); });
    box.querySelector('.sg-cc-no').addEventListener('click', function () { save('denied'); apply('denied'); box.remove(); });
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
