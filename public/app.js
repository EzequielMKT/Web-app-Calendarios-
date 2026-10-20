const $ = s => document.querySelector(s);
let items = [], filter = 'all';
function safeUrl(value) {
  const url = new URL(value, location.origin);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('URL inválida');
  return url.href;
}
function render() {
  const matches = items.filter(i => (filter === 'all' || i.type === filter) && (!$('#module').value || i.module === $('#module').value) && `${i.title} ${i.module} ${i.description}`.toLocaleLowerCase('es').includes($('#search').value.toLocaleLowerCase('es')));
  $('#cards').replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'empty';
    const title = document.createElement('h3'); title.textContent = items.length ? 'No se encontraron contenidos' : 'Próximamente, nuevas ideas para aprender';
    const p = document.createElement('p'); p.textContent = items.length ? 'Prueba otra búsqueda o selecciona otro módulo.' : 'Los materiales y las videoclases aparecerán aquí cuando estén publicados.';
    empty.append(title, p); $('#cards').append(empty);
  }
  matches.forEach(item => {
    const card = document.createElement('article'); card.className = `card ${item.type}${item.locked ? " locked" : ""}`;
    card.innerHTML = '<div class="cover" aria-hidden="true"></div><div class="card-body"><span class="tag"></span><h3></h3><p></p><div class="actions"><button class="open"></button></div></div>';
    card.querySelector('.cover').textContent = item.locked ? '🔒' : item.type === 'pdf' ? 'PDF ↗' : '▶';
    card.querySelector('.tag').textContent = item.module;
    card.querySelector('h3').textContent = item.title;
    card.querySelector('p').textContent = item.description || (item.type === 'pdf' ? 'Material de apoyo en PDF' : 'Aprende con esta videoclase');
    const open = card.querySelector('.open'); open.textContent = item.locked ? (item.plan === 'diamante' ? '🔒 Plan Diamante' : '🔒 Acceso completo') : item.type === 'pdf' ? 'Abrir material ↗' : 'Ver clase ↗';
    open.onclick = () => {
      if (item.locked) {
        $('#access-title').textContent = item.plan === 'diamante' ? 'Exclusivo del Plan Diamante' : 'Desbloquea el resto de los materiales';
        $('#access-message').textContent = item.plan === 'diamante' ? 'La videoclase está disponible únicamente para quienes pagan el Plan Diamante.' : 'Realiza el pago para acceder al resto de los materiales.';
        $('#access-dialog').showModal();
        return;
      }
      if (item.type === 'pdf') { window.open(safeUrl(item.url), '_blank', 'noopener,noreferrer'); return; }
      const iframe = document.createElement('iframe');
      const source = new URL(item.url);
      const timestamp = source.searchParams.get('t') || source.searchParams.get('start') || '0';
      const match = timestamp.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
      const start = match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + youtubeId(item.url) + '?start=' + start;
      iframe.title = item.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      $('#player-title').textContent = item.title;
      $('#player').replaceChildren(iframe);
      $('#player-dialog').showModal();
    };
    $('#cards').append(card);
  });
}
$('#add').onclick = () => $('.library').scrollIntoView({ behavior: 'smooth' });
$('#search').oninput = render; $('#module').onchange = render;
document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { filter = b.dataset.filter; document.querySelectorAll('[data-filter]').forEach(x => x.classList.toggle('selected', x === b)); render(); });
(async () => {
  try {
    const response = await fetch('/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Catálogo no disponible');
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('Catálogo inválido');
    items = catalog.map(item => {
      if (!['pdf', 'video'].includes(item.type) || typeof item.title !== 'string' || typeof item.module !== 'string') throw new Error('Contenido inválido');
      if (item.locked) return { ...item, url: undefined };
      if (item.type === 'video') youtubeId(item.url);
      return { ...item, url: safeUrl(item.url) };
    });
    [...new Set(items.map(i => i.module))].sort().forEach(m => $('#module').add(new Option(m, m)));
    $('#count').textContent = '50 calendarios · 10 disponibles y 40 bloqueados · Videoclase exclusiva del Plan Diamante';
    render();
  } catch { $('#status').textContent = 'No se pudo cargar la biblioteca. Inténtalo de nuevo más tarde.'; }
})();

function youtubeId(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  let id;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
  }
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Enlace de YouTube inválido');
  return id;
}
$('#close-player').onclick = () => $('#player-dialog').close();
$('#player-dialog').addEventListener('close', () => $('#player').replaceChildren());

$('#close-access').onclick = () => $('#access-dialog').close();
