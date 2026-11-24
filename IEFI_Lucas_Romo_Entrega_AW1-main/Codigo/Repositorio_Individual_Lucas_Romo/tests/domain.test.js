import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrarProductos } from '../site/assets/js/domain/catalog.js';
import { agregarAlCarrito, actualizarCantidad, calcularTotales, normalizarCarrito, quitarDelCarrito } from '../site/assets/js/domain/cart.js';
import { crearMensajePedido, crearUrlWhatsApp, validarDatosCliente } from '../site/assets/js/domain/orders.js';

const productos = [
  { id: 'cera', nombre: 'Cera Carnauba', categoria: 'proteccion', categoriaNombre: 'Protección', descripcion: 'Brillo de pintura', precio: 45000, destacado: true },
  { id: 'kit', nombre: 'Kit Interior', categoria: 'interior', categoriaNombre: 'Interior', descripcion: 'Acondicionador de cueros', precio: 21000, destacado: false },
  { id: 'spray', nombre: 'Detail Spray', categoria: 'proteccion', categoriaNombre: 'Protección', descripcion: 'Sellador rápido', precio: 18500, destacado: false }
];

test('filtra productos por texto sin distinguir tildes ni mayúsculas', () => {
  const resultado = filtrarProductos(productos, { consulta: 'CARNAUBA' });
  assert.deepEqual(resultado.map((item) => item.id), ['cera']);
});

test('combina categoría y rango de precios', () => {
  const resultado = filtrarProductos(productos, { categoria: 'proteccion', precioMin: 20000, precioMax: 50000 });
  assert.deepEqual(resultado.map((item) => item.id), ['cera']);
});

test('ordena por precio ascendente y descendente', () => {
  assert.deepEqual(filtrarProductos(productos, { orden: 'precio-asc' }).map((item) => item.id), ['spray', 'kit', 'cera']);
  assert.deepEqual(filtrarProductos(productos, { orden: 'precio-desc' }).map((item) => item.id), ['cera', 'kit', 'spray']);
});

test('agrega un producto nuevo sin mutar el carrito original', () => {
  const carrito = [{ id: 'cera', cantidad: 1 }];
  const actualizado = agregarAlCarrito(carrito, 'kit', 2);
  assert.equal(carrito.length, 1);
  assert.deepEqual(actualizado, [{ id: 'cera', cantidad: 1 }, { id: 'kit', cantidad: 2 }]);
});

test('incrementa productos existentes y aplica el límite de unidades', () => {
  assert.deepEqual(agregarAlCarrito([{ id: 'kit', cantidad: 2 }], 'kit', 3), [{ id: 'kit', cantidad: 5 }]);
  assert.throws(() => agregarAlCarrito([{ id: 'kit', cantidad: 98 }], 'kit', 2), RangeError);
  assert.throws(() => agregarAlCarrito([], 'kit', 0), RangeError);
});

test('normaliza el carrito: descarta ids desconocidos y consolida duplicados', () => {
  const entrada = [{ id: 'cera', cantidad: 2 }, { id: 'cera', cantidad: 3 }, { id: 'inexistente', cantidad: 1 }, { id: 'kit', cantidad: -1 }];
  assert.deepEqual(normalizarCarrito(entrada, productos), [{ id: 'cera', cantidad: 5 }]);
});

test('actualiza cantidades y elimina una línea cuando la cantidad llega a cero', () => {
  const carrito = [{ id: 'cera', cantidad: 2 }, { id: 'kit', cantidad: 1 }];
  assert.deepEqual(actualizarCantidad(carrito, 'cera', 4), [{ id: 'cera', cantidad: 4 }, { id: 'kit', cantidad: 1 }]);
  assert.deepEqual(actualizarCantidad(carrito, 'cera', 0), [{ id: 'kit', cantidad: 1 }]);
  assert.deepEqual(quitarDelCarrito(carrito, 'kit'), [{ id: 'cera', cantidad: 2 }]);
});

test('calcula subtotal, total de productos, unidades y líneas sin impuestos inventados', () => {
  const totales = calcularTotales([{ id: 'cera', cantidad: 2 }, { id: 'kit', cantidad: 1 }], productos);
  assert.deepEqual(totales, { subtotal: 111000, total: 111000, unidades: 3, lineas: 2 });
});

test('valida datos obligatorios y formatos de contacto', () => {
  assert.deepEqual(validarDatosCliente({ nombre: 'Lucas Romo', telefono: '+54 351 309 0597', email: 'lucas@example.com' }), {});
  assert.ok(validarDatosCliente({ nombre: 'Lu', telefono: '123', email: 'correo' }).nombre);
  assert.ok(validarDatosCliente({ nombre: 'Lucas Romo', telefono: '123' }).telefono);
});

test('construye un enlace de WhatsApp con texto codificado', () => {
  const url = crearUrlWhatsApp('+54 351 309 0597', 'Hola, quiero consultar');
  assert.match(url, /^https:\/\/wa\.me\/543513090597\?text=/);
  assert.ok(url.includes('Hola%2C%20quiero%20consultar'));
});

test('genera un mensaje de pedido con referencias, contacto e importes', () => {
  const mensaje = crearMensajePedido({ numero: 'CD-1234', cliente: { nombre: 'Lucas', telefono: '3511234567' }, articulos: [{ id: 'kit', cantidad: 2 }], totales: { subtotal: 42000, total: 42000 } }, productos);
  assert.match(mensaje, /CD-1234/);
  assert.match(mensaje, /Kit Interior/);
  assert.match(mensaje, /42\.000/);
});
