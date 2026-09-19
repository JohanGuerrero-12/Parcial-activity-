const API_URL = "https://6aa6bb76d7765db985078f74.mockapi.io/information";

export async function getInformation() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener la información");
  const data = await response.json();
  // MockAPI devuelve array; tomamos el primer elemento
  return Array.isArray(data) ? data[0] || null : data;
}

export async function crearInformation(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear la información");
  return response.json();
}

export async function actualizarInformation(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar la información");
  return response.json();
}
