import { filtrarProductos, obtenerCategorias } from "../domain/catalog.js";
import { agregarAlCarrito, normalizarCarrito } from "../domain/cart.js";
import { obtenerProductos } from "./data.js";
import { leerCarrito, guardarCarrito } from "./storage.js";
import { crearTarjetaProducto } from "./render.js";
import { actualizarContador } from "./layout.js";
import { mostrarAviso, renderizarEstado } from "./ui.js";

export async function iniciarCatalogo() {
  const grid = document.querySelector("#productos-grid");
  if (!grid) return;
  const buscar = document.querySelector("#buscar-productos");
  const categoria = document.querySelector("#categoria-productos");
  const orden = document.querySelector("#orden-productos");
  const precioMin = document.querySelector("#precio-minimo");
  const precioMax = document.querySelector("#precio-maximo");
  const total = document.querySelector("#resultado-cantidad");
  const vacio = document.querySelector("#productos-vacios");
  const filtrosForm = document.querySelector("#filtros-catalogo");
  const filtrosActivos = document.querySelector("#filtros-aplicados");

  try {
    const productos = await obtenerProductos();
    for (const item of obtenerCategorias(productos)) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.nombre;
      categoria?.append(option);
    }
    const renderizar = () => {
      const encontrados = filtrarProductos(productos, {
        consulta: buscar?.value ?? "",
        categoria: categoria?.value ?? "todas",
        orden: orden?.value ?? "relevancia",
        precioMin: precioMin?.value ?? "",
        precioMax: precioMax?.value ?? ""
      });
      grid.replaceChildren(...encontrados.map((producto) => crearTarjetaProducto(producto)));
      renderizarFiltrosActivos(filtrosActivos, { buscar, categoria, precioMin, precioMax }, () => renderizar());
      total.textContent = `${encontrados.length} ${encontrados.length === 1 ? "producto disponible" : "productos disponibles"}`;
      vacio.hidden = encontrados.length > 0;
      grid.hidden = encontrados.length === 0;
    };
    [buscar, categoria, orden, precioMin, precioMax].forEach((control) => {
      control?.addEventListener("input", renderizar);
      control?.addEventListener("change", renderizar);
    });
    filtrosForm?.addEventListener("submit", (evento) => evento.preventDefault());
    document.querySelector("#limpiar-filtros")?.addEventListener("click", () => {
      filtrosForm?.reset();
      renderizar();
    });
    grid.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-agregar]");
      if (!boton) return;
      const producto = productos.find((item) => item.id === boton.dataset.agregar);
      if (!producto) return;
      try {
        const carrito = normalizarCarrito(leerCarrito(), productos);
        guardarCarrito(agregarAlCarrito(carrito, producto.id));
        const cantidad = leerCarrito().reduce((suma, item) => suma + item.cantidad, 0);
        actualizarContador(cantidad);
        mostrarAviso(`${producto.nombre} se agregó al carrito.`, "success");
      } catch (error) {
        mostrarAviso(error.message, "error");
      }
    });
    const consultaURL = new URLSearchParams(location.search).get("q");
    if (consultaURL && buscar) buscar.value = consultaURL;
    renderizar();
  } catch (error) {
    renderizarEstado(grid, error.message, "error");
  }
}

function renderizarFiltrosActivos(contenedor, controles, actualizar) {
  if (!contenedor) return;
  const activos = [];
  if (controles.buscar?.value.trim()) activos.push({ clave: "buscar", texto: `Búsqueda: ${controles.buscar.value.trim()}` });
  if (controles.categoria?.value && controles.categoria.value !== "todas") {
    const opcion = controles.categoria.selectedOptions[0];
    activos.push({ clave: "categoria", texto: `Categoría: ${opcion?.textContent ?? controles.categoria.value}` });
  }
  if (controles.precioMin?.value !== "") activos.push({ clave: "precioMin", texto: `Desde: $${Number(controles.precioMin.value).toLocaleString("es-AR")}` });
  if (controles.precioMax?.value !== "") activos.push({ clave: "precioMax", texto: `Hasta: $${Number(controles.precioMax.value).toLocaleString("es-AR")}` });
  contenedor.replaceChildren();
  contenedor.hidden = activos.length === 0;
  if (!activos.length) return;
  contenedor.append(document.createTextNode("Filtros aplicados: "));
  activos.forEach(({ clave, texto }) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filtro-chip";
    boton.textContent = `${texto} ×`;
    boton.setAttribute("aria-label", `Quitar filtro ${texto}`);
    boton.addEventListener("click", () => {
      if (clave === "buscar") controles.buscar.value = "";
      if (clave === "categoria") controles.categoria.value = "todas";
      if (clave === "precioMin") controles.precioMin.value = "";
      if (clave === "precioMax") controles.precioMax.value = "";
      actualizar();
    });
    contenedor.append(boton);
  });
}

export async function iniciarProductosDestacados() {
  const grid = document.querySelector("#productos-destacados");
  if (!grid) return;
  try {
    const productos = await obtenerProductos();
    grid.replaceChildren(...productos.filter((producto) => producto.destacado).slice(0, 3).map((producto) => crearTarjetaProducto(producto, { compacto: true })));
    grid.addEventListener("click", async (evento) => {
      const boton = evento.target.closest("[data-agregar]");
      if (!boton) return;
      const producto = productos.find((item) => item.id === boton.dataset.agregar);
      if (!producto) return;
      const carrito = normalizarCarrito(leerCarrito(), productos);
      guardarCarrito(agregarAlCarrito(carrito, producto.id));
      actualizarContador(leerCarrito().reduce((suma, item) => suma + item.cantidad, 0));
      mostrarAviso(`${producto.nombre} se agregó al carrito.`, "success");
    });
  } catch (error) { renderizarEstado(grid, error.message, "error"); }
}
