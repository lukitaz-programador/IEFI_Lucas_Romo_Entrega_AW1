# Entrega IEFI individual — Lucas Romo

**Aplicaciones Web 1 · Colegio Universitario IES Siglo 21 · 2026**  
**Proyecto individual:** Chiavetta Detailing · **Versión del sitio:** 2.1.0

Esta carpeta organiza la entrega individual del IEFI. El repositorio de código es independiente y está preparado para subirse a GitHub bajo una cuenta personal. Los informes anteriores se conservan como evidencia de la evolución del proyecto; no se reescribió su contenido.

## 1. Contenido de la entrega

### PDF

- `01_Proyecto_Integral_Individual_Lucas_Romo.pdf`: documento único de **130 páginas**, con la memoria de ampliación individual, un separador de sección y el PDF integral anterior de 108 páginas conservado sin modificación. Incluye marcadores de navegación y mantiene el índice original de los informes históricos.
- `02_Investigacion_CICD_y_Testing.pdf`: investigación individual del tema de exposición.
- `03_Diapositivas_CICD_y_Testing.pdf`: diapositivas preparadas para la exposición.
- `04_Guion_Video_CICD.pdf`: guion de apoyo para grabar el video.
- `05_Anexo_Tecnico_TP4.pdf`: anexo técnico anterior, conservado.
- `06_Memoria_Tecnica_Ampliacion_Individual_Lucas_Romo.pdf`: copia independiente de la memoria técnica de ampliación.

### Editables

Se incluyen los documentos DOCX y la presentación PPTX para permitir ajustes finales. El documento de consigna mantiene el diseño institucional y tiene los datos conocidos ya completados. El DNI y los enlaces reales quedan señalados como pendientes porque no fueron proporcionados ni se ha creado el repositorio remoto o ejecutado el despliegue.

### Código

`Codigo/Repositorio_Individual_Lucas_Romo/` contiene el proyecto web completo como carpeta lista para abrir en Cursor o VS Code. Incluye el sitio, módulos ESModules, JSON, pruebas, workflow CI/CD, documentación y anexos visuales. Es un repositorio individual; no incluye las copias de los otros integrantes. También se entrega por separado un ZIP exclusivo del repositorio para subirlo directamente a GitHub.

### Herramientas

- `Herramientas/instalar_extensiones_chiavetta.bat`: instalador de extensiones para Cursor o VS Code. Ejecutarlo con doble clic desde el Explorador de Windows; no pegar su contenido en Git Bash.
- `Herramientas/LEEME.txt`: instrucciones de instalación y ejecución.

## 2. Verificación del código

Verificación local repetida el 24/11/2026 con Node.js v22.16.0 y npm 10.9.2:

- 23 archivos JavaScript verificados.
- 15 páginas HTML validadas.
- 16 pruebas aprobadas y 0 fallidas.
- Solicitud HTTP local a `/` y a `data/productos.json`: ambas respondieron HTTP 200.

El workflow está configurado en `.github/workflows/ci-cd.yml`. No debe afirmarse que GitHub Actions se ejecutó remotamente ni que la web está publicada hasta hacer el primer push y verificar el resultado real. Tampoco se incluye un video MP4: se entrega el guion y las diapositivas, y la grabación/subida a Drive queda pendiente.

## 3. Pasos que faltan para la entrega

1. Completar el DNI en `Editables/06_Consigna_IEFI_Lucas_Romo.docx`.
2. Crear el repositorio individual en GitHub y subir el contenido del ZIP.
3. Configurar GitHub Pages con fuente **GitHub Actions** y comprobar la ejecución del workflow.
4. Verificar la URL pública y reemplazar los campos pendientes dentro del PDF integral y del DOCX de consigna.
5. Grabar un video MP4 de 8 a 12 minutos con la imagen del expositor en un recuadro y subirlo a Drive.
6. Compartir el video con `asenn@ies21.edu.ar` y completar el enlace en el DOCX.
7. Revisar datos comerciales de contacto antes de la publicación pública definitiva.

## 4. Separación entre historia y ampliación

Los informes TP1, TP2, TP3 y TP4 son antecedentes del proceso desarrollado en la cursada. La memoria técnica individual describe las mejoras incorporadas para el IEFI y distingue las funciones implementadas de las acciones externas todavía pendientes. Los PDF anteriores se conservaron como documentos históricos. El archivo de control de copias registra la integridad de los PDF históricos preservados.
