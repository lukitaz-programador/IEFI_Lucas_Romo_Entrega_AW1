import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../site', import.meta.url)));
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    const rutaURL = new URL(req.url, `http://${req.headers.host}`);
    let ruta = decodeURIComponent(rutaURL.pathname);
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = resolve(root, `.${ruta}`);
    if (archivo !== root && !archivo.startsWith(root + sep)) throw new Error('Ruta inválida');
    const info = await stat(archivo);
    if (!info.isFile()) throw new Error('No es un archivo');
    res.writeHead(200, { 'Content-Type': tipos[extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(archivo));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(resolve(root, '404.html')));
  }
}).listen(port, () => console.log(`Chiavetta Detailing disponible en http://localhost:${port}`));
