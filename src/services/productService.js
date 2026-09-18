const API_URL = "https://6a9b0ab70ad174e139e8801b.mockapi.io/QuickOrder";
const HIDDEN_IDS_KEY = "quickorder_hidden_ids";

function getHiddenIds() {
  try {
    const data = localStorage.getItem(HIDDEN_IDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function addHiddenId(id) {
  try {
    const hidden = getHiddenIds();
    const stringId = String(id);
    if (!hidden.includes(stringId)) {
      hidden.push(stringId);
      localStorage.setItem(HIDDEN_IDS_KEY, JSON.stringify(hidden));
    }
  } catch (e) {
    console.error("Error al guardar id oculto", e);
  }
}

export async function getProductos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener los productos");
  const data = await response.json();
  const hidden = getHiddenIds();

  if (Array.isArray(data)) {
    return data.filter(item => !hidden.includes(String(item.id)));
  }
  return [];
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
  try {
    // Intentar actualizar directamente en MockAPI (funciona para items con ID válido en la API)
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoData),
    });

    if (response.ok) {
      return await response.json();
    }

    // Si MockAPI responde 404 (productos iniciales 1-16 sin ruta PUT directa):
    if (response.status === 404) {
      // 1. Guardar la versión actualizada con POST (obtiene ID nuevo en MockAPI)
      const postResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
      });

      if (postResponse.ok) {
        // 2. Reemplazar y ocultar el ID antiguo para evitar duplicados
        addHiddenId(id);
        return await postResponse.json();
      }
    }
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
  }

  throw new Error("Error al actualizar el producto");
}

export async function eliminarProducto(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return true;
    }

    if (response.status === 404) {
      addHiddenId(id);
      return true;
    }
  } catch (err) {
    console.error("Error al eliminar producto:", err);
  }

  addHiddenId(id);
  return true;
}
