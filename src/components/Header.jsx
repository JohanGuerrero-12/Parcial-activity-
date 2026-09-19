import { Menu } from './Menu';

export function Header({
  vistaActiva,
  onSelectVista,
  categorias,
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  onOpenCart,
  usuarioActivo,
}) {
  const esAdmin = vistaActiva !== 'catalogo';

  return (
    <header className="header-navbar">
      <div className="header-inner">
        {/* Brand / Logo */}
        <div className="header-brand-group">
          <div className="header-brand" onClick={() => onSelectVista('catalogo')}>
            <div className="brand-logo">†</div>
            <span className="brand-name">Dulce<span className="brand-highlight">Bendición</span></span>
          </div>

          {esAdmin && (
            <span className="admin-badge">Modo Administración</span>
          )}
        </div>

        {/* Category nav (solo en catálogo) */}
        {vistaActiva === 'catalogo' && (
          <Menu
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={onSelectCategoria}
          />
        )}

        {/* Actions */}
        <div className="header-actions">
          <nav className="view-switcher">
            {/* Catálogo */}
            <button
              className={`nav-tab ${vistaActiva === 'catalogo' ? 'active' : ''}`}
              onClick={() => onSelectVista('catalogo')}
            >
              <span className="tab-icon">🛍️</span> Catálogo
            </button>

            {/* Grupo Admin */}
            <div className="nav-tab-group">
              <button
                className={`nav-tab ${vistaActiva === 'productos' ? 'active' : ''}`}
                onClick={() => onSelectVista('productos')}
              >
                <span className="tab-icon">🛠️</span> Productos
              </button>
              <button
                className={`nav-tab ${vistaActiva === 'categorias' ? 'active' : ''}`}
                onClick={() => onSelectVista('categorias')}
              >
                <span className="tab-icon">🏷️</span> Categorías
              </button>
              <button
                className={`nav-tab ${vistaActiva === 'ordenes' ? 'active' : ''}`}
                onClick={() => onSelectVista('ordenes')}
              >
                <span className="tab-icon">📋</span> Órdenes
              </button>
              <button
                className={`nav-tab ${vistaActiva === 'usuarios' ? 'active' : ''}`}
                onClick={() => onSelectVista('usuarios')}
              >
                <span className="tab-icon">👤</span> Usuarios
              </button>
              <button
                className={`nav-tab ${vistaActiva === 'informacion' ? 'active' : ''}`}
                onClick={() => onSelectVista('informacion')}
              >
                <span className="tab-icon">🧾</span> Historial
              </button>
            </div>
          </nav>

          {/* Usuario activo + Carrito */}
          <div className="header-right-group">
            {usuarioActivo && (
              <div className="usuario-chip">
                <span className="usuario-chip-icon">👤</span>
                <span className="usuario-chip-name">{usuarioActivo.nombre}</span>
                {usuarioActivo.mesa && (
                  <span className="usuario-chip-mesa">Mesa {usuarioActivo.mesa}</span>
                )}
              </div>
            )}

            {vistaActiva === 'catalogo' && (
              <button className="cart-button" onClick={onOpenCart} title="Ver mi pedido">
                <span className="cart-icon">🛒</span>
                <span className="cart-label">Mi Pedido</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
