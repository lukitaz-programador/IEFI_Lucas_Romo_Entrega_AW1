import { obtenerServicios } from "./data.js";
import { crearTarjetaServicio } from "./render.js";
import { renderizarEstado, crearElemento } from "./ui.js";

export async function iniciarServicios() {
  const grid = document.querySelector("#servicios-grid");
  if (!grid) return;
  const filtro = document.querySelector("#filtro-servicios");
  try {
    const servicios = await obtenerServicios();
    const categorias = [...new Map(servicios.map((item) => [item.categoria, item.categoriaNombre])).entries()];
    categorias.forEach(([id, nombre]) => {
      const opt = crearElemento("option", "", nombre); opt.value = id; filtro?.append(opt);
    });
    const renderizar = () => {
      const clave = filtro?.value ?? "todas";
      const resultado = servicios.filter((item) => clave === "todas" || item.categoria === clave);
      grid.replaceChildren(...resultado.map(crearTarjetaServicio));
      document.querySelector("#servicios-total").textContent = `${resultado.length} servicios en esta categoría`;
    };
    filtro?.addEventListener("change", renderizar);
    renderizar();
  } catch (error) { renderizarEstado(grid, error.message, "error"); }
}

export async function iniciarDetalleServicio() {
  const contenedor = document.querySelector("#detalle-servicio");
  if (!contenedor) return;
  try {
    const servicios = await obtenerServicios();
    const id = new URLSearchParams(location.search).get("id") || "proteccion-ceramica";
    const servicio = servicios.find((item) => item.id === id);
    if (!servicio) { renderizarEstado(contenedor, "No encontramos ese servicio. Volvé a la sección de servicios.", "error"); return; }
    document.title = `${servicio.nombre} | Chiavetta Detailing`;
    document.querySelector("#servicio-foto").src = servicio.imagen;
    document.querySelector("#servicio-foto").alt = servicio.alt;
    document.querySelector("#servicio-categoria").textContent = servicio.categoriaNombre;
    document.querySelector("#servicio-nombre").textContent = servicio.nombre;
    document.querySelector("#servicio-descripcion").textContent = servicio.descripcion;
    const lista = document.querySelector("#servicio-incluye");
    lista.replaceChildren(...servicio.incluye.map((texto) => crearElemento("li", "", texto)));
    const btn = document.querySelector("#solicitar-servicio");
    btn.href = `./reserva.html?servicio=${encodeURIComponent(servicio.id)}`;
  } catch (error) { renderizarEstado(contenedor, error.message, "error"); }
}
