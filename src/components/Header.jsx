import { Menu } from './Menu';

export function Header({
  vistaActiva,
  onSelectVista,
  categorias,
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  onOpenCart,
  usuarioSesion,
  onLogout,
}) {
  const esAdmin = usuarioSesion?.rol === 'admin';

  return (
    <header className="header-navbar">
      <div className="header-inner">
        <div className="header-brand-group">
          <div className="header-brand" onClick={() => onSelectVista('catalogo')}>
            <div className="brand-logo">†</div>
            <span className="brand-name">Dulce<span className="brand-highlight">Bendición</span></span>
          </div>

          {esAdmin && <span className="admin-badge">Modo Administración</span>}
          {!esAdmin && <span className="admin-badge">Modo Trabajador</span>}
        </div>

        {vistaActiva === 'catalogo' && (
          <Menu
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={onSelectCategoria}
          />
        )}

        <div className="header-actions">
          <nav className="view-switcher">
            <button
              className={`nav-tab ${vistaActiva === 'catalogo' ? 'active' : ''}`}
              onClick={() => onSelectVista('catalogo')}
            >
              <span className="tab-icon">🛍️</span> Catálogo
            </button>

            <div className="nav-tab-group">
              {esAdmin && (
                <>
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
                </>
              )}

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
                <span className="tab-icon">👤</span> Clientes
              </button>
              <button
                className={`nav-tab ${vistaActiva === 'informacion' ? 'active' : ''}`}
                onClick={() => onSelectVista('informacion')}
              >
                <span className="tab-icon">🧾</span> Historial
              </button>
            </div>
          </nav>

          <div className="header-right-group">
            {usuarioSesion && (
              <>
                <div className="usuario-chip">
                  <span className="usuario-chip-icon">{esAdmin ? '🔑' : '🧑‍💼'}</span>
                  <span className="usuario-chip-name">{usuarioSesion.nombre}</span>
                  <span className="usuario-chip-mesa">{esAdmin ? 'Admin' : 'Trabajador'}</span>
                </div>
                <button className="btn-secondary btn-sm" onClick={onLogout}>Cerrar sesión</button>
              </>
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
