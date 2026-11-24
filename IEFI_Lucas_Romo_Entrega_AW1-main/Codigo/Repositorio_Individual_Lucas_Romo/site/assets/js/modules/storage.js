const CLAVE_CARRITO = "chiavetta-lucas-carrito-v2";
const CLAVE_CONSULTAS = "chiavetta-lucas-consultas-v2";

export function leerJSON(clave, respaldo, almacenamiento = window.localStorage) {
  try {
    const valor = almacenamiento.getItem(clave);
    return valor === null ? respaldo : JSON.parse(valor);
  } catch (error) {
    console.warn(`No se pudo leer ${clave}.`, error);
    return respaldo;
  }
}

export function guardarJSON(clave, valor, almacenamiento = window.localStorage) {
  almacenamiento.setItem(clave, JSON.stringify(valor));
}

export function leerCarrito() {
  const resultado = leerJSON(CLAVE_CARRITO, []);
  return Array.isArray(resultado) ? resultado : [];
}

export function guardarCarrito(carrito) {
  guardarJSON(CLAVE_CARRITO, carrito);
}

export function guardarConsulta(consulta) {
  const anteriores = leerJSON(CLAVE_CONSULTAS, []);
  const lista = Array.isArray(anteriores) ? anteriores : [];
  lista.push({ ...consulta, fechaLocal: new Date().toISOString() });
  guardarJSON(CLAVE_CONSULTAS, lista.slice(-50));
}

export function limpiarDatosLocales(almacenamiento = window.localStorage) {
  almacenamiento.removeItem(CLAVE_CARRITO);
  almacenamiento.removeItem(CLAVE_CONSULTAS);
}
