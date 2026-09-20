const API_URLS = [
  "https://6aa6bb76d7765db985078f74.mockapi.io/estado_orden",
  "https://6aa6bb76d7765db985078f74.mockapi.io/estadoOrden",
  "https://6aa6bb76d7765db985078f74.mockapi.io/estadoorden",
];

export function normalizarEstadoKey(estado) {
  return String(estado ?? '').trim().toLowerCase().replace(/\s+/g, '_');
}

export function getEstadoMeta(estado, estados = []) {
  const clave = normalizarEstadoKey(estado);
  const encontrado = Array.isArray(estados)
    ? estados.find((item) => normalizarEstadoKey(item?.value ?? item?.nombre ?? item?.label ?? item?.id) === clave)
    : null;

  if (encontrado) {
    return {
      value: clave,
      label: encontrado.label || encontrado.nombre || encontrado.value || clave,
      color: encontrado.color || '#6b7280',
    };
  }

  const fallback = ESTADOS_ORDEN.find((item) => normalizarEstadoKey(item.value) === clave)
    || ESTADOS_ORDEN.find((item) => normalizarEstadoKey(item.label) === clave);

  return fallback || {
    value: clave,
    label: clave.replace(/_/g, ' '),
    color: '#6b7280',
  };
}

export async function getEstadosOrden() {
  let ultimoError = null;

  for (const url of API_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      ultimoError = error;
    }
  }

  if (ultimoError) {
    console.warn('No se pudo cargar estado_orden desde MockAPI, usando respaldo local.', ultimoError);
  }

  return ESTADOS_ORDEN;
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
