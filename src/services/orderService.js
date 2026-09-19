const API_URL = "https://6aa6bb76d7765db985078f74.mockapi.io/orden";

export async function getOrdenes() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las órdenes");
  return response.json();
}

export async function crearOrden(ordenData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ordenData),
  });
  if (!response.ok) throw new Error("Error al crear la orden");
  return response.json();
}

export async function actualizarOrden(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar la orden");
  return response.json();
}

export async function eliminarOrden(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la orden");
  return response.json();
}
