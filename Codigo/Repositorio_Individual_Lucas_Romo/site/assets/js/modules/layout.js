export function renderizarEstructura() {
  const encabezado = document.querySelector("#encabezado-sitio");
  const pie = document.querySelector("#pie-sitio");
  const pagina = document.body.dataset.page ?? "inicio";
  const rutas = [
    ["inicio", "Inicio", "index.html"],
    ["servicios", "Servicios", "servicios.html"],
    ["catalogo", "Productos", "catalogo.html"],
    ["consignacion", "Consignación", "consignacion.html"],
    ["nosotros", "Nosotros", "nosotros.html"],
    ["contacto", "Contacto", "contacto.html"]
  ];
  if (encabezado) {
    encabezado.innerHTML = `
      <div class="barra-superior"><div class="contenedor barra-superior__interior"><span>ESTÉTICA AUTOMOTRIZ · CÓRDOBA</span><a href="tel:+543513090597">+54 351 309 0597</a></div></div>
      <header class="header"><div class="contenedor header__interior">
        <a class="marca" href="index.html" aria-label="Chiavetta Detailing, inicio"><img src="./assets/img/logo.webp" alt="" width="54" height="54"><span>CHIAVETTA <em>DETAILING</em></span></a>
        <button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navegacion-principal"><span></span><span></span><span></span></button>
        <nav class="nav" id="navegacion-principal" aria-label="Navegación principal"><ul>${rutas.map(([id,nombre,url]) => `<li><a href="./${url}"${pagina === id ? ' aria-current="page"' : ""}>${nombre}</a></li>`).join("")}</ul>
          <a class="nav__carrito" href="./carrito.html" aria-label="Abrir carrito"><span class="icono-carrito" aria-hidden="true">▣</span><span>Carrito</span><b class="contador-carrito" data-contador>0</b></a>
        </nav>
      </div></header>`;
  }
  if (pie) {
    pie.innerHTML = `
      <footer class="footer"><div class="contenedor footer__principal">
        <div class="footer__marca"><a class="marca marca--footer" href="index.html"><img src="./assets/img/logo.webp" alt="" width="48" height="48"><span>CHIAVETTA <em>DETAILING</em></span></a><p>Estética y cuidado automotriz en Córdoba. Tratamientos, productos profesionales y atención personalizada.</p><a href="https://wa.me/543513090597" target="_blank" rel="noopener noreferrer" class="footer__whatsapp">Consultar por WhatsApp ↗</a></div>
        <div><h2>Explorar</h2><ul><li><a href="servicios.html">Servicios</a></li><li><a href="catalogo.html">Productos</a></li><li><a href="consignacion.html">Consignación</a></li><li><a href="nosotros.html">Nosotros</a></li></ul></div>
        <div><h2>Contacto</h2><address><span>Barrio San Lorenzo, Córdoba, Argentina</span><a href="tel:+543513090597">+54 351 309 0597</a><a href="mailto:santinoch92@gmail.com">santinoch92@gmail.com</a></address><a href="contacto.html">Abrir formulario de contacto</a><a href="privacidad.html">Privacidad y datos locales</a></div>
      </div><div class="contenedor footer__base"><span>© 2026 Chiavetta Detailing. Material académico de Aplicaciones Web 1.</span><a href="#inicio-pagina">Volver arriba ↑</a></div></footer>`;
  }
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    const abierto = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!abierto));
    toggle.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
    nav?.classList.toggle("nav--abierto", !abierto);
  });
  nav?.querySelectorAll("a").forEach((enlace) => enlace.addEventListener("click", () => {
    toggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("nav--abierto");
  }));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && nav?.classList.contains("nav--abierto")) {
      nav.classList.remove("nav--abierto");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.focus();
    }
  });
}

export function actualizarContador(cantidad) {
  document.querySelectorAll("[data-contador]").forEach((nodo) => { nodo.textContent = String(cantidad); });
}
