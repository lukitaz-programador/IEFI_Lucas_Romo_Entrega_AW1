const cache = new Map();

export async function obtenerJSON(ruta, { actualizar = false } = {}) {
  if (!actualizar && cache.has(ruta)) return cache.get(ruta);
  try {
    const respuesta = await fetch(ruta, { headers: { Accept: "application/json" }, cache: actualizar ? "reload" : "default" });
    if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta}: HTTP ${respuesta.status}.`);
    const datos = await respuesta.json();
    if (!Array.isArray(datos)) throw new TypeError(`El recurso ${ruta} debe contener un arreglo JSON.`);
    cache.set(ruta, datos);
    return datos;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron cargar los datos. Comprobá la conexión e intentá nuevamente.", { cause: error });
  }
}

export const obtenerProductos = (opciones) => obtenerJSON("./data/productos.json", opciones);
export const obtenerServicios = (opciones) => obtenerJSON("./data/servicios.json", opciones);
