import { getUsuarios } from './usuarioService';
import { getEstadosOrden, getEstadoMeta } from './estadoOrdenService';
const API_URL = "https://6aa6bb76d7765db985078f74.mockapi.io/orden";

export function normalizarEstadoOrden(estado) {
  return String(estado || 'pendiente').trim().toLowerCase();
}

export function esOrdenCompletada(orden) {
  return normalizarEstadoOrden(orden?.estado) === 'entregado';
}

export function normalizarOrden(orden, usuarios = [], estados = []) {
  const usuario = Array.isArray(usuarios)
    ? usuarios.find((u) => String(u.id) === String(orden?.usuarioId))
      || usuarios.find((u) => String(u.nombre || '').trim().toLowerCase() === String(orden?.usuario || orden?.cliente || '').trim().toLowerCase())
    : null;

  const estado = normalizarEstadoOrden(orden?.estado);
  const estadoInfo = getEstadoMeta(estado, estados);

  return {
    ...orden,
    usuarioId: orden?.usuarioId ?? usuario?.id ?? null,
    usuario: usuario?.nombre || orden?.usuario || orden?.cliente || 'Cliente no registrado',
    cliente: usuario?.nombre || orden?.cliente || orden?.usuario || 'Cliente no registrado',
    mesa: orden?.mesa || usuario?.mesa || '',
    email: orden?.email || usuario?.email || '',
    estado,
    nombreEstado: estadoInfo.label || 'Sin estado',
    colorEstado: estadoInfo.color || '#6b7280',
  };
}

export async function getOrdenes() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las órdenes");
  return response.json();
}

export async function getOrdenesDetalladas() {
  const [ordenesData, usuariosData, estadosData] = await Promise.all([
    getOrdenes().catch(() => []),
    getUsuarios().catch(() => []),
    getEstadosOrden().catch(() => []),
  ]);

  const usuarios = Array.isArray(usuariosData) ? usuariosData : [];
  const estados = Array.isArray(estadosData) ? estadosData : [];
  const ordenes = Array.isArray(ordenesData) ? ordenesData : [];

  return ordenes.map((orden) => normalizarOrden(orden, usuarios, estados));
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
