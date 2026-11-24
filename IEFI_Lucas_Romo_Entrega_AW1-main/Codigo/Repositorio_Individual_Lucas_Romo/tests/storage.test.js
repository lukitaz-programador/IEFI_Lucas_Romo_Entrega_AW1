import test from "node:test";
import assert from "node:assert/strict";
import { leerJSON, guardarJSON, limpiarDatosLocales } from "../site/assets/js/modules/storage.js";

function almacenamientoInicial(datos = {}) {
  const mapa = new Map(Object.entries(datos));
  return {
    mapa,
    getItem(clave) { return mapa.has(clave) ? mapa.get(clave) : null; },
    setItem(clave, valor) { mapa.set(clave, String(valor)); },
    removeItem(clave) { mapa.delete(clave); }
  };
}

test("leerJSON devuelve el valor de respaldo ante JSON inválido", () => {
  const storage = almacenamientoInicial({ datos: "{ roto" });
  const avisoOriginal = console.warn;
  console.warn = () => {};
  try { assert.deepEqual(leerJSON("datos", [], storage), []); }
  finally { console.warn = avisoOriginal; }
});

test("guardarJSON serializa objetos en el almacenamiento local", () => {
  const storage = almacenamientoInicial();
  guardarJSON("carrito", [{ id: "kit-interior", cantidad: 2 }], storage);
  assert.deepEqual(JSON.parse(storage.getItem("carrito")), [{ id: "kit-interior", cantidad: 2 }]);
});

test("limpiarDatosLocales elimina las claves del carrito y las consultas", () => {
  const storage = almacenamientoInicial({
    "chiavetta-lucas-carrito-v2": "[]",
    "chiavetta-lucas-consultas-v2": "[]",
    "otra-clave": "se conserva"
  });
  limpiarDatosLocales(storage);
  assert.equal(storage.getItem("chiavetta-lucas-carrito-v2"), null);
  assert.equal(storage.getItem("chiavetta-lucas-consultas-v2"), null);
  assert.equal(storage.getItem("otra-clave"), "se conserva");
});
