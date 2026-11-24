export const precioARS = (importe) => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0
}).format(Number(importe) || 0);

export function fechaLegible(fecha) {
  if (!fecha) return "A coordinar";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(new Date(`${fecha}T12:00:00`));
}
