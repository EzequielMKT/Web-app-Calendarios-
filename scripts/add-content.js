import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
const [type, title, module, source, description = ''] = process.argv.slice(2);
if (!['pdf', 'video'].includes(type) || !title || !module || !source) {
  console.error('Uso: npm run content -- pdf|video "Título" "Módulo" "archivo.pdf o URL" "Descripción opcional"');
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, '../public');
const catalog = JSON.parse(await readFile(path.join(root, 'catalog.json'), 'utf8'));
let url;
if (/^https?:\/\//i.test(source)) {
  url = new URL(source).href;
  if (type === 'video') {
    const u = new URL(url);
    const id = u.hostname === 'youtu.be' ? u.pathname.split('/')[1] : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(u.hostname) ? (u.pathname === '/watch' ? u.searchParams.get('v') : /^\/(embed|shorts|live)\//.test(u.pathname) ? u.pathname.split('/')[2] : null) : null;
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Usa un enlace válido de YouTube');
  }
} else if (type === 'pdf') {
  const data = await readFile(source);
  if (data.subarray(0, 5).toString() !== '%PDF-') throw new Error('El archivo no es un PDF válido');
  const filename = randomUUID() + '.pdf';
  await mkdir(path.join(root, 'materials'), { recursive: true });
  await copyFile(source, path.join(root, 'materials', filename));
  url = '/materials/' + filename;
} else { throw new Error('La videoclase requiere una URL HTTP o HTTPS'); }
catalog.push({ id: randomUUID(), type, title, module, url, description });
await writeFile(path.join(root, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
console.log('Contenido añadido al catálogo público.');
