import { ESTADOS_ORDEN } from '../services/estadoOrdenService';

export function EstadoBadge({ estado }) {
  const config = ESTADOS_ORDEN.find((e) => e.value === estado) || {
    label: estado || "Sin estado",
    color: "#6b7280",
  };

  const iconos = {
    pendiente:      "🟡",
    en_preparacion: "🔵",
    listo:          "🟢",
    entregado:      "✅",
    cancelado:      "🔴",
  };

  return (
    <span
      className="estado-badge"
      style={{
        backgroundColor: config.color + "22",
        color: config.color,
        border: `1px solid ${config.color}55`,
      }}
    >
      {iconos[estado] || "⚪"} {config.label}
    </span>
  );
}

export default EstadoBadge;
