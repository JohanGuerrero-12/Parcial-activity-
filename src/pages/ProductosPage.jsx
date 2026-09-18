import { useState } from 'react';
import { crearProducto, actualizarProducto, eliminarProducto } from '../services/productService';

export function ProductosPage({ productos, categorias, onReloadData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: categorias[0]?.nombre || 'Hamburguesas',
    tag: '',
    imagen: '',
    descripcion: ''
  });

  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setFormData({
      nombre: producto.nombre || '',
      precio: producto.precio !== undefined ? String(producto.precio) : '',
      categoria: producto.categoria || (categorias[0]?.nombre || 'Hamburguesas'),
      tag: producto.tag || producto.Etiqueta || '',
      imagen: producto.imagen || '',
      descripcion: producto.descripcion || ''
    });
    setMensaje({ texto: '', tipo: '' });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormData({
      nombre: '',
      precio: '',
      categoria: categorias[0]?.nombre || 'Hamburguesas',
      tag: '',
      imagen: '',
      descripcion: ''
    });
    setMensaje({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setMensaje({ texto: 'El nombre del producto es obligatorio', tipo: 'error' });
      return;
    }
    if (!formData.precio) {
      setMensaje({ texto: 'El precio es obligatorio', tipo: 'error' });
      return;
    }

    const precioLimpio = typeof formData.precio === 'number' 
      ? formData.precio 
      : parseFloat(String(formData.precio).replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '.').trim()) || 0;

    const payload = {
      nombre: formData.nombre.trim(),
      precio: precioLimpio,
      categoria: formData.categoria || 'Hamburguesas',
      tag: formData.tag.trim(),
      Etiqueta: formData.tag.trim(),
      imagen: formData.imagen.trim(),
      descripcion: formData.descripcion.trim()
    };

    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      if (editandoId) {
        await actualizarProducto(editandoId, payload);
        setMensaje({ texto: '¡Producto actualizado correctamente!', tipo: 'exito' });
      } else {
        await crearProducto(payload);
        setMensaje({ texto: '¡Producto registrado con éxito!', tipo: 'exito' });
      }
      handleCancelarEdicion();
      if (onReloadData) await onReloadData();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) return;

    try {
      await eliminarProducto(id);
      setMensaje({ texto: `Producto "${nombre}" eliminado.`, tipo: 'exito' });
      if (onReloadData) await onReloadData();
    } catch (err) {
      setMensaje({ texto: `Error al eliminar: ${err.message}`, tipo: 'error' });
    }
  };

  return (
    <div className="admin-container">
      {/* Encabezado de Sección */}
      <header className="admin-header">
        <h1 className="admin-title">🛠️ Gestión de Productos</h1>
        <p className="admin-subtitle">
          Registra nuevos productos o edita/elimina los productos existentes en el catálogo.
        </p>
      </header>

      {/* Form Card */}
      <div className="admin-form-card">
        <div className="form-card-header">
          <h3 className="form-card-title">
            {editandoId ? '✏️ Editar Producto' : '+ Registrar Nuevo Producto'}
          </h3>
          <p className="form-card-subtitle">
            {editandoId 
              ? 'Modifica los datos del producto seleccionado y guarda los cambios'
              : 'Ingresa los datos para agregar un producto al catálogo'}
          </p>
        </div>

        {mensaje.texto && (
          <div className={`alert-banner ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Hamburguesa Especial Quick"
                required
              />
            </div>

            {/* Precio */}
            <div className="form-group">
              <label htmlFor="precio">Precio ($) *</label>
              <input
                type="text"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Ej. 18500 o $18.500"
                required
              />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                {categorias
                  .filter(c => c.nombre && c.nombre.toLowerCase() !== 'inicio')
                  .map(cat => (
                    <option key={cat.id || cat.nombre} value={cat.nombre}>
                      {cat.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Etiqueta */}
            <div className="form-group">
              <label htmlFor="tag">Etiqueta (Opcional)</label>
              <input
                type="text"
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Ej. Popular, Nuevo, Combo"
              />
            </div>
          </div>

          {/* URL de la Imagen */}
          <div className="form-group full-width">
            <label htmlFor="imagen">URL de la Imagen</label>
            <input
              type="url"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Descripción */}
          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles sobre los ingredientes o características del producto..."
            />
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={guardando}
            >
              {guardando 
                ? 'Guardando...' 
                : (editandoId ? 'Actualizar Producto' : 'Guardar Producto')}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de Productos Existentes */}
      <div className="admin-table-card">
        <div className="table-card-header">
          <h3>📦 Lista de Productos ({productos.length})</h3>
        </div>

        {productos.length === 0 ? (
          <div className="empty-table">No hay productos registrados.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Etiqueta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="cell-img">
                      {prod.imagen ? (
                        <img src={prod.imagen} alt={prod.nombre} className="thumb-img" />
                      ) : (
                        <div className="thumb-placeholder">🍔</div>
                      )}
                    </td>
                    <td className="cell-title">
                      <strong>{prod.nombre}</strong>
                      <p className="cell-sub">{prod.descripcion}</p>
                    </td>
                    <td>
                      <span className="badge-cat">{prod.categoria || 'Sin cat.'}</span>
                    </td>
                    <td className="cell-price">
                      ${typeof prod.precio === 'number' ? prod.precio.toLocaleString('es-CO') : prod.precio}
                    </td>
                    <td>
                      {(prod.tag || prod.Etiqueta) ? <span className="badge-tag">{prod.tag || prod.Etiqueta}</span> : '-'}
                    </td>
                    <td className="cell-actions">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEditar(prod)}
                        title="Editar producto"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleEliminar(prod.id, prod.nombre)}
                        title="Eliminar producto"
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
  );
}

export default ProductosPage;
