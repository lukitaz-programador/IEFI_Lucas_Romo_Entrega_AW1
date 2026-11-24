export function validarDatosCliente(datos = {}) {
  const errores = {};
  const nombre = String(datos.nombre ?? "").trim();
  const telefono = String(datos.telefono ?? "").trim();
  const email = String(datos.email ?? "").trim();

  if (nombre.length < 3 || nombre.length > 80) errores.nombre = "Ingresá un nombre de entre 3 y 80 caracteres.";
  const telefonoLimpio = telefono.replace(/[\s()+.-]/g, "");
  if (!/^\+?\d{8,15}$/.test(telefonoLimpio)) errores.telefono = "Ingresá un teléfono válido con código de área.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = "Ingresá un correo electrónico válido.";
  return errores;
}

export function crearMensajePedido(pedido, productos) {
  if (!pedido || !Array.isArray(pedido.articulos) || pedido.articulos.length === 0) {
    throw new TypeError("El pedido debe contener al menos un artículo.");
  }
  const lineas = pedido.articulos.map((item) => {
    const producto = productos.find((elemento) => elemento.id === item.id);
    if (!producto) throw new Error(`No se encontró el producto ${item.id}.`);
    const importe = producto.precio * item.cantidad;
    return `- ${producto.nombre} | ${item.cantidad} x ${formatearPrecio(importe)}`;
  });
  const cliente = pedido.cliente ?? {};
  return [
    "Hola, Chiavetta Detailing. Quiero consultar por este pedido:",
    `Referencia: ${pedido.numero}`,
    `Nombre: ${cliente.nombre}`,
    `Teléfono: ${cliente.telefono}`,
    cliente.email ? `Correo: ${cliente.email}` : null,
    "",
    ...lineas,
    "",
    `Subtotal de productos: ${formatearPrecio(pedido.totales.subtotal)}`,
    `Total de productos: ${formatearPrecio(pedido.totales.total)}`,
    "",
    "Quedo a la espera de la confirmación de disponibilidad y condiciones. Gracias."
  ].filter((linea) => linea !== null).join("\n");
}

export function crearMensajeReserva(datos = {}) {
  return [
    "Hola, Chiavetta Detailing. Quiero solicitar un turno:",
    `Servicio: ${datos.servicio || "A definir"}`,
    `Nombre: ${datos.nombre || ""}`,
    `Teléfono: ${datos.telefono || ""}`,
    `Vehículo: ${datos.vehiculo || ""}`,
    `Fecha preferida: ${datos.fecha || "A coordinar"}`,
    `Franja horaria: ${datos.horario || "A coordinar"}`,
    datos.mensaje ? `Observaciones: ${datos.mensaje}` : null,
    "",
    "Entiendo que se trata de una solicitud y que el turno queda sujeto a confirmación del negocio."
  ].filter((linea) => linea !== null).join("\n");
}

export function crearUrlWhatsApp(telefono, mensaje) {
  const numero = String(telefono ?? "").replace(/\D/g, "");
  if (numero.length < 8 || numero.length > 15) throw new TypeError("El número de WhatsApp no tiene un formato válido.");
  return `https://wa.me/${numero}?text=${encodeURIComponent(String(mensaje ?? ""))}`;
}

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(valor);
}
