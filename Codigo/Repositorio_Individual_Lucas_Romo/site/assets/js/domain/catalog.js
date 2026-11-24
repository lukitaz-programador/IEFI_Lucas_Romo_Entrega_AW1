export function normalizarTexto(valor = "") {
  return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es-AR");
}

export function filtrarProductos(productos, filtros = {}) {
  const consulta = normalizarTexto(filtros.consulta ?? "");
  const categoria = filtros.categoria ?? "todas";
  const precioMin = filtros.precioMin === "" || filtros.precioMin == null ? 0 : Number(filtros.precioMin);
  const precioMax = filtros.precioMax === "" || filtros.precioMax == null ? Infinity : Number(filtros.precioMax);
  const orden = filtros.orden ?? "relevancia";

  const resultado = productos.filter((producto) => {
    const texto = normalizarTexto(`${producto.nombre} ${producto.descripcion} ${producto.categoriaNombre}`);
    return texto.includes(consulta)
      && (categoria === "todas" || producto.categoria === categoria)
      && producto.precio >= (Number.isFinite(precioMin) ? precioMin : 0)
      && producto.precio <= (Number.isFinite(precioMax) ? precioMax : Infinity);
  });

  const comparadores = {
    "precio-asc": (a, b) => a.precio - b.precio,
    "precio-desc": (a, b) => b.precio - a.precio,
    "nombre-asc": (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    relevancia: (a, b) => Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)) || a.nombre.localeCompare(b.nombre, "es")
  };
  return resultado.sort(comparadores[orden] ?? comparadores.relevancia);
}

export function obtenerCategorias(productos) {
  return [...new Map(productos.map((producto) => [producto.categoria, producto.categoriaNombre])).entries()]
    .map(([id, nombre]) => ({ id, nombre }));
}
