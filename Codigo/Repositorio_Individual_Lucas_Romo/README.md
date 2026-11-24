# Chiavetta Detailing — IEFI individual

**Aplicaciones Web 1 · IEFI 2026 · Lucas Romo**  
**Versión:** 2.1.0

## Proyecto

Aplicación web multipágina para Chiavetta Detailing. Las páginas y formularios están hechos en HTML; los estilos se comparten con CSS. JavaScript conecta las pantallas con el catálogo, el carrito y los pedidos. Los productos y servicios se leen desde JSON.

El [PDF integral](../../Entregables/PDF%20GUION%201.pdf) reúne la documentación académica del proyecto.

## Requisitos y ejecución

Se necesita Node.js 22 o superior y npm. El proyecto no usa dependencias externas, así que no hace falta ejecutar `npm install`.

```bash
npm run dev
```

Abrir en el navegador la dirección que muestra la terminal, por defecto `http://localhost:4173`. Para detener el servidor, presionar `Ctrl + C`.

## Pruebas y CI/CD

Comandos disponibles:

- `npm run check`: revisa sintaxis de JavaScript, estructura HTML, referencias locales e identificadores duplicados.
- `npm test`: ejecuta las pruebas con el test runner incluido en Node.js.
- `npm run verify`: ejecuta ambas verificaciones en secuencia.

Las pruebas cubren los datos del catálogo, la búsqueda y los filtros, el carrito, la validación de pedidos y el almacenamiento local.

El workflow `.github/workflows/ci-cd.yml` se activa en cambios y solicitudes de integración hacia `main`, o manualmente desde GitHub Actions. Su trabajo de calidad usa Node.js 26 y ejecuta `npm run check` y `npm test`. Si ambas etapas pasan, publica el contenido de `site/` en GitHub Pages; las solicitudes de integración solo ejecutan los controles y no publican.

El último registro de verificación local de esta entrega informó 23 archivos JavaScript revisados, 15 páginas HTML validadas y 16 pruebas aprobadas. Esos resultados son locales; el resultado remoto se consulta en la ejecución correspondiente de GitHub Actions.

## Cambios de la entrega individual — 2.1.0

- Sitio multipágina y código JavaScript organizado en módulos.
- Catálogo de productos y servicios leído desde JSON, con búsqueda, filtros y ordenamiento.
- Páginas de detalle, carrito persistente y preparación de pedidos para WhatsApp.
- Formularios de reserva, contacto y consignación, con validaciones y mensajes de estado.
- Página de privacidad y opción para borrar los datos guardados localmente.
- Pruebas automatizadas y workflow de verificación y publicación.

## Estructura principal

```text
.github/workflows/ci-cd.yml   Automatización de calidad y publicación
site/                         Aplicación web y datos JSON
scripts/                      Servidor local y verificaciones
tests/                        Pruebas automatizadas
../../Entregables/PDF GUION 1.pdf  PDF integral
package.json                  Comandos y requisitos de Node.js
```

La aplicación es estática: no incluye backend, base de datos remota, autenticación ni procesamiento de pagos. El pedido queda preparado en el navegador y la persona lo envía mediante WhatsApp.
