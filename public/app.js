const $ = selector => document.querySelector(selector);
let items = [], filter = 'all';
let config = { demoMode: true, payment: { currency: 'COP', methods: [] } };
const money = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
function safeUrl(value) {
  if (typeof value !== 'string' || !value) throw new Error('Falta el enlace');
  const url = new URL(value, location.origin);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Enlace inválido');
  return url.href;
}
function showInfo(title, message) {
  $('#info-title').textContent = title; $('#info-message').textContent = message;
  $('#info-dialog').showModal();
}
function showAccess(diamond = false) {
  $('#access-title').textContent = diamond ? 'Tu siguiente paso: Plan Diamante' : 'Tu colección completa te espera';
  $('#access-message').textContent = diamond ? 'La videoclase está disponible únicamente para quienes pagan el Plan Diamante.' : 'Realiza el pago para acceder al resto de los materiales: los 40 calendarios de la colección completa.';
  const details = $('#payment-details'); details.replaceChildren();
  const price = diamond ? config.payment?.diamondPrice : config.payment?.fullPrice;
  if (price != null) {
    const amount = document.createElement('p'); amount.className = 'modal-price'; amount.textContent = `${money(price)} COP${config.demoMode ? ' · Valor de ejemplo' : ''}`; details.append(amount);
  }
  if (config.demoMode) {
    const label = document.createElement('p'); label.className = 'demo-label'; label.textContent = 'DEMOSTRACIÓN · NO REALICES NINGÚN PAGO'; details.append(label);
  }
  for (const method of config.payment?.methods || []) {
    const box = document.createElement('div'); box.className = 'payment-method';
    const name = document.createElement('strong'); name.textContent = method.name;
    const number = document.createElement('span'); number.textContent = method.account;
    const recipient = document.createElement('small'); recipient.textContent = method.recipient;
    box.append(name, number, recipient);
    if (!config.demoMode && method.account) {
      const copy = document.createElement('button'); copy.className = 'copy-button'; copy.textContent = 'Copiar';
      copy.onclick = async () => { try { await navigator.clipboard.writeText(method.account); copy.textContent = 'Copiado'; } catch { copy.textContent = 'Selecciona y copia el dato'; } };
      box.append(copy);
    }
    details.append(box);
  }
  $('#access-note').textContent = config.demoMode ? 'Estos datos son ficticios. Los datos reales de pago y contacto se publicarán antes de habilitar las compras.' : 'Después de realizar el pago, envía el comprobante por WhatsApp para la confirmación manual. Cerrar esta ventana no desbloquea materiales.';
  $('#payment-contact').textContent = config.demoMode ? 'WhatsApp · contacto de demostración' : 'Enviar comprobante por WhatsApp →';
  $('#access-dialog').showModal();
}
function pdfActions(item) {
  const actions = document.createElement('div'); actions.className = 'actions';
  const view = document.createElement('a'); view.className = 'button view'; view.textContent = 'Ver PDF →'; view.href = item.url;
  view.onclick = event => { event.preventDefault(); openPdf(item); };
  const download = document.createElement('a'); download.className = 'button download'; download.textContent = 'Descargar ↓'; download.href = item.url;
  download.download = item.title.replace(/[^\p{L}\p{N} _-]/gu, '') + '.pdf';
  actions.append(view, download); return actions;
}
function openPdf(item) {
  $('#pdf-title').textContent = item.title;
  $('#pdf-download').href = item.url;
  $('#pdf-download').download = item.title + '.pdf';
  const iframe = document.createElement('iframe'); iframe.src = item.url; iframe.title = item.title;
  $('#pdf-frame').replaceChildren(iframe); $('#pdf-dialog').showModal();
}
function render() {
  const query = $('#search').value.trim().toLocaleLowerCase('es');
  const matches = items.filter(item => item.type === 'pdf' && item.module === 'Calendarios 2027' && (filter === 'all' || (filter === 'available' && !item.locked) || (filter === 'locked' && item.locked)) && `${item.title} ${item.description}`.toLocaleLowerCase('es').includes(query));
  $('#cards').replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'empty'; empty.textContent = 'No encontramos ese calendario. Prueba otra búsqueda.'; $('#cards').append(empty);
  }
  for (const item of matches) {
    const card = document.createElement('article'); card.className = `card ${item.locked ? 'locked' : 'available'}`;
    const cover = document.createElement('div'); cover.className = 'cover';
    if (item.locked && !item.mockup) {
      const art = document.createElement('div'); art.className = 'locked-art'; art.setAttribute('aria-hidden', 'true');
      const mark = document.createElement('span'); mark.className = 'lock-mark'; mark.textContent = '🔒';
      const number = document.createElement('span'); number.textContent = item.title.match(/\d+/)?.[0] || '2027';
      art.append(mark, number); cover.append(art);
    } else if (item.mockup || item.preview) {
      if (item.mockup) { card.classList.add('has-mockup'); cover.classList.add('mockup-cover'); }
      const img = document.createElement('img'); img.src = safeUrl(item.mockup || item.preview); img.alt = item.mockup ? `Mockup ilustrativo de ${item.title}` : `Vista previa: ${item.title}`; img.loading = 'lazy'; img.width = 300; img.height = 300; cover.append(img);
    }
    if (item.locked && item.mockup) {
      const lockBadge = document.createElement('span'); lockBadge.className = 'mockup-lock-badge'; lockBadge.textContent = '🔒 Bloqueado'; cover.append(lockBadge);
    }
    const availability = document.createElement('span'); availability.className = 'availability'; availability.textContent = item.locked ? '🔒 ACCESO COMPLETO' : 'DISPONIBLE'; cover.append(availability);
    const body = document.createElement('div'); body.className = 'card-body';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'COLECCIÓN 2027 · PDF';
    const title = document.createElement('h3'); title.textContent = item.title.replace(/\s*(?:·\s*)?2027$/, '');
    const desc = document.createElement('p'); desc.textContent = item.locked ? (item.mockup ? 'Mockup ilustrativo · Acceso con pago.' : 'Diseño por anunciar · Acceso con pago.') : item.mockup ? 'Mockup ilustrativo · Archivo PDF' : 'Consulta el diseño o guárdalo para imprimir.';
    body.append(tag, title, desc);
    if (item.locked) {
      const actions = document.createElement('div'); actions.className = 'actions';
      const unlock = document.createElement('button'); unlock.className = 'button unlock'; unlock.textContent = '🔒 Desbloquear diseño'; unlock.onclick = () => showAccess(); actions.append(unlock); body.append(actions);
    } else { body.append(pdfActions(item)); }
    card.append(cover, body); $('#cards').append(card);
  }
  $('#count').textContent = query || filter !== 'all' ? `${matches.length} calendarios en esta selección · 50 en la colección` : '50 diseños · 10 disponibles para empezar · 40 con acceso completo';
}
function renderCommercialInfo() {
  document.querySelectorAll('.plans .demo-label').forEach(label => { label.hidden = !config.demoMode; });
  const preview = $('.payment-preview'); preview.replaceChildren();
  const label = document.createElement('span'); label.className = 'demo-label'; label.textContent = config.demoMode ? 'DATOS FICTICIOS · NO REALIZAR PAGOS' : 'MEDIOS DE PAGO'; preview.append(label);
  const first = config.payment?.methods?.[0];
  if (first) {
    const method = document.createElement('p'); method.textContent = `${first.name} · ${first.account}`;
    const recipient = document.createElement('p'); recipient.textContent = first.recipient; preview.append(method, recipient);
  }
  const button = document.createElement('button'); button.className = 'text-link'; button.textContent = config.demoMode ? 'Ver todos los datos de ejemplo →' : 'Ver datos de pago →'; button.onclick = () => showAccess(); preview.append(button);
  $('.payment-note').textContent = config.demoMode ? 'Los valores y los datos mostrados son de ejemplo. Antes de habilitar las compras se publicarán los datos reales. La confirmación del pago será manual por WhatsApp.' : 'Después de pagar, envía el comprobante por WhatsApp para la confirmación manual de tu compra.';
}
function renderExtras() {
  $('#guide').replaceChildren();
  const guide = items.find(item => item.type === 'pdf' && item.module !== 'Calendarios 2027');
  if (guide) {
    const card = document.createElement('article'); card.className = 'guide-card';
    if (guide.preview) { const img = document.createElement('img'); img.src = safeUrl(guide.preview); img.alt = 'Vista previa de la guía de impresión'; img.loading = 'lazy'; card.append(img); }
    const copy = document.createElement('div'); copy.className = 'guide-copy';
    const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = 'ANTES DE EMPEZAR';
    const title = document.createElement('h3'); title.textContent = guide.title;
    const p = document.createElement('p'); p.textContent = 'Ten tu guía a mano al preparar tus impresiones.';
    copy.append(label, title, p, pdfActions(guide)); card.append(copy); $('#guide').append(card);
  }
  $('#video-card').replaceChildren();
  const video = items.find(item => item.type === 'video');
  if (video) {
    const card = document.createElement('article'); card.className = 'video-feature';
    const stage = document.createElement('div'); stage.className = 'video-stage';
    const lock = document.createElement('div'); lock.className = 'video-lock'; lock.textContent = video.locked ? '🔒' : '▶';
    const stageLabel = document.createElement('span'); stageLabel.textContent = 'TU ESPACIO PARA APRENDER'; stage.append(lock, stageLabel);
    const copy = document.createElement('div'); copy.className = 'video-copy';
    const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = '✧ EXCLUSIVO DEL PLAN DIAMANTE';
    const h3 = document.createElement('h3'); h3.textContent = 'Una clase para acompañar tus ideas.';
    const p = document.createElement('p'); p.textContent = 'Mira la videoclase sin salir de tu espacio creativo. Este contenido requiere el Plan Diamante.';
    const button = document.createElement('button'); button.className = 'button primary'; button.textContent = video.locked ? '🔒 Acceder con Plan Diamante' : 'Ver videoclase ▶'; button.onclick = () => video.locked ? showAccess(true) : openVideo(video);
    copy.append(label, h3, p, button); card.append(stage, copy); $('#video-card').append(card);
  }
  const previews = items.filter(item => !item.locked && (item.mockup || item.preview) && item.module === 'Calendarios 2027');
  for (const [selector, item] of [['#hero-front', previews[0]], ['#hero-back', previews[4] || previews[1]]]) {
    if (!item) continue;
    const img = $(selector); img.src = safeUrl(item.mockup || item.preview);
    img.alt = item.mockup ? `Mockup ilustrativo de ${item.title}` : `Vista previa de ${item.title}`;
    img.closest('.hero-preview').classList.toggle('has-mockup', Boolean(item.mockup));
  }
}
function youtubeId(value) {
  const url = new URL(value); const host = url.hostname.toLowerCase();
  const id = host === 'youtu.be' ? url.pathname.split('/')[1] : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host) ? (url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null) : null;
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Enlace de YouTube inválido'); return id;
}
function openVideo(item) {
  const source = new URL(item.url); const timestamp = source.searchParams.get('t') || source.searchParams.get('start') || '0';
  const match = timestamp.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  const start = match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
  const iframe = document.createElement('iframe'); iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId(item.url)}?start=${start}`;
  iframe.title = item.title; iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'; iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  $('#player-title').textContent = item.title; $('#player').replaceChildren(iframe); $('#player-dialog').showModal();
}
$('#search').oninput = render;
document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); }); render();
});
document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => document.getElementById(button.dataset.close).close());
$('#pdf-dialog').addEventListener('close', () => $('#pdf-frame').replaceChildren());
$('#player-dialog').addEventListener('close', () => $('#player').replaceChildren());
document.querySelectorAll('[data-action]').forEach(button => button.onclick = () => {
  if (button.dataset.action === 'group') {
    if (!config.demoMode && config.whatsappGroupUrl) window.open(safeUrl(config.whatsappGroupUrl), '_blank', 'noopener,noreferrer');
    else showInfo('Tu comunidad en WhatsApp', 'Botón de demostración. El enlace real del grupo estará disponible próximamente.');
  } else showAccess(button.dataset.action === 'diamond');
});
$('#payment-contact').onclick = () => {
  if (config.demoMode || !config.whatsappContact) { showInfo('Contacto de demostración', 'El número de WhatsApp todavía no está configurado. No realices pagos a los datos de ejemplo.'); return; }
  const phone = String(config.whatsappContact).replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(phone)) { showInfo('Contacto no disponible', 'El número de contacto se está actualizando.'); return; }
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hola, quiero información sobre mi acceso a los calendarios 2027.')}`, '_blank', 'noopener,noreferrer');
};
(async () => {
  try {
    const [catalogResponse, configResponse] = await Promise.all([fetch('/catalog.json', { cache: 'no-store' }), fetch('/site-config.json', { cache: 'no-store' })]);
    if (!catalogResponse.ok || !configResponse.ok) throw new Error('No disponible');
    const [catalog, settings] = await Promise.all([catalogResponse.json(), configResponse.json()]);
    config = settings;
    if (!Array.isArray(catalog)) throw new Error('Catálogo inválido');
    items = catalog.map(item => {
      if (!['pdf', 'video'].includes(item.type) || typeof item.title !== 'string' || typeof item.module !== 'string') throw new Error('Contenido inválido');
      if (item.locked) return { ...item, url: undefined };
      if (item.type === 'video') youtubeId(item.url);
      return { ...item, url: safeUrl(item.url) };
    });
    for (const el of document.querySelectorAll('[data-price]')) {
      const value = config.payment?.[el.dataset.price]; el.textContent = value == null ? 'Por confirmar' : `${money(value)} COP`;
    }
    render(); renderExtras(); renderCommercialInfo();
  } catch { $('#status').textContent = 'No pudimos cargar los materiales. Recarga la página para intentarlo de nuevo.'; }
})();
