# Chiavetta Detailing — IEFI individual

**Aplicaciones Web 1 · IEFI 2026 · Lucas Romo**  
**Versión:** 2.1.0  
**Estado:** versión individual preparada para publicación; el despliegue remoto todavía debe ejecutarse.

## 1. Presentación

Este repositorio contiene la ampliación individual de la aplicación web de Chiavetta Detailing. Se toma como base el material desarrollado durante TP1, TP2, TP3 y TP4, y se reorganiza el código para ofrecer un recorrido comercial más completo, modular y verificable.

Los informes históricos se conservan sin reescritura dentro de `docs/historico/`. La ampliación, las decisiones técnicas, el plan de pruebas y las evidencias de esta versión se documentan por separado.

## 2. Funcionalidades principales

- Sitio multipágina adaptable a escritorio y dispositivos móviles.
- Catálogo de productos y servicios cargado desde archivos JSON mediante `fetch`.
- Búsqueda, filtros combinables por categoría y precio, ordenamiento y chips para retirar filtros activos.
- Fichas individuales de productos y servicios.
- Carrito con cantidades, eliminación de ítems, cálculo de subtotal y persistencia mediante `localStorage`.
- Flujo de pedido: validación de datos, generación de referencia, resumen y apertura de WhatsApp con el mensaje preparado.
- Formularios de reserva, contacto y consignación con validación HTML y JavaScript.
- Estados de interfaz para errores, datos vacíos, confirmaciones y acciones pendientes.
- Página de privacidad con explicación del almacenamiento local y opción para borrar los datos locales del sitio.
- Pruebas automatizadas con el test runner nativo de Node.js y workflow de CI/CD para GitHub Pages.

## 3. Requisitos y ejecución local

- Node.js 22 o superior.
- npm incluido con Node.js.
- Navegador moderno.

No se requieren dependencias de terceros para ejecutar el sitio o correr las pruebas.

```bash
npm run dev
```

El servidor local informa la dirección de acceso (por defecto `http://localhost:4173`). Para detenerlo, usar `Ctrl + C`.

## 4. Verificación del proyecto

```bash
npm run check
npm test
```

O ejecutar el proceso completo:

```bash
npm run verify
```

La verificación local realizada en esta entrega registró:

- 23 archivos JavaScript revisados sintácticamente.
- 15 páginas HTML verificadas y referencias locales resueltas.
- 16 pruebas aprobadas y 0 fallidas.

El resultado corresponde a una ejecución local en Node.js v22.16.0. No representa todavía una ejecución remota de GitHub Actions ni una prueba E2E en navegador real.

## 5. Estructura del repositorio

```text
.
├── .github/workflows/       # Workflow de calidad y publicación
├── docs/
│   ├── historico/           # Informes originales TP1-TP4
│   ├── evidencias/          # Diseños, capturas, collages y QA
│   ├── diagramas/           # Diagramas Mermaid editables
│   └── *.md                 # Arquitectura, pruebas y publicación
├── scripts/                 # Servidor local y verificaciones
├── site/                    # Sitio publicado como artefacto estático
│   ├── assets/css/          # Estilos
│   ├── assets/img/          # Imágenes optimizadas
│   ├── assets/js/domain/    # Lógica de negocio
│   ├── assets/js/modules/   # UI, páginas, formularios y persistencia
│   └── data/                # Productos y servicios en JSON
├── tests/                   # Pruebas nativas de Node.js
└── package.json
```

## 6. Publicación individual

El repositorio está preparado para GitHub Pages mediante `.github/workflows/ci-cd.yml`. Antes de publicar:

1. Crear un repositorio individual en GitHub.
2. Subir el contenido de esta carpeta a la rama `main`.
3. En **Settings → Pages**, elegir **GitHub Actions** como fuente de publicación.
4. Confirmar que el workflow finalice correctamente en **Actions**.
5. Verificar que el sitio publicado abra desde una ventana privada y probar sus formularios y navegación.

La URL remota y la URL pública permanecen pendientes hasta completar estas acciones. Ver `docs/03_Guia_Publicacion_GitHub_Pages.md`.

## 7. Alcance y límites funcionales

La aplicación es un sitio estático. No incluye backend propio, base de datos remota, autenticación, panel administrativo, procesamiento de pagos, inventario en tiempo real ni confirmación automática de turnos. El carrito y las consultas preparadas quedan en el almacenamiento del navegador. El pedido se envía únicamente cuando la persona abre WhatsApp y presiona **Enviar**; el negocio confirma posteriormente disponibilidad, condiciones y coordinación.

Los datos de contacto y ubicación se conservaron del material original del proyecto. Deben ser confirmados por el responsable del negocio antes de una publicación comercial definitiva.

## 8. Documentación

- `docs/Memoria_Tecnica_Ampliacion_Individual_Lucas_Romo.docx`: memoria formal de la ampliación y sus anexos.
- `docs/01_Arquitectura_y_organizacion.md`: arquitectura y responsabilidades de los módulos.
- `docs/02_Plan_de_pruebas_y_resultados.md`: estrategia, cobertura y resultados comprobados.
- `docs/03_Guia_Publicacion_GitHub_Pages.md`: publicación del repositorio individual.
- `docs/04_Registro_de_cambios.md`: evolución de la versión individual.
- `docs/historico/`: informes de cursada conservados como documentación histórica.

## 9. Autoría

**Lucas Romo** · Analista de Sistemas · Aplicaciones Web 1 · IES Siglo 21.
