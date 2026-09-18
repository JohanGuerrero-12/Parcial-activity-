import { Menu } from './Menu';

export function Header({
  vistaActiva,
  onSelectVista,
  categorias,
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  onOpenCart
}) {
  return (
    <header className="header-navbar">
      <div className="header-inner">
        {/* Brand / Logo */}
        <div className="header-brand-group">
          <div className="header-brand" onClick={() => onSelectVista('catalogo')}>
            <div className="brand-logo">†</div>
            <span className="brand-name">Dulce<span className="brand-highlight">Bendición</span></span>
          </div>

          {vistaActiva !== 'catalogo' && (
            <span className="admin-badge">Modo Administración</span>
          )}
        </div>

        {/* Dynamic Category Navigation Menu (Visible on Catalog view) */}
        {vistaActiva === 'catalogo' && (
          <Menu
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={onSelectCategoria}
          />
        )}

        {/* View Navigation Switcher & Cart */}
        <div className="header-actions">
          <nav className="view-switcher">
            <button
              className={`nav-tab ${vistaActiva === 'catalogo' ? 'active' : ''}`}
              onClick={() => onSelectVista('catalogo')}
            >
              <span className="tab-icon">🛍️</span> Catálogo
            </button>

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
          </nav>

          {vistaActiva === 'catalogo' && (
            <button className="cart-button" onClick={onOpenCart} title="Ver mi pedido">
              <span className="cart-icon">🛒</span>
              <span className="cart-label">Mi Pedido</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
