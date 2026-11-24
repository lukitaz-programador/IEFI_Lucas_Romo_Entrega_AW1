import { obtenerProductos } from "./data.js";
import { precioARS } from "./format.js";
import { leerCarrito, guardarCarrito } from "./storage.js";
import { agregarAlCarrito, normalizarCarrito } from "../domain/cart.js";
import { actualizarContador } from "./layout.js";
import { mostrarAviso, renderizarEstado, crearElemento } from "./ui.js";

export async function iniciarDetalleProducto() {
  const contenedor = document.querySelector("#detalle-producto");
  if (!contenedor) return;
  try {
    const productos = await obtenerProductos();
    const id = new URLSearchParams(location.search).get("id") || "cera-carnauba";
    const producto = productos.find((item) => item.id === id);
    if (!producto) {
      renderizarEstado(contenedor, "No encontramos ese producto. Volvé al catálogo para elegir otra opción.", "error");
      return;
    }
    document.title = `${producto.nombre} | Chiavetta Detailing`;
    const imagen = document.querySelector("#producto-imagen");
    imagen.src = producto.imagen;
    imagen.alt = producto.alt || producto.nombre;
    document.querySelector("#producto-categoria").textContent = producto.categoriaNombre;
    document.querySelector("#producto-nombre").textContent = producto.nombre;
    document.querySelector("#producto-descripcion").textContent = producto.descripcion;
    document.querySelector("#producto-detalle-texto").textContent = producto.detalle;
    document.querySelector("#producto-precio").textContent = precioARS(producto.precio);
    const atributos = document.querySelector("#producto-atributos");
    atributos.replaceChildren(...producto.atributos.map((texto) => crearElemento("li", "", texto)));
    const formulario = document.querySelector("#form-agregar-producto");
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const cantidad = Number(new FormData(formulario).get("cantidad"));
      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
        formulario.querySelector("[name=cantidad]").setCustomValidity("Ingresá una cantidad entera entre 1 y 99.");
        formulario.querySelector("[name=cantidad]").reportValidity();
        return;
      }
      try {
        const carrito = normalizarCarrito(leerCarrito(), productos);
        guardarCarrito(agregarAlCarrito(carrito, producto.id, cantidad));
        actualizarContador(leerCarrito().reduce((suma, item) => suma + item.cantidad, 0));
        mostrarAviso(`${producto.nombre} se agregó al carrito.`, "success");
      } catch (error) { mostrarAviso(error.message, "error"); }
    });
    formulario.querySelector("[name=cantidad]").addEventListener("input", (evento) => evento.target.setCustomValidity(""));
    const relacionados = document.querySelector("#productos-relacionados");
    const otros = productos.filter((item) => item.id !== id && item.categoria === producto.categoria).slice(0, 2);
    if (!otros.length) otros.push(...productos.filter((item) => item.id !== id).slice(0, 2));
    const { crearTarjetaProducto } = await import("./render.js");
    relacionados.replaceChildren(...otros.map((item) => crearTarjetaProducto(item, { compacto: true })));
  } catch (error) { renderizarEstado(contenedor, error.message, "error"); }
}
