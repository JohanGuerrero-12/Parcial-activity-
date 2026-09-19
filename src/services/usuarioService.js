const API_URL = "https://6aa6bb76d7765db985078f74.mockapi.io/cliente";
const USER_KEY = "quickorder_usuario_activo";

// ── LocalStorage helpers ──────────────────────────────────────────────────────
export function getUsuarioActivo() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUsuarioActivo(usuario) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  } catch (e) {
    console.error("Error al guardar usuario activo", e);
  }
}

export function clearUsuarioActivo() {
  localStorage.removeItem(USER_KEY);
}

// ── MockAPI CRUD ──────────────────────────────────────────────────────────────
export async function getUsuarios() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener los usuarios");
  return response.json();
}

export async function crearUsuario(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear el usuario");
  return response.json();
}

/** Busca un cliente por nombre (y mesa si existe). Si no está, lo crea en MockAPI. */
export async function buscarOCrearUsuario({ nombre, mesa = "", email = "" }) {
  const nombreNorm = String(nombre || "").trim().toLowerCase();
  const mesaNorm = String(mesa || "").trim();
  if (!nombreNorm) throw new Error("El nombre del cliente es obligatorio");

  const usuarios = await getUsuarios();
  const lista = Array.isArray(usuarios) ? usuarios : [];

  const existente = lista.find((u) => {
    const mismoNombre = String(u.nombre || "").trim().toLowerCase() === nombreNorm;
    if (!mismoNombre) return false;
    if (!mesaNorm) return true;
    return String(u.mesa || "").trim() === mesaNorm;
  });

  if (existente) {
    const mesaActualizada = mesaNorm && String(existente.mesa || "").trim() !== mesaNorm;
    if (mesaActualizada) {
      return actualizarUsuario(existente.id, { ...existente, mesa: mesaNorm });
    }
    return existente;
  }

  return crearUsuario({
    nombre: String(nombre).trim(),
    mesa: mesaNorm,
    email: String(email || "").trim(),
    rol: "cliente",
  });
}

export async function actualizarUsuario(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar el usuario");
  return response.json();
}

export async function eliminarUsuario(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el usuario");
  return response.json();
}
