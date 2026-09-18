import React from 'react';

export function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout 
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((total, item) => {
    const numPrice = typeof item.precio === 'number' 
      ? item.precio 
      : parseFloat(String(item.precio || 0).replace(/\./g, '').replace(/,/g, '.')) || 0;
    return total + (numPrice * item.cantidad);
  }, 0);

  const formattedTotal = totalAmount.toLocaleString('es-CO');

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-modal-header">
          <div className="cart-title-group">
            <span className="cart-header-icon">🛒</span>
            <h2>Mi Pedido</h2>
            <span className="cart-item-count">
              {cartItems.reduce((acc, item) => acc + item.cantidad, 0)} ítem(s)
            </span>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <span className="cart-empty-icon">🛍️</span>
              <h3>Tu pedido está vacío</h3>
              <p>Agrega productos deliciosos desde el catálogo para iniciar tu pedido.</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemPriceNum = typeof item.precio === 'number' 
                  ? item.precio 
                  : parseFloat(String(item.precio || 0).replace(/\./g, '').replace(/,/g, '.')) || 0;
                const itemSubtotal = (itemPriceNum * item.cantidad).toLocaleString('es-CO');

                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-img-wrap">
                      {item.imagen ? (
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          className="cart-item-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = 'flex';
                            }
                          }} 
                        />
                      ) : null}
                      <div className="cart-item-placeholder" style={{ display: item.imagen ? 'none' : 'flex' }}>
                        🍔
                      </div>
                    </div>

                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.nombre}</h4>
                      <p className="cart-item-unit-price">$ {itemPriceNum.toLocaleString('es-CO')} c/u</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-item-qty-controls">
                      <button 
                        className="qty-btn minus" 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        title="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="qty-number">{item.cantidad}</span>
                      <button 
                        className="qty-btn plus" 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        title="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      $ {itemSubtotal}
                    </div>

                    <button 
                      className="cart-item-remove-btn" 
                      onClick={() => onRemoveItem(item.id)}
                      title="Quitar producto del pedido"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-summary-row">
              <span className="summary-label">Total a pagar:</span>
              <span className="summary-total-price">$ {formattedTotal}</span>
            </div>

            <div className="cart-actions-row">
              <button className="btn-clear-cart" onClick={onClearCart}>
                Vaciar Pedido
              </button>

              <button className="btn-checkout" onClick={onCheckout}>
                🛍️ Comprar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
