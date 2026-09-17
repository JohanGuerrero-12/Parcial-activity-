const API_URL = "https://6a9b0ab70ad174e139e8801b.mockapi.io/QuickOrder";

export async function getProductos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener los productos");
  return response.json();
}

export async function crearProducto(productoData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productoData),
  });
  if (!response.ok) throw new Error("Error al crear el producto");
  return response.json();
}

export async function actualizarProducto(id, productoData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productoData),
  });
  if (!response.ok) throw new Error("Error al actualizar el producto");
  return response.json();
}

export async function eliminarProducto(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el producto");
  return response.json();
}
