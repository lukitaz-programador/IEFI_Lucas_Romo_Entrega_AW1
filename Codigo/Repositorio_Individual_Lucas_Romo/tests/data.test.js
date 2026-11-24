import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = async (ruta) => JSON.parse(await readFile(resolve(raiz, ruta), 'utf8'));

test('el catálogo JSON contiene productos válidos con ids únicos', async () => {
  const productos = await leer('site/data/productos.json');
  assert.ok(productos.length >= 4);
  assert.equal(new Set(productos.map((p) => p.id)).size, productos.length);
  for (const producto of productos) {
    assert.ok(producto.nombre && producto.descripcion && producto.categoria);
    assert.ok(Number.isFinite(producto.precio) && producto.precio > 0);
    await access(resolve(raiz, 'site', producto.imagen.replace(/^\.\//, '')));
  }
});

test('los servicios incluyen categoría, alcance e imágenes accesibles', async () => {
  const servicios = await leer('site/data/servicios.json');
  assert.ok(servicios.length >= 8);
  assert.equal(new Set(servicios.map((s) => s.id)).size, servicios.length);
  for (const servicio of servicios) {
    assert.ok(servicio.nombre && servicio.descripcion && servicio.categoria);
    assert.ok(Array.isArray(servicio.incluye) && servicio.incluye.length > 0);
    await access(resolve(raiz, 'site', servicio.imagen.replace(/^\.\//, '')));
  }
});
