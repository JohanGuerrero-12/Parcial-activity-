export function Product({ indice, nombre, categoria, descripcion, precio, imagen, tag, onAddToCart }) {
  const precioNumerico = typeof precio === 'number'
    ? precio
    : (typeof precio === 'string' ? parseFloat(precio.replace(/\./g, '').replace(/,/g, '.')) || 0 : 0);

  const precioFormateado = typeof precio === 'number'
    ? precio.toLocaleString('es-CO')
    : (precioNumerico > 0 ? precioNumerico.toLocaleString('es-CO') : (precio ?? '0'));

  const esLimon = Boolean(nombre && /limon|limonada|limones/i.test(nombre));

  return (
    <article className="product-card" key={indice}>
      <div className="product-image-container">
        {tag && <span className="product-tag">{tag}</span>}
        {imagen ? (
          <img 
            src={imagen} 
            alt={nombre || "Producto"} 
            className="product-image" 
            loading="lazy" 
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'flex';
              }
            }} 
          />
        ) : null}
        <div className="product-image-placeholder" style={{ display: imagen ? 'none' : 'flex' }}>🍔</div>
      </div>
      <div className="product-content">
        <h3 className="product-title">{nombre}</h3>
        <p className="product-description">{descripcion}</p>

        {/* Mes de la Hamburguesa */}
        {categoria && categoria.toLowerCase().includes("hamburguesa") && (
          <p className="mensaje-promo">
            🍔 10% de descuento especial por el Mes de la Hamburguesa
          </p>
        )}

        {/* Temporada baja de limones */}
        {esLimon && (
          <p className="mensaje-no-disponible">
            ⚠️ Producto no disponible temporalmente por temporada baja de limones
          </p>
        )}

        <div className="product-footer">
          <div className="price-wrapper">
            <span className="price-label">Precio</span>
            <span className="product-price">
              $ {precioFormateado}
            </span>
            {precioNumerico > 50000 && (
              <p className="mensaje-descuento">
                ¡Este producto tiene un 15% de descuento adicional!
              </p>
            )}
          </div>
          <button
            className="btn-add-order"
            onClick={() => !esLimon && onAddToCart && onAddToCart(nombre)}
            disabled={esLimon}
            style={esLimon ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <span className="btn-plus">+</span> {esLimon ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default Product;
