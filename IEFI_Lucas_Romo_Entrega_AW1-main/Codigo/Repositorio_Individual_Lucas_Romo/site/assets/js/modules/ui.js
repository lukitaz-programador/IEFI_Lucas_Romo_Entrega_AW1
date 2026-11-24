export function mostrarAviso(texto, tipo = "info") {
  let aviso = document.querySelector("#aviso-global");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "aviso-global";
    aviso.className = "aviso-global";
    aviso.setAttribute("role", "status");
    aviso.setAttribute("aria-live", "polite");
    document.body.append(aviso);
  }
  aviso.dataset.tipo = tipo;
  aviso.textContent = texto;
  aviso.classList.add("aviso-global--visible");
  window.clearTimeout(mostrarAviso.temporizador);
  mostrarAviso.temporizador = window.setTimeout(() => aviso.classList.remove("aviso-global--visible"), 3200);
}

export function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

export function renderizarEstado(contenedor, mensaje, tipo = "info") {
  if (!contenedor) return;
  contenedor.replaceChildren();
  const estado = crearElemento("p", `estado estado--${tipo}`, mensaje);
  estado.setAttribute("role", tipo === "error" ? "alert" : "status");
  contenedor.append(estado);
}
