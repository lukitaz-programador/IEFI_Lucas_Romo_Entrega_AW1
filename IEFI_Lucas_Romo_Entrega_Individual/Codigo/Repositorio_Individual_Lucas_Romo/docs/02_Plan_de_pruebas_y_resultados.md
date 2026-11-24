# 02. Plan de pruebas y resultados

**Proyecto:** Chiavetta Detailing · **Responsable:** Lucas Romo · **Versión:** 2.1.0

## 1. Objetivo

Definir controles reproducibles para comprobar las reglas principales del catálogo, el carrito, la construcción del pedido, el almacenamiento local y la integridad estática del sitio.

## 2. Herramientas

- `node:test`: test runner nativo incluido en Node.js.
- `node:assert/strict`: aserciones para comparar resultados y verificar errores.
- `npm run check`: chequeo de sintaxis, referencias locales, rutas y estructura HTML.
- GitHub Actions: ejecución automática de los chequeos y las pruebas en el flujo CI/CD.

No se incorporan dependencias de terceros para las pruebas unitarias actuales.

## 3. Cobertura funcional

| Área | Casos cubiertos |
|---|---|
| Datos | Productos con identificadores únicos; estructura mínima de productos y servicios; referencias a imágenes. |
| Catálogo | Búsqueda tolerante a tildes y mayúsculas; combinación de categoría y rango; orden ascendente y descendente. |
| Carrito | Alta de producto; actualización de cantidades; topes; normalización; eliminación; totales sin impuestos inventados. |
| Pedido | Validación de nombre, teléfono y correo; construcción de mensaje y enlace de WhatsApp. |
| Almacenamiento | Lectura con respaldo ante JSON inválido; serialización; limpieza de claves de la aplicación. |
| Sitio | Sintaxis de JavaScript; páginas HTML; referencias locales; IDs únicos; rutas definidas para navegación. |

## 4. Resultado de la ejecución local

**Comando:** `npm run verify`  
**Entorno:** Node.js v22.16.0 · npm 10.9.2  
**Resultado:** 23 archivos JavaScript verificados; 15 páginas HTML validadas; 16 pruebas aprobadas y 0 fallidas.

La salida de consola completa está guardada en `evidencias/qa/registro-verificacion-local.txt`.

## 5. Clasificación de pruebas

- **Unitarias:** comprueban funciones de catálogo, carrito, validación del cliente, armado de mensajes y utilidades de almacenamiento.
- **Integración de datos/estructura:** revisan consistencia de los JSON, referencias a recursos y rutas internas.
- **E2E:** no se ejecutó una suite E2E automatizada en navegador para esta entrega. Playwright se considera una alternativa para una etapa posterior, no una prueba ya realizada.

## 6. Criterio de aprobación local

La verificación se considera satisfactoria cuando `npm run check` finaliza con código cero y `npm test` informa que todas las pruebas terminan correctamente. Los resultados locales no reemplazan la ejecución remota de GitHub Actions ni una revisión manual en navegador.

## 7. Próxima validación requerida

Una vez creado el repositorio remoto, deberá verificarse:

1. Ejecución del workflow al hacer push a `main`.
2. Aprobación del job de calidad.
3. Publicación de GitHub Pages.
4. Navegación real desde una ventana privada.
5. Prueba manual de filtros, carrito, formulario, enlace WhatsApp y visualización móvil.

El estado de estas acciones es pendiente hasta su ejecución real.
