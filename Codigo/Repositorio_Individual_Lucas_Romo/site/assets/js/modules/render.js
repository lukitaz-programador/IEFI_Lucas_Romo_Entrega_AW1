import { precioARS } from "./format.js";
import { crearElemento } from "./ui.js";

export function crearTarjetaProducto(producto, { compacto = false } = {}) {
  const articulo = crearElemento("article", `producto-card${compacto ? " producto-card--compacto" : ""}`);
  const figura = crearElemento("a", "producto-card__imagen");
  figura.href = `./producto.html?id=${encodeURIComponent(producto.id)}`;
  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.alt || producto.nombre;
  imagen.loading = "lazy";
  imagen.width = 520;
  imagen.height = 420;
  figura.append(imagen);
  if (producto.destacado) figura.append(crearElemento("span", "etiqueta-etiqueta", "SELECCIÓN"));
  const cuerpo = crearElemento("div", "producto-card__cuerpo");
  cuerpo.append(crearElemento("span", "sobrelinea", producto.categoriaNombre));
  const titulo = crearElemento("h3", "", producto.nombre);
  const enlaceTitulo = crearElemento("a", "producto-card__titulo");
  enlaceTitulo.href = figura.href;
  enlaceTitulo.append(titulo);
  cuerpo.append(enlaceTitulo, crearElemento("p", "producto-card__descripcion", producto.descripcion));
  const pie = crearElemento("div", "producto-card__pie");
  pie.append(crearElemento("strong", "producto-card__precio", precioARS(producto.precio)));
  const acciones = crearElemento("div", "producto-card__acciones");
  const ver = crearElemento("a", "boton boton--texto", "Ver detalle ↗");
  ver.href = figura.href;
  const agregar = crearElemento("button", "boton boton--mini boton--rojo", "Agregar +");
  agregar.type = "button";
  agregar.dataset.agregar = producto.id;
  acciones.append(ver, agregar);
  pie.append(acciones);
  cuerpo.append(pie);
  articulo.append(figura, cuerpo);
  return articulo;
}

export function crearTarjetaServicio(servicio) {
  const articulo = crearElemento("article", "servicio-card");
  const figura = crearElemento("a", "servicio-card__imagen");
  figura.href = `./servicio.html?id=${encodeURIComponent(servicio.id)}`;
  const imagen = document.createElement("img");
  imagen.src = servicio.imagen;
  imagen.alt = servicio.alt || servicio.nombre;
  imagen.loading = "lazy";
  imagen.width = 640;
  imagen.height = 460;
  figura.append(imagen);
  const cuerpo = crearElemento("div", "servicio-card__cuerpo");
  cuerpo.append(crearElemento("span", "sobrelinea", servicio.categoriaNombre));
  cuerpo.append(crearElemento("h3", "", servicio.nombre));
  cuerpo.append(crearElemento("p", "", servicio.descripcion));
  const enlace = crearElemento("a", "boton boton--texto", "Conocer el servicio ↗");
  enlace.href = figura.href;
  cuerpo.append(enlace);
  articulo.append(figura, cuerpo);
  return articulo;
}
