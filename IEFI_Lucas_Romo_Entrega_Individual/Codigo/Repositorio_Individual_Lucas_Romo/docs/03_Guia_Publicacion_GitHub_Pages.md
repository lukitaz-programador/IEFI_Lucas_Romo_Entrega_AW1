# 03. Guía de publicación individual en GitHub Pages

**Proyecto:** Chiavetta Detailing · **Responsable:** Lucas Romo

## 1. Preparación del repositorio

1. Ingresar a GitHub con la cuenta personal.
2. Crear un repositorio nuevo, preferentemente con el nombre `chiavetta-detailing-iefi-lucas-romo`.
3. Mantenerlo vacío al crearlo para evitar conflictos al subir la versión local.
4. Copiar el contenido completo de `Repositorio_Individual_Lucas_Romo/` a ese repositorio; la carpeta interna `site/` contiene el sitio y debe permanecer en la raíz del repositorio.
5. Confirmar que la rama principal se llame `main`.

## 2. Configurar GitHub Pages

1. Abrir **Settings → Pages**.
2. En **Build and deployment**, seleccionar **GitHub Actions** como fuente.
3. Abrir **Actions** y comprobar que el workflow `Calidad y despliegue - Chiavetta Detailing` esté habilitado.

## 3. Flujo automático

El archivo `.github/workflows/ci-cd.yml` se activa ante:

- `push` a `main`;
- `pull_request` hacia `main`;
- ejecución manual mediante `workflow_dispatch`.

El job `calidad` instala Node.js 26 en el runner, ejecuta `npm run check` y `npm test`. El job `despliegue` depende de la aprobación del anterior; no publica eventos de Pull Request. El artefacto de publicación es únicamente el directorio `site/`.

## 4. Verificación de la publicación

Una vez exitoso el job de despliegue:

1. Consultar la URL indicada por el entorno `github-pages` o por **Settings → Pages**.
2. Abrir la web desde una ventana privada.
3. Probar catálogo, filtros, ficha de producto, carrito, pedido y formularios.
4. Revisar navegación y presentación en escritorio y móvil.
5. Confirmar que la apertura de WhatsApp funciona y que el mensaje puede revisarse antes de enviarlo.

## 5. Datos que deben completarse

- URL del repositorio individual: pendiente de crear.
- URL pública: pendiente del primer despliegue exitoso.
- Ejecución remota del workflow: pendiente.

No se deben completar estos campos con direcciones supuestas.

## 6. Fuentes oficiales

- GitHub Docs, *Using custom workflows with GitHub Pages*: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Docs, *Configuring a publishing source for your GitHub Pages site*: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Docs, *Secure use reference*: https://docs.github.com/en/actions/reference/security/secure-use
