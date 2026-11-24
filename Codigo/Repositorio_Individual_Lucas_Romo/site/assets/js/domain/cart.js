export const CANTIDAD_MAXIMA = 99;

export function normalizarCarrito(carrito, productos) {
  if (!Array.isArray(carrito) || !Array.isArray(productos)) return [];
  const disponibles = new Set(productos.map((producto) => producto.id));
  const cantidades = new Map();
  for (const item of carrito) {
    if (!item || typeof item.id !== "string" || !disponibles.has(item.id)) continue;
    const cantidad = Number(item.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1) continue;
    cantidades.set(item.id, Math.min(CANTIDAD_MAXIMA, (cantidades.get(item.id) ?? 0) + cantidad));
  }
  return [...cantidades.entries()].map(([id, cantidad]) => ({ id, cantidad }));
}

export function agregarAlCarrito(carrito, productoId, cantidad = 1) {
  const unidades = Number(cantidad);
  if (!Number.isInteger(unidades) || unidades < 1 || unidades > CANTIDAD_MAXIMA) {
    throw new RangeError(`La cantidad debe ser un entero entre 1 y ${CANTIDAD_MAXIMA}.`);
  }
  const resultado = carrito.map((item) => ({ ...item }));
  const existente = resultado.find((item) => item.id === productoId);
  if (existente) {
    if (existente.cantidad + unidades > CANTIDAD_MAXIMA) throw new RangeError("Se superó el límite de unidades por producto.");
    existente.cantidad += unidades;
  } else {
    resultado.push({ id: productoId, cantidad: unidades });
  }
  return resultado;
}

export function actualizarCantidad(carrito, productoId, cantidad) {
  const unidades = Number(cantidad);
  if (!Number.isInteger(unidades) || unidades < 0 || unidades > CANTIDAD_MAXIMA) {
    throw new RangeError(`La cantidad debe ser un entero entre 0 y ${CANTIDAD_MAXIMA}.`);
  }
  if (unidades === 0) return quitarDelCarrito(carrito, productoId);
  return carrito.map((item) => item.id === productoId ? { ...item, cantidad: unidades } : { ...item });
}

export function quitarDelCarrito(carrito, productoId) {
  return carrito.filter((item) => item.id !== productoId).map((item) => ({ ...item }));
}

export function calcularTotales(carrito, productos) {
  const articulos = normalizarCarrito(carrito, productos);
  const subtotal = articulos.reduce((total, item) => {
    const producto = productos.find((elemento) => elemento.id === item.id);
    return total + producto.precio * item.cantidad;
  }, 0);
  const unidades = articulos.reduce((total, item) => total + item.cantidad, 0);
  return { subtotal, total: subtotal, unidades, lineas: articulos.length };
}
