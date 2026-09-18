import { Product } from '../components/Product';

export function CatalogoPage({ 
  categoriaActiva, 
  productos, 
  cargando, 
  onAddToCart 
}) {
  const productosFiltrados = (categoriaActiva === "Inicio" || categoriaActiva === "Todos")
    ? productos
    : productos.filter(p => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <div className="catalog-view">
      {/* Banner Hero */}
      <section className="hero-banner">
        <div className="banner-badge">🔥 Menú Rápido & Delicioso</div>
        <h1 className="banner-title">Pide tus Platillos Favoritos al Instante</h1>
        <p className="banner-subtitle">
          Explora nuestro menú seleccionado, ingredientes frescos y entrega rápida a tu mesa o domicilio.
        </p>
      </section>

      {/* Catalog Header */}
      <section className="catalog-header">
        <div>
          <h2 className="catalog-title">
            {categoriaActiva === "Inicio" ? "Todos los Productos" : categoriaActiva}
          </h2>
          <p className="catalog-count">{productosFiltrados.length} producto(s) disponibles</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="product-grid">
        {cargando ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Cargando productos del catálogo...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <h3>No hay productos en esta categoría</h3>
            <p>Selecciona otra categoría o agrega nuevos productos desde el panel de administración.</p>
          </div>
        ) : (
          productosFiltrados.map((producto) => (
            <Product
              key={producto.id}
              indice={producto.id}
              nombre={producto.nombre}
              categoria={producto.categoria}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen={producto.imagen}
              tag={producto.tag || producto.Etiqueta}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default CatalogoPage;
