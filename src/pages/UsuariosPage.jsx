import { useState, useEffect } from 'react';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../services/usuarioService';

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    mesa: '',
    email: '',
    rol: 'cliente',
  });

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar los usuarios. Verifica que el endpoint /usuario existe en MockAPI.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = (usuario) => {
    setEditandoId(usuario.id);
    setFormData({
      nombre: usuario.nombre || '',
      mesa: usuario.mesa || '',
      email: usuario.email || '',
      rol: usuario.rol || 'cliente',
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setFormData({ nombre: '', mesa: '', email: '', rol: 'cliente' });
    setMensaje({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setMensaje({ texto: 'El nombre del usuario es obligatorio', tipo: 'error' });
      return;
    }
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        mesa: formData.mesa.trim(),
        email: formData.email.trim(),
        rol: formData.rol,
      };
      if (editandoId) {
        await actualizarUsuario(editandoId, payload);
        setMensaje({ texto: 'Usuario actualizado correctamente', tipo: 'exito' });
      } else {
        await crearUsuario(payload);
        setMensaje({ texto: 'Usuario creado exitosamente', tipo: 'exito' });
      }
      handleCancelar();
      await cargarUsuarios();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al usuario "${nombre}"?`)) return;
    try {
      await eliminarUsuario(id);
      setMensaje({ texto: `Usuario "${nombre}" eliminado`, tipo: 'exito' });
      await cargarUsuarios();
    } catch (err) {
      setMensaje({ texto: `Error al eliminar: ${err.message}`, tipo: 'error' });
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">👤 Gestión de Usuarios</h1>
        <p className="admin-subtitle">
          Administra los clientes. Al confirmar un pedido se guarda el cliente aquí y su compra queda en el historial.
        </p>
      </header>

      <div className="admin-grid-layout">
        {/* Formulario */}
        <div className="admin-form-card">
          <div className="form-card-header">
            <h3 className="form-card-title">
              {editandoId ? '✏️ Editar Usuario' : '+ Registrar Nuevo Usuario'}
            </h3>
            <p className="form-card-subtitle">
              {editandoId
                ? 'Modifica los datos del usuario seleccionado'
                : 'Ingresa los datos para agregar un usuario'}
            </p>
          </div>

          {mensaje.texto && (
            <div className={`alert-banner ${mensaje.tipo}`}>{mensaje.texto}</div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="u-nombre">Nombre *</label>
                <input
                  type="text"
                  id="u-nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="u-mesa">Mesa</label>
                <input
                  type="text"
                  id="u-mesa"
                  name="mesa"
                  value={formData.mesa}
                  onChange={handleChange}
                  placeholder="Ej. 5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="u-email">Email</label>
                <input
                  type="email"
                  id="u-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej. juan@correo.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="u-rol">Rol</label>
                <select id="u-rol" name="rol" value={formData.rol} onChange={handleChange}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={guardando}>
                {guardando ? 'Guardando...' : (editandoId ? 'Actualizar Usuario' : 'Guardar Usuario')}
              </button>
              {editandoId && (
                <button type="button" className="btn-secondary" onClick={handleCancelar} disabled={guardando}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="admin-table-card">
          <div className="table-card-header">
            <h3>👥 Usuarios Registrados ({usuarios.length})</h3>
            <button className="btn-secondary btn-sm" onClick={cargarUsuarios}>🔄 Actualizar</button>
          </div>

          {cargando ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <div className="alert-banner error">⚠️ {error}</div>
          ) : usuarios.length === 0 ? (
            <div className="empty-table">No hay usuarios registrados aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Mesa</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td><strong>{u.nombre}</strong></td>
                      <td>{u.mesa ? <span className="badge-cat">Mesa {u.mesa}</span> : '-'}</td>
                      <td className="text-muted">{u.email || '-'}</td>
                      <td>
                        <span className={`badge-rol ${u.rol === 'admin' ? 'admin' : 'cliente'}`}>
                          {u.rol === 'admin' ? '🔑 Admin' : '👤 Cliente'}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button className="btn-icon edit" onClick={() => handleEditar(u)}>
                          ✏️ Editar
                        </button>
                        <button className="btn-icon delete" onClick={() => handleEliminar(u.id, u.nombre)}>
                          🗑️ Eliminar
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
    </div>
  );
}

export default UsuariosPage;
