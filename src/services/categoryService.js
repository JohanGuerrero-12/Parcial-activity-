const API_URL = "https://6a9b0ab70ad174e139e8801b.mockapi.io/categorias";

export async function getCategorias() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las categorías");
  return response.json();
}

export async function crearCategoria(categoriaData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoriaData),
  });
  if (!response.ok) throw new Error("Error al crear la categoría");
  return response.json();
}

export async function actualizarCategoria(id, categoriaData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoriaData),
  });
  if (!response.ok) throw new Error("Error al actualizar la categoría");
  return response.json();
}

export async function eliminarCategoria(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la categoría");
  return response.json();
}
