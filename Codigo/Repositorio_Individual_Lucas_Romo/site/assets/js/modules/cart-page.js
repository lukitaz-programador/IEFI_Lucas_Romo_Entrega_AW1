import { obtenerProductos } from "./data.js";
import { precioARS } from "./format.js";
import { leerCarrito, guardarCarrito } from "./storage.js";
import { actualizarContador } from "./layout.js";
import { calcularTotales, normalizarCarrito, actualizarCantidad, quitarDelCarrito } from "../domain/cart.js";
import { crearMensajePedido, crearUrlWhatsApp, validarDatosCliente } from "../domain/orders.js";
import { mostrarAviso, renderizarEstado, crearElemento } from "./ui.js";

function renderizarContador(carrito) {
  actualizarContador(carrito.reduce((total, item) => total + item.cantidad, 0));
}

export async function iniciarPaginaCarrito() {
  const contenedor = document.querySelector("#carrito-articulos");
  if (!contenedor) return;
  try {
    const productos = await obtenerProductos();
    let carrito = normalizarCarrito(leerCarrito(), productos);
    guardarCarrito(carrito);
    const resumen = document.querySelector("#carrito-resumen");
    const acciones = document.querySelector("#carrito-acciones");
    const renderizar = () => {
      carrito = normalizarCarrito(leerCarrito(), productos);
      guardarCarrito(carrito);
      contenedor.replaceChildren();
      if (!carrito.length) {
        renderizarEstado(contenedor, "Tu carrito todavía está vacío. Explorá el catálogo y agregá los productos que necesitás.");
        acciones.hidden = true;
        resumen.replaceChildren(crearElemento("p", "resumen-vacio", "Agregá productos para ver el resumen de tu compra."));
        renderizarContador(carrito);
        return;
      }
      acciones.hidden = false;
      for (const item of carrito) {
        const producto = productos.find((elemento) => elemento.id === item.id);
        const fila = crearElemento("article", "carrito-item");
        const imagen = document.createElement("img"); imagen.src = producto.imagen; imagen.alt = producto.alt; imagen.loading = "lazy";
        const datos = crearElemento("div", "carrito-item__datos");
        datos.append(crearElemento("span", "sobrelinea", producto.categoriaNombre), crearElemento("h3", "", producto.nombre), crearElemento("p", "", precioARS(producto.precio)));
        const controles = crearElemento("div", "carrito-item__controles");
        const label = crearElemento("label", "", "Cantidad"); const input = document.createElement("input"); input.type = "number"; input.min = "1"; input.max = "99"; input.value = String(item.cantidad); input.setAttribute("aria-label", `Cantidad de ${producto.nombre}`); label.append(input);
        const quitar = crearElemento("button", "boton boton--texto boton--peligro", "Quitar"); quitar.type = "button"; quitar.dataset.quitar = producto.id;
        const importe = crearElemento("strong", "carrito-item__importe", precioARS(producto.precio * item.cantidad));
        controles.append(label, importe, quitar); fila.append(imagen, datos, controles); contenedor.append(fila);
        input.addEventListener("change", () => {
          try { carrito = actualizarCantidad(carrito, producto.id, Number(input.value)); guardarCarrito(carrito); renderizar(); }
          catch (error) { mostrarAviso(error.message, "error"); input.value = String(item.cantidad); }
        });
      }
      const totales = calcularTotales(carrito, productos);
      resumen.replaceChildren();
      const lineas = [["Productos", String(totales.unidades)], ["Subtotal", precioARS(totales.subtotal)], ["Envío", "A coordinar"], ["Total de productos", precioARS(totales.total)]];
      lineas.forEach(([label, value], index) => {
        const row = crearElemento("div", `resumen-linea${index === lineas.length - 1 ? " resumen-linea--total" : ""}`);
        row.append(crearElemento("span", "", label), crearElemento("strong", "", value)); resumen.append(row);
      });
      renderizarContador(carrito);
    };
    contenedor.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-quitar]");
      if (!boton) return;
      carrito = quitarDelCarrito(carrito, boton.dataset.quitar); guardarCarrito(carrito); renderizar();
      mostrarAviso("Producto quitado del carrito.");
    });
    document.querySelector("#vaciar-carrito")?.addEventListener("click", () => {
      carrito = []; guardarCarrito(carrito); renderizar(); mostrarAviso("El carrito se vació.");
    });
    renderizar();
  } catch (error) { renderizarEstado(contenedor, error.message, "error"); }
}

