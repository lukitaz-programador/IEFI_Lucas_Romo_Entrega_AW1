export function iniciarPreguntasFrecuentes() {
  const buscador = document.querySelector("#buscar-preguntas");
  const items = [...document.querySelectorAll(".faq-item")];
  if (!buscador || !items.length) return;
  const filtrar = () => {
    const consulta = buscador.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    let visibles = 0;
    items.forEach((item) => {
      const coincide = item.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(consulta);
      item.hidden = !coincide;
      if (coincide) visibles++;
    });
    document.querySelector("#preguntas-resultado").textContent = `${visibles} preguntas encontradas`;
  };
  buscador.addEventListener("input", filtrar);
  filtrar();
}
