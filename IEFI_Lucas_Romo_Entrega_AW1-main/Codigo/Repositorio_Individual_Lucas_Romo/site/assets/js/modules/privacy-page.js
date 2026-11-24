import { limpiarDatosLocales } from "./storage.js";
import { actualizarContador } from "./layout.js";
import { mostrarAviso } from "./ui.js";

export function iniciarPrivacidad() {
  const boton = document.querySelector("#eliminar-datos-locales");
  if (!boton) return;
  boton.addEventListener("click", () => {
    const confirmar = window.confirm("Se eliminarán el carrito y las consultas guardadas en este navegador. Esta acción no se puede deshacer. ¿Continuar?");
    if (!confirmar) return;
    try {
      limpiarDatosLocales();
      actualizarContador(0);
      mostrarAviso("Se eliminaron los datos locales de este navegador.", "success");
    } catch (error) {
      mostrarAviso("No se pudieron eliminar todos los datos locales. Revisá los permisos del navegador.", "error");
      console.error(error);
    }
  });
}
