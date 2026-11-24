import { renderizarEstructura, actualizarContador } from "./modules/layout.js";
import { leerCarrito } from "./modules/storage.js";
import { iniciarCatalogo, iniciarProductosDestacados } from "./modules/catalog-page.js";
import { iniciarDetalleProducto } from "./modules/product-page.js";
import { iniciarServicios, iniciarDetalleServicio } from "./modules/services-page.js";
import { iniciarPaginaCarrito, iniciarCheckout, iniciarConfirmacion } from "./modules/cart-page.js";
import { iniciarFormularios } from "./modules/forms-page.js";
import { iniciarPreguntasFrecuentes } from "./modules/faq.js";
import { iniciarPrivacidad } from "./modules/privacy-page.js";

async function iniciarAplicacion() {
  renderizarEstructura();
  actualizarContador(leerCarrito().reduce((total, item) => total + (Number(item.cantidad) || 0), 0));
  const inicializaciones = [
    iniciarCatalogo,
    iniciarProductosDestacados,
    iniciarDetalleProducto,
    iniciarServicios,
    iniciarDetalleServicio,
    iniciarPaginaCarrito,
    iniciarCheckout,
    iniciarConfirmacion,
    iniciarFormularios,
    iniciarPreguntasFrecuentes,
    iniciarPrivacidad
  ];
  for (const iniciar of inicializaciones) {
    try { await iniciar(); }
    catch (error) { console.error(`Error al iniciar ${iniciar.name}:`, error); }
  }
}

document.addEventListener("DOMContentLoaded", iniciarAplicacion);
