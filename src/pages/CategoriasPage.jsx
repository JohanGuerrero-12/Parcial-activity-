import { useState } from 'react';
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '../services/categoryService';

export function CategoriasPage({ categorias, onReloadData }) {
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleEditar = (cat) => {
    setEditandoId(cat.id);
    setNombre(cat.nombre || '');
    setMensaje({ texto: '', tipo: '' });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setNombre('');
    setMensaje({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje({ texto: 'El nombre de la categoría es requerido', tipo: 'error' });
      return;
    }

    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, { nombre: nombre.trim() });
        setMensaje({ texto: 'Categoría actualizada con éxito', tipo: 'exito' });
      } else {
        await crearCategoria({ nombre: nombre.trim() });
        setMensaje({ texto: 'Categoría creada exitosamente', tipo: 'exito' });
      }
      handleCancelar();
      if (onReloadData) await onReloadData();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombreCat) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la categoría "${nombreCat}"?`)) return;

    try {
      await eliminarCategoria(id);
      setMensaje({ texto: `Categoría "${nombreCat}" eliminada.`, tipo: 'exito' });
      if (onReloadData) await onReloadData();
    } catch (err) {
      setMensaje({ texto: `Error al eliminar: ${err.message}`, tipo: 'error' });
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-title">🏷️ Gestión de Categorías</h1>
        <p className="admin-subtitle">
          Crea, edita o elimina las categorías para organizar los productos del catálogo.
        </p>
      </header>

      <div className="admin-grid-layout">
        {/* Form Card */}
        <div className="admin-form-card">
          <div className="form-card-header">
            <h3 className="form-card-title">
              {editandoId ? '✏️ Editar Categoría' : '+ Registrar Nueva Categoría'}
            </h3>
            <p className="form-card-subtitle">
              Ingresa el nombre de la categoría para actualizar las opciones del menú.
            </p>
          </div>

          {mensaje.texto && (
            <div className={`alert-banner ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group full-width">
              <label htmlFor="nombreCat">Nombre de la Categoría *</label>
              <input
                type="text"
                id="nombreCat"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Hamburguesas, Malteadas, Combos..."
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={guardando}
              >
                {guardando 
                  ? 'Guardando...' 
                  : (editandoId ? 'Actualizar Categoría' : 'Guardar Categoría')}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelar}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="admin-table-card">
          <div className="table-card-header">
            <h3>🏷️ Categorías Existentes ({categorias.length})</h3>
          </div>

          {categorias.length === 0 ? (
            <div className="empty-table">No hay categorías registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre de Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id || cat.nombre}>
                      <td>#{cat.id}</td>
                      <td>
                        <span className="cat-name-pill">{cat.nombre}</span>
                      </td>
                      <td className="cell-actions">
                        <button
                          className="btn-icon edit"
                          onClick={() => handleEditar(cat)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleEliminar(cat.id, cat.nombre)}
                        >
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

export default CategoriasPage;
