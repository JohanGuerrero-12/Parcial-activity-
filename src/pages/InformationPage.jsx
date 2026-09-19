import { useState, useEffect, useMemo } from 'react';
import { getOrdenes } from '../services/orderService';
import { EstadoBadge } from '../components/EstadoBadge';

export function InformationPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenExpandida, setOrdenExpandida] = useState(null);

  const cargarHistorial = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getOrdenes();
      const ordenadas = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        : [];
      setOrdenes(ordenadas);
    } catch (err) {
      setError('No se pudo cargar el historial de compras. Verifica el endpoint /orden en MockAPI.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarHistorial(); }, []);

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return { fecha: '-', hora: '-' };
    try {
      const d = new Date(fechaStr);
      return {
        fecha: d.toLocaleDateString('es-CO', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        hora: d.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch {
      return { fecha: fechaStr, hora: '-' };
    }
  };

  const formatTotal = (total) => {
    const num = typeof total === 'number' ? total : parseFloat(total) || 0;
    return `$${num.toLocaleString('es-CO')}`;
  };

  const nombreCliente = (orden) => orden.usuario || orden.cliente || 'Cliente no registrado';

  const historialFiltrado = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return ordenes;
    return ordenes.filter((orden) => {
      const cliente = nombreCliente(orden).toLowerCase();
      const mesa = String(orden.mesa || '').toLowerCase();
      const productos = Array.isArray(orden.items)
        ? orden.items.map((i) => i.nombre).join(' ').toLowerCase()
        : String(orden.items || '').toLowerCase();
      return cliente.includes(q) || mesa.includes(q) || productos.includes(q) || String(orden.id).includes(q);
    });
  }, [ordenes, busqueda]);

  const totalVentas = historialFiltrado.reduce((acc, o) => {
    const num = typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0;
    return acc + num;
  }, 0);

  const clientesUnicos = new Set(
    historialFiltrado.map((o) => nombreCliente(o).toLowerCase())
  ).size;

  const agrupadoPorDia = useMemo(() => {
    const grupos = [];
    const mapa = new Map();
    historialFiltrado.forEach((orden) => {
      const { fecha } = formatFecha(orden.fecha);
      if (!mapa.has(fecha)) {
        mapa.set(fecha, []);
        grupos.push({ fecha, items: mapa.get(fecha) });
      }
      mapa.get(fecha).push(orden);
    });
    return grupos;
  }, [historialFiltrado]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">🧾 Historial de Compras</h1>
        <p className="admin-subtitle">
          Registro de lo que se vendió: cliente, hora y productos de cada pedido.
        </p>
      </header>

      <div className="ordenes-stats-row">
        <div className="orden-stat-card">
          <span className="stat-number">{historialFiltrado.length}</span>
          <span className="stat-label">Ventas</span>
        </div>
        <div className="orden-stat-card">
          <span className="stat-number">{clientesUnicos}</span>
          <span className="stat-label">Clientes</span>
        </div>
        <div className="orden-stat-card delivered">
          <span className="stat-number">{formatTotal(totalVentas)}</span>
          <span className="stat-label">Total vendido</span>
        </div>
      </div>

      <div className="historial-toolbar">
        <input
          type="search"
          className="historial-search"
          placeholder="Buscar por cliente, mesa o producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-secondary btn-sm" onClick={cargarHistorial}>
          🔄 Actualizar
        </button>
      </div>

      {cargando ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="loading-text">Cargando historial...</p>
        </div>
      ) : error ? (
        <div className="alert-banner error">
          ⚠️ {error}
          <button className="btn-retry" onClick={cargarHistorial}>Reintentar</button>
        </div>
      ) : historialFiltrado.length === 0 ? (
        <div className="empty-table">
          {busqueda
            ? 'No hay compras que coincidan con la búsqueda.'
            : 'Aún no hay compras. Cuando un cliente confirme un pedido, aparecerá aquí.'}
        </div>
      ) : (
        <div className="historial-timeline">
          {agrupadoPorDia.map((grupo) => (
            <section key={grupo.fecha} className="historial-dia">
              <h2 className="historial-dia-titulo">{grupo.fecha}</h2>
              <div className="historial-lista">
                {grupo.items.map((orden) => {
                  const { hora } = formatFecha(orden.fecha);
                  const abierta = ordenExpandida === orden.id;
                  const items = Array.isArray(orden.items) ? orden.items : [];
                  return (
                    <article key={orden.id} className={`historial-card ${abierta ? 'abierta' : ''}`}>
                      <button
                        type="button"
                        className="historial-card-header"
                        onClick={() => setOrdenExpandida(abierta ? null : orden.id)}
                      >
                        <div className="historial-hora">
                          <span className="historial-hora-valor">{hora}</span>
                          <span className="historial-hora-label">Hora</span>
                        </div>
                        <div className="historial-cliente">
                          <strong>{nombreCliente(orden)}</strong>
                          <span className="historial-meta">
                            {orden.mesa ? `Mesa ${orden.mesa}` : 'Sin mesa'}
                            {orden.usuarioId ? ` · Cliente #${orden.usuarioId}` : ''}
                            {' · '}Pedido #{orden.id}
                          </span>
                        </div>
                        <div className="historial-resumen">
                          <EstadoBadge estado={orden.estado || 'pendiente'} />
                          <span className="historial-total">{formatTotal(orden.total)}</span>
                        </div>
                      </button>

                      {abierta && (
                        <div className="historial-card-body">
                          <h4>Productos vendidos</h4>
                          {items.length === 0 ? (
                            <p className="text-muted">Sin detalle de productos.</p>
                          ) : (
                            <ul className="historial-items">
                              {items.map((item, i) => {
                                const precio = typeof item.precio === 'number'
                                  ? item.precio
                                  : parseFloat(item.precio) || 0;
                                return (
                                  <li key={item.id || i}>
                                    <span>{item.nombre} × {item.cantidad}</span>
                                    <span>$ {(precio * (item.cantidad || 1)).toLocaleString('es-CO')}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default InformationPage;