export async function iniciarCheckout() {
  const form = document.querySelector("#form-checkout");
  if (!form) return;
  const resumen = document.querySelector("#checkout-resumen");
  const estado = document.querySelector("#checkout-estado");
  const botonEnviado = document.querySelector("#marcar-enviado");
  try {
    const productos = await obtenerProductos();
    const carrito = normalizarCarrito(leerCarrito(), productos);
    if (!carrito.length) {
      renderizarEstado(resumen, "No hay artículos en el carrito. Volvé al catálogo para continuar.");
      form.querySelector("button[type=submit]").disabled = true;
      return;
    }
    const totales = calcularTotales(carrito, productos);
    const lista = crearElemento("ul", "checkout-lista");
    carrito.forEach((item) => {
      const producto = productos.find((elemento) => elemento.id === item.id);
      lista.append(crearElemento("li", "", `${producto.nombre} · ${item.cantidad} × ${precioARS(producto.precio)} = ${precioARS(producto.precio * item.cantidad)}`));
    });
    resumen.replaceChildren(lista, crearElemento("p", "checkout-total", `Total de productos: ${precioARS(totales.total)}`), crearElemento("p", "nota", "Los importes no incluyen envío ni cargos adicionales. Las condiciones finales se confirman con el negocio."));

    form.addEventListener("input", (evento) => evento.target.setCustomValidity?.(""));
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (!form.reportValidity()) return;
      const cliente = Object.fromEntries(new FormData(form).entries());
      const errores = validarDatosCliente(cliente);
      if (Object.keys(errores).length) {
        Object.entries(errores).forEach(([campo, mensaje]) => {
          const input = form.elements.namedItem(campo);
          input?.setCustomValidity(mensaje); input?.reportValidity();
        });
        return;
      }
      const pedido = {
        numero: `CD-${Date.now().toString().slice(-8)}`,
        fecha: new Date().toISOString(),
        cliente,
        articulos: carrito,
        totales
      };
      const mensaje = crearMensajePedido(pedido, productos);
      const url = crearUrlWhatsApp("543513090597", mensaje);
      try { sessionStorage.setItem("chiavetta-pedido-pendiente", JSON.stringify(pedido)); }
      catch (error) { console.warn("No se pudo conservar el estado del pedido en esta sesión.", error); }
      estado.replaceChildren(document.createTextNode("El mensaje está preparado. Abrí WhatsApp desde el enlace y presioná Enviar para remitirlo al negocio. "));
      const enlace = document.createElement("a");
      enlace.className = "enlace-whatsapp-inline";
      enlace.href = url;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      enlace.textContent = "Abrir WhatsApp y enviar ↗";
      enlace.addEventListener("click", () => { botonEnviado.hidden = false; });
      estado.append(enlace);
    });
    botonEnviado?.addEventListener("click", () => {
      const pendiente = sessionStorage.getItem("chiavetta-pedido-pendiente");
      if (!pendiente) { mostrarAviso("No se encontró el pedido de esta sesión. Volvé a preparar el mensaje para continuar.", "error"); return; }
      const pedido = JSON.parse(pendiente);
      sessionStorage.setItem("chiavetta-pedido-finalizado", JSON.stringify({ ...pedido, marcadoPorCliente: true }));
      guardarCarrito([]);
      location.href = "./confirmacion.html";
    });
  } catch (error) { renderizarEstado(resumen, error.message, "error"); }
}

export function iniciarConfirmacion() {
  const nodo = document.querySelector("#confirmacion-detalle");
  if (!nodo) return;
  try {
    const pedido = JSON.parse(sessionStorage.getItem("chiavetta-pedido-finalizado") ?? "null");
    if (!pedido) { renderizarEstado(nodo, "No hay una confirmación disponible en esta sesión."); return; }
    nodo.replaceChildren(
      crearElemento("p", "confirmacion__numero", `Referencia ${pedido.numero}`),
      crearElemento("p", "", `Total de productos: ${precioARS(pedido.totales.total)}.`),
      crearElemento("p", "nota", "La web registra que marcaste el pedido como enviado. La recepción, disponibilidad y confirmación comercial dependen de la respuesta del negocio.")
    );
  } catch (error) { renderizarEstado(nodo, "No se pudo recuperar la información de la confirmación.", "error"); }
}
