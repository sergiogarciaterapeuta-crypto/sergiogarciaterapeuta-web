/* WhatsApp en ordenador — sergiogarciaterapeuta.es
   En un ordenador, el enlace de WhatsApp pide abrir la aplicación o WhatsApp Web, y mucha gente se queda ahí.
   En ordenador (ratón, pantalla de 768 px o más), los botones de WhatsApp abren esta ventana en lugar de saltar a wa.me:
   - un código QR para seguir en el móvil, con el mensaje y su código [PÁGINA-ORIGEN] ya escritos;
   - un enlace para abrir WhatsApp en este ordenador: ese clic sí cuenta como «Clic en WhatsApp», igual que antes;
   - un formulario corto para que Sergio escriba él: cuenta como formulario solo al enviarse.
   Abrir la ventana no cuenta como conversión. En móvil y tablet táctil no cambia nada. */
(function () {
  var MQ = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var DEFAULT_TEXT = 'Hola Sergio, me gustaría más información';
  var FORM_CONVERSION = 'AW-18318477742/F1MjCIrB-_ocEK6T955E';
  var root, box, qrBox, openLink, form, statusEl, lastFocus, qrLoading;

  function isDesktop() { return !!(MQ && MQ.matches) && window.innerWidth >= 768; }

  function code() {
    try { return typeof window.sgCode === 'function' ? window.sgCode() : ''; } catch (e) { return ''; }
  }

  // Misma regla que el resto de la web: el código se añade una sola vez al final del texto.
  function waUrl(href) {
    var c = code();
    try {
      var u = new URL(href, location.href);
      var t = u.searchParams.get('text') || DEFAULT_TEXT;
      if (c && t.indexOf('[' + c.split('-')[0]) === -1) t = t + ' [' + c + ']';
      return 'https://wa.me' + u.pathname + '?text=' + encodeURIComponent(t);
    } catch (e) { return href; }
  }

  function loadQr() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (!qrLoading) {
      qrLoading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = '/qrcode.min.js';
        s.async = true;
        s.onload = function () { if (window.qrcode) resolve(window.qrcode); else reject(new Error('qr')); };
        s.onerror = function () { qrLoading = null; reject(new Error('qr')); };
        document.head.appendChild(s);
      });
    }
    return qrLoading;
  }

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  var CSS =
    'html.sg-wad-on{overflow:hidden}' +
    '#sg-wad{position:fixed;inset:0;z-index:2147483600;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);padding:16px;box-sizing:border-box}' +
    '#sg-wad.open{display:flex}' +
    '#sg-wad .sg-wad-box{position:relative;background:#fff;color:#222;border-radius:14px;box-shadow:0 14px 44px rgba(0,0,0,.28);width:100%;max-width:660px;max-height:calc(100vh - 32px);overflow:auto;padding:26px 28px 24px;box-sizing:border-box;font-family:inherit;outline:none}' +
    '#sg-wad .sg-wad-x{position:absolute;top:8px;right:10px;background:none;border:0;font-size:28px;line-height:1;cursor:pointer;color:#666;padding:6px 10px}' +
    '#sg-wad .sg-wad-x:hover{color:#222}' +
    '#sg-wad .sg-wad-t{margin:0 0 4px;font-size:21px;font-weight:600;color:#075E54}' +
    '#sg-wad .sg-wad-lead{margin:0 0 18px;font-size:14px;color:#555}' +
    '#sg-wad .sg-wad-cols{display:flex;gap:28px;align-items:flex-start}' +
    '#sg-wad .sg-wad-qr-col{flex:0 0 220px;text-align:center}' +
    '#sg-wad .sg-wad-qr{width:208px;height:208px;margin:0 auto 12px;border:1px solid #e3e3e3;border-radius:12px;padding:8px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:#fff;color:#999;font-size:13px}' +
    '#sg-wad .sg-wad-qr svg{width:100%;height:100%;display:block}' +
    '#sg-wad .sg-wad-help{font-size:13px;line-height:1.45;color:#444;margin:0 0 12px}' +
    '#sg-wad .sg-wad-open{font-size:13px;color:#075E54;text-decoration:underline}' +
    '#sg-wad .sg-wad-form-col{flex:1 1 auto;border-left:1px solid #eee;padding-left:26px}' +
    '#sg-wad .sg-wad-sub{margin:0 0 4px;font-size:16px;font-weight:600;color:#222}' +
    '#sg-wad .sg-wad-sub2{margin:0 0 12px;font-size:13px;color:#555}' +
    '#sg-wad .sg-wad-form input,#sg-wad .sg-wad-form textarea{display:block;width:100%;box-sizing:border-box;border:1px solid #d6d6d6;border-radius:8px;padding:10px 12px;font:inherit;font-size:14px;margin:0 0 10px;color:#222;background:#fff}' +
    '#sg-wad .sg-wad-form textarea{min-height:74px;resize:vertical}' +
    '#sg-wad .sg-wad-form button{width:100%;background:#075E54;color:#fff;border:0;border-radius:8px;padding:12px 0;font:inherit;font-size:15px;font-weight:600;cursor:pointer}' +
    '#sg-wad .sg-wad-form button:hover{background:#05463e}' +
    '#sg-wad .sg-wad-form button[disabled]{opacity:.6;cursor:default}' +
    '#sg-wad .sg-wad-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}' +
    '#sg-wad .sg-wad-st{font-size:13px;margin:10px 0 0;min-height:1.2em}' +
    '#sg-wad .sg-wad-st.ok{color:#1a8f4c}#sg-wad .sg-wad-st.err{color:#c0392b}' +
    '@media (max-width:640px){#sg-wad .sg-wad-cols{flex-direction:column;gap:18px}#sg-wad .sg-wad-qr-col{flex:none;width:100%}#sg-wad .sg-wad-form-col{border-left:0;padding-left:0;border-top:1px solid #eee;padding-top:16px;width:100%}}';

  function build() {
    if (root) return;
    var st = document.createElement('style');
    st.id = 'sg-wad-css';
    st.textContent = CSS;
    document.head.appendChild(st);

    root = document.createElement('div');
    root.id = 'sg-wad';
    root.innerHTML =
      '<div class="sg-wad-box" role="dialog" aria-modal="true" aria-labelledby="sg-wad-t" tabindex="-1">' +
        '<button type="button" class="sg-wad-x" aria-label="Cerrar">&times;</button>' +
        '<p class="sg-wad-t" id="sg-wad-t">Escríbeme por WhatsApp</p>' +
        '<p class="sg-wad-lead">Estás en un ordenador. Elige lo que te resulte más fácil.</p>' +
        '<div class="sg-wad-cols">' +
          '<div class="sg-wad-qr-col">' +
            '<div class="sg-wad-qr" aria-hidden="true"></div>' +
            '<p class="sg-wad-help">Apunta la cámara del móvil al código y se abre WhatsApp con tu mensaje listo para enviar.</p>' +
            '<a class="sg-wad-open" data-sg-direct="1" data-cta="ordenador_abrir_whatsapp" target="_blank" rel="noopener" href="https://wa.me/34634422827">Abrir WhatsApp en este ordenador</a>' +
          '</div>' +
          '<div class="sg-wad-form-col">' +
            '<p class="sg-wad-sub">¿Prefieres que te escriba yo?</p>' +
            '<p class="sg-wad-sub2">Déjame tu nombre y tu teléfono o email.</p>' +
            '<form class="sg-wad-form" novalidate>' +
              '<input type="text" name="nombre" placeholder="Tu nombre" autocomplete="name" required>' +
              '<input type="text" name="telefono" placeholder="Tu teléfono o email" autocomplete="tel" required>' +
              '<textarea name="mensaje" placeholder="¿En qué puedo ayudarte? (opcional)"></textarea>' +
              '<input type="text" name="bot-field" class="sg-wad-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
              '<button type="submit">Enviar</button>' +
              '<p class="sg-wad-st" role="status" aria-live="polite"></p>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    box = root.querySelector('.sg-wad-box');
    qrBox = root.querySelector('.sg-wad-qr');
    openLink = root.querySelector('.sg-wad-open');
    form = root.querySelector('.sg-wad-form');
    statusEl = root.querySelector('.sg-wad-st');

    root.querySelector('.sg-wad-x').addEventListener('click', close);
    root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('open')) close();
    });
    form.addEventListener('submit', send);
  }

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.className = 'sg-wad-st' + (cls ? ' ' + cls : '');
  }

  function open(link) {
    build();
    var url = waUrl(link.getAttribute('href'));
    openLink.setAttribute('href', url);
    setStatus('', '');
    qrBox.innerHTML = 'Cargando código…';
    loadQr().then(function (qrcode) {
      var q = qrcode(0, 'M');
      q.addData(url);
      q.make();
      qrBox.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    }).catch(function () {
      qrBox.innerHTML = 'No se ha podido cargar el código. Usa el enlace de abajo o el formulario.';
    });
    lastFocus = document.activeElement;
    root.classList.add('open');
    document.documentElement.classList.add('sg-wad-on');
    box.focus();
    track('whatsapp_ordenador', {
      cta: link.getAttribute('data-cta') || (link.textContent || '').trim().slice(0, 60),
      codigo: code(),
      pagina: location.pathname
    });
  }

  function close() {
    if (!root) return;
    root.classList.remove('open');
    document.documentElement.classList.remove('sg-wad-on');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  function send(e) {
    e.preventDefault();
    var nombre = form.elements.nombre.value.trim();
    var contacto = form.elements.telefono.value.trim();
    if (!nombre || !contacto) { setStatus('Pon tu nombre y un teléfono o email.', 'err'); return; }
    var data = new URLSearchParams();
    data.append('form-name', 'contacto-widget');
    data.append('nombre', nombre);
    data.append('telefono', contacto);
    data.append('mensaje', form.elements.mensaje.value.trim());
    data.append('bot-field', form.elements['bot-field'].value);
    var gclid = '';
    try { gclid = sessionStorage.getItem('sg_gclid') || ''; } catch (err) {}
    data.append('gclid', gclid);
    data.append('origen', code());
    data.append('pagina', location.pathname + ' (ordenador)');
    var btn = form.querySelector('button');
    btn.disabled = true;
    setStatus('Enviando…', '');
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString()
    }).then(function (r) {
      if (!r.ok) throw new Error('envio');
      setStatus('Mensaje enviado. Te escribo en breve.', 'ok');
      form.reset();
      track('generate_lead', { metodo: 'formulario_ordenador', pagina: location.pathname });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: FORM_CONVERSION, value: 1.0, currency: 'EUR' });
      }
    }).catch(function () {
      setStatus('No se ha podido enviar. Prueba con el código o el enlace de WhatsApp.', 'err');
    }).then(function () { btn.disabled = false; });
  }

  // Va en la fase de captura de window, antes que el contador de clics de cada página (en document):
  // así abrir la ventana no cuenta como «Clic en WhatsApp».
  window.addEventListener('click', function (e) {
    if (!isDesktop() || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!link || link.hasAttribute('data-sg-direct')) return;
    e.preventDefault();
    e.stopPropagation();
    open(link);
  }, true);
})();
