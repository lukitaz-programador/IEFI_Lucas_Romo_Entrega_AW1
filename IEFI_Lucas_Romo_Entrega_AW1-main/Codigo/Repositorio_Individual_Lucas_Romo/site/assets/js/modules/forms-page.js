import { crearMensajeReserva, crearUrlWhatsApp, validarDatosCliente } from "../domain/orders.js";
import { obtenerServicios } from "./data.js";
import { guardarConsulta } from "./storage.js";
import { renderizarEstado } from "./ui.js";

function mostrarErrorCampo(input, mensaje) {
  input.setCustomValidity(mensaje || "");
  if (mensaje) input.reportValidity();
}

function crearMensajeConsulta(formulario, datos) {
  const tipo = formulario.dataset.form;
  const encabezado = tipo === "consignacion" ? "Quiero realizar una consulta por consignación de vehículo." : "Quiero realizar una consulta desde la web de Chiavetta Detailing.";
  const lineas = Object.entries(datos).map(([clave, valor]) => `${clave}: ${String(valor).trim()}`).filter((linea) => !linea.endsWith(": "));
  return ["Hola, Chiavetta Detailing.", encabezado, "", ...lineas, "", "Quedo a la espera de su respuesta. Gracias."].join("\n");
}

export async function iniciarFormularios() {
  const formularios = document.querySelectorAll("form[data-form]");
  if (!formularios.length) return;
  let servicios = [];
  try { servicios = await obtenerServicios(); } catch { /* El formulario puede continuar sin el catálogo de servicios. */ }
  const parametroServicio = new URLSearchParams(location.search).get("servicio");
  formularios.forEach((formulario) => {
    const selectServicio = formulario.querySelector("[name=servicio]");
    if (selectServicio && servicios.length) {
      servicios.forEach((servicio) => {
        const option = document.createElement("option");
        option.value = servicio.id; option.textContent = servicio.nombre; selectServicio.append(option);
      });
      if (parametroServicio) selectServicio.value = parametroServicio;
    }
    formulario.addEventListener("input", (evento) => evento.target.setCustomValidity?.(""));
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (!formulario.reportValidity()) return;
      const datos = Object.fromEntries(new FormData(formulario).entries());
      const errores = validarDatosCliente(datos);
      if (tipoDeFormulario(formulario) === "reserva" && datos.fecha) {
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const fechaSeleccionada = new Date(`${datos.fecha}T00:00:00`);
        if (Number.isNaN(fechaSeleccionada.getTime()) || fechaSeleccionada < hoy) errores.fecha = "Seleccioná una fecha vigente o futura.";
      }
      if (Object.keys(errores).length) {
        Object.entries(errores).forEach(([campo, mensaje]) => mostrarErrorCampo(formulario.elements.namedItem(campo), mensaje));
        return;
      }
      try {
        if (tipoDeFormulario(formulario) === "reserva") {
          const servicio = servicios.find((item) => item.id === datos.servicio);
          if (servicio) datos.servicio = servicio.nombre;
        }
        const mensaje = tipoDeFormulario(formulario) === "reserva" ? crearMensajeReserva(datos) : crearMensajeConsulta(formulario, datos);
        try { guardarConsulta({ tipo: tipoDeFormulario(formulario), ...datos }); }
        catch (error) { console.warn("No se pudo conservar la consulta en este navegador.", error); }
        const enlace = crearUrlWhatsApp("543513090597", mensaje);
        const salida = formulario.querySelector("[data-estado-formulario]");
        if (salida) {
          salida.textContent = "Se preparó tu mensaje. Abrí WhatsApp y presioná Enviar para que llegue al negocio.";
          const boton = formulario.querySelector("[data-enlace-whatsapp]");
          if (boton) { boton.href = enlace; boton.hidden = false; }
          else {
            const nuevo = document.createElement("a"); nuevo.className = "boton boton--rojo enlace-whatsapp"; nuevo.textContent = "Abrir WhatsApp y enviar ↗"; nuevo.href = enlace; nuevo.target = "_blank"; nuevo.rel = "noopener noreferrer"; salida.after(nuevo);
          }
        }
      } catch (error) {
        renderizarEstado(formulario.querySelector("[data-estado-formulario]"), error.message, "error");
      }
    });
  });
}

function tipoDeFormulario(formulario) { return formulario.dataset.form; }
