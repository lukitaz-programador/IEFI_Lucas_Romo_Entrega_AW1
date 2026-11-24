# 01. Arquitectura y organización técnica

**Proyecto:** Chiavetta Detailing · **Responsable:** Lucas Romo · **Versión:** 2.1.0

## 1. Criterio general

La solución se organiza como una aplicación multipágina estática. HTML define la estructura de cada pantalla, CSS concentra la presentación y JavaScript se divide entre lógica de dominio y módulos de interfaz. Los productos y servicios se mantienen en archivos JSON independientes para que la vista no dependa de datos escritos directamente en el marcado.

## 2. Capas y responsabilidades

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Presentación | `site/*.html` | Estructura semántica de las páginas y formularios. |
| Estilos | `site/assets/css/styles.css` | Sistema visual, grillas, estados y adaptación responsive. |
| Datos | `site/data/*.json` | Catálogo de productos y servicios. |
| Dominio | `site/assets/js/domain/` | Reglas puras de catálogo, carrito y construcción de pedidos. |
| Interfaz | `site/assets/js/modules/` | Carga JSON, renderizado, eventos, formularios, navegación y estados. |
| Persistencia | `site/assets/js/modules/storage.js` | Lectura, escritura y limpieza de datos locales. |
| Verificación | `tests/`, `scripts/` | Pruebas nativas, chequeos de sintaxis y estructura. |
| Automatización | `.github/workflows/` | Verificación y despliegue condicional. |

## 3. Módulos de dominio

- `domain/catalog.js`: búsqueda, filtrado por categoría y rango de precio, y ordenamiento.
- `domain/cart.js`: normalización del carrito, adición, actualización, eliminación y cálculo de totales.
- `domain/orders.js`: validación de datos de cliente, armado de mensajes y generación de enlaces a WhatsApp.

Estos módulos concentran reglas que pueden probarse sin depender del DOM. Esta separación permite reutilizar el comportamiento y facilita las pruebas unitarias.

## 4. Módulos de interfaz

- `app.js`: punto de entrada y activación de las funcionalidades según la página.
- `data.js`: carga asíncrona de los JSON con `fetch` y tratamiento de errores.
- `layout.js`: composición de navegación y pie de página compartidos.
- `catalog-page.js`, `product-page.js`, `services-page.js`: vistas de catálogo, detalle de producto y servicios.
- `cart-page.js`: presentación y modificación del carrito, preparación y seguimiento de la solicitud.
- `forms-page.js`: reservas, contacto y consignación.
- `privacy-page.js`: información sobre datos locales y limpieza del almacenamiento.
- `faq.js`, `render.js`, `ui.js`, `format.js`, `storage.js`: funcionalidades auxiliares compartidas.

## 5. Flujos de información

### 5.1. Catálogo

1. La página carga el módulo de catálogo.
2. El módulo solicita `productos.json` usando `fetch`.
3. Los datos se convierten en objetos JavaScript.
4. La lógica de dominio aplica consulta, filtros y ordenamiento.
5. La interfaz renderiza tarjetas, contadores y filtros activos.

### 5.2. Pedido

1. La persona incorpora productos al carrito.
2. El carrito normaliza identificadores y cantidades.
3. Los totales se calculan usando los precios del JSON.
4. El formulario de cierre valida los datos del cliente.
5. Se crea una referencia y se prepara el mensaje de pedido.
6. Se abre WhatsApp con la información codificada.
7. La persona revisa el mensaje y debe presionar **Enviar**.
8. El sitio permite registrar que la persona continuó con el envío, pero no puede comprobar la recepción del negocio.

### 5.3. Solicitudes de servicio

Reserva, contacto y consignación utilizan validaciones HTML y JavaScript. La información se transforma en un mensaje para WhatsApp; no se representa como turno confirmado ni como consulta recibida automáticamente.

## 6. Persistencia y privacidad

El carrito y las consultas preparadas utilizan `localStorage`. Este almacenamiento pertenece al navegador del usuario: no sincroniza dispositivos ni constituye una base de datos del negocio. La página de privacidad informa este alcance y ofrece eliminar las claves específicas de la aplicación.

## 7. Diagrama

El diagrama editable se encuentra en `diagramas/arquitectura-funcional.mmd`. La versión visual está en `evidencias/Anexos_Visuales/06_arquitectura_funcional.png`.

## 8. Límites

No existe backend propio, API de negocio, base remota, autenticación, panel administrativo, pagos en línea ni control de inventario. La confirmación de precios, disponibilidad, turnos y entrega depende del contacto humano con el negocio.
