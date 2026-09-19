const API_URL = "https://6aa6bb76d7765db985078f74.mockapi.io/estado_orden";

export async function getEstadosOrden() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener los estados");
  return response.json();
}

export async function crearEstadoOrden(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear el estado");
  return response.json();
}

export async function actualizarEstadoOrden(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar el estado");
  return response.json();
}

export async function eliminarEstadoOrden(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el estado");
  return response.json();
}

// Estados por defecto usados en la app (sin depender de la API)
export const ESTADOS_ORDEN = [
  { value: "pendiente",       label: "Pendiente",       color: "#f59e0b" },
  { value: "en_preparacion",  label: "En Preparación",  color: "#3b82f6" },
  { value: "listo",           label: "Listo",           color: "#10b981" },
  { value: "entregado",       label: "Entregado",       color: "#6b7280" },
  { value: "cancelado",       label: "Cancelado",       color: "#ef4444" },
];
