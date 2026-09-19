import { useState, useEffect } from 'react';
import { getOrdenesDetalladas, actualizarOrden, eliminarOrden } from '../services/orderService';
import { ESTADOS_ORDEN } from '../services/estadoOrdenService';
import { EstadoBadge } from '../components/EstadoBadge';

export function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const cargarOrdenes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getOrdenesDetalladas();
      const ordenadas = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        : [];
      setOrdenes(ordenadas);
    } catch (err) {
      setError("No se pudieron cargar las órdenes. Verifica que el endpoint /orden existe en MockAPI.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarOrdenes(); }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarOrden(id, { estado: nuevoEstado });
      setOrdenes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
      );
      setMensaje({ texto: 'Estado actualizado correctamente', tipo: 'exito' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta orden?')) return;
    try {
      await eliminarOrden(id);
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
      setMensaje({ texto: 'Orden eliminada correctamente', tipo: 'exito' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      setMensaje({ texto: `Error al eliminar: ${err.message}`, tipo: 'error' });
    }
  };

  const ordenesFiltradas = filtroEstado === 'todos'
    ? ordenes
    : ordenes.filter((o) => o.estado === filtroEstado);

  const contarPorEstado = (estado) => ordenes.filter((o) => o.estado === estado).length;

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '-';
    try {
      return new Date(fechaStr).toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return fechaStr; }
  };

  const formatTotal = (total) => {
    const num = typeof total === 'number' ? total : parseFloat(total) || 0;
    return `$${num.toLocaleString('es-CO')}`;
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">📋 Gestión de Órdenes</h1>
        <p className="admin-subtitle">
          Visualiza y gestiona todos los pedidos recibidos. Cambia el estado de cada orden en tiempo real.
        </p>
      </header>

      {/* Stats rápidas */}
      <div className="ordenes-stats-row">
        <div className="orden-stat-card">
          <span className="stat-number">{ordenes.length}</span>
          <span className="stat-label">Total Órdenes</span>
        </div>
        <div className="orden-stat-card preparing">
          <span className="stat-number">{contarPorEstado('en_preparacion')}</span>
          <span className="stat-label">En Preparación</span>
        </div>
        <div className="orden-stat-card ready">
          <span className="stat-number">{contarPorEstado('listo')}</span>
          <span className="stat-label">Listos</span>
        </div>
        <div className="orden-stat-card delivered">
          <span className="stat-number">{contarPorEstado('entregado')}</span>
          <span className="stat-label">Entregados</span>
        </div>
      </div>

      {mensaje.texto && (
        <div className={`alert-banner ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* Filtros por estado */}
      <div className="ordenes-filter-bar">
        <span className="filter-label">Filtrar por estado:</span>
        <button
          className={`filter-pill ${filtroEstado === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('todos')}
        >
          Todos ({ordenes.length})
        </button>
        {ESTADOS_ORDEN.filter((e) => e.value !== 'pendiente').map((e) => (
          <button
            key={e.value}
            className={`filter-pill ${filtroEstado === e.value ? 'active' : ''}`}
            onClick={() => setFiltroEstado(e.value)}
            style={filtroEstado === e.value ? { borderColor: e.color, color: e.color } : {}}
          >
            {e.label} ({contarPorEstado(e.value)})
          </button>
        ))}
        <button className="btn-secondary btn-sm" onClick={cargarOrdenes}>
          🔄 Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="admin-table-card">
        <div className="table-card-header">
          <h3>📦 Órdenes ({ordenesFiltradas.length})</h3>
        </div>

        {cargando ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Cargando órdenes...</p>
          </div>
        ) : error ? (
          <div className="alert-banner error">
            ⚠️ {error}
            <button className="btn-retry" onClick={cargarOrdenes}>Reintentar</button>
          </div>
        ) : ordenesFiltradas.length === 0 ? (
          <div className="empty-table">
            {filtroEstado === 'todos'
              ? 'No hay órdenes registradas aún.'
              : `No hay órdenes con estado "${filtroEstado}".`}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#Orden</th>
                  <th>Cliente</th>
                  <th>Mesa</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map((orden) => (
                  <tr key={orden.id}>
                    <td><strong>#{orden.id}</strong></td>
                    <td>{orden.usuario || orden.cliente || '-'}</td>
                    <td>
                      <span className="badge-cat">Mesa {orden.mesa || '-'}</span>
                    </td>
                    <td className="cell-items">
                      {Array.isArray(orden.items) ? (
                        <ul className="orden-items-list">
                          {orden.items.map((item, i) => (
                            <li key={i}>
                              {item.nombre} × {item.cantidad}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">{orden.items || '-'}</span>
                      )}
                    </td>
                    <td className="cell-price">{formatTotal(orden.total)}</td>
                    <td>
                      <EstadoBadge estado={orden.estado || 'pendiente'} />
                    </td>
                    <td className="text-muted cell-fecha">{formatFecha(orden.fecha)}</td>
                    <td className="cell-actions">
                      <select
                        className="select-estado"
                        value={orden.estado || 'pendiente'}
                        onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                        title="Cambiar estado"
                      >
                        {ESTADOS_ORDEN.map((e) => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleEliminar(orden.id)}
                        title="Eliminar orden"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdenesPage;
