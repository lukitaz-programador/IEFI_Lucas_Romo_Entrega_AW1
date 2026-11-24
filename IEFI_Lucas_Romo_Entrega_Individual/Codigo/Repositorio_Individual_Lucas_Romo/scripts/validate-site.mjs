import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const site = resolve(root, 'site');
const htmlFiles = [];
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) await walk(path);
    else if (extname(path) === '.html') htmlFiles.push(path);
  }
}
await walk(site);
const errores = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
  const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of duplicados) errores.push(`${relative(site, file)}: id duplicado "${id}"`);
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!ref || /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
    const limpio = ref.split('#')[0].split('?')[0];
    if (!limpio) continue;
    const destino = resolve(dirname(file), decodeURIComponent(limpio));
    try { await access(destino); }
    catch { errores.push(`${relative(site, file)}: recurso local inexistente "${ref}"`); }
  }
  for (const m of html.matchAll(/href=["']#([^"']+)["']/g)) {
    if (!ids.includes(m[1])) errores.push(`${relative(site, file)}: ancla sin destino "#${m[1]}"`);
  }
}
const layoutPath = resolve(root, 'site/assets/js/modules/layout.js');
const layoutSource = await readFile(layoutPath, 'utf8');
for (const match of layoutSource.matchAll(/["']([a-z0-9-]+\.html)["']/gi)) {
  const destino = resolve(site, match[1]);
  try { await access(destino); }
  catch { errores.push(`layout.js: ruta dinámica inexistente "${match[1]}"`); }
}
if (errores.length) {
  console.error(`Se encontraron ${errores.length} problemas de referencias:`);
  errores.forEach((e) => console.error(`- ${e}`));
  process.exitCode = 1;
} else console.log(`HTML validado: ${htmlFiles.length} páginas, referencias locales resueltas e ids sin duplicados.`);
