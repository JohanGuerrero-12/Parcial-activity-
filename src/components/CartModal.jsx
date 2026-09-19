import React, { useState } from 'react';
import { getUsuarioActivo, setUsuarioActivo } from '../services/usuarioService';

export function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout   // onCheckout(userData) recibe { nombre, mesa }
}) {
  const [paso, setPaso] = useState('carrito'); // 'carrito' | 'datos'
  const [userData, setUserData] = useState(() => {
    const activo = getUsuarioActivo();
    return { nombre: activo?.nombre || '', mesa: activo?.mesa || '' };
  });
  const [guardandoOrden, setGuardandoOrden] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((total, item) => {
    const numPrice = typeof item.precio === 'number' 
      ? item.precio 
      : parseFloat(String(item.precio || 0).replace(/\./g, '').replace(/,/g, '.')) || 0;
    return total + (numPrice * item.cantidad);
  }, 0);

  const formattedTotal = totalAmount.toLocaleString('es-CO');

  const handleClose = () => {
    setPaso('carrito');
    onClose();
  };

  const handleIrADatos = () => {
    if (cartItems.length === 0) return;
    setPaso('datos');
  };

  const handleConfirmarPedido = async () => {
    if (!userData.nombre.trim()) return;
    setGuardandoOrden(true);
    // Guardar usuario activo en localStorage para futuros pedidos
    setUsuarioActivo({ nombre: userData.nombre.trim(), mesa: userData.mesa.trim() });
    await onCheckout({ nombre: userData.nombre.trim(), mesa: userData.mesa.trim() });
    setGuardandoOrden(false);
    setPaso('carrito');
  };

  return (
    <div className="cart-modal-overlay" onClick={handleClose}>
      <div className="cart-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* ── PASO 1: Carrito ── */}
        {paso === 'carrito' && (
          <>
            <div className="cart-modal-header">
              <div className="cart-title-group">
                <span className="cart-header-icon">🛒</span>
                <h2>Mi Pedido</h2>
                <span className="cart-item-count">
                  {cartItems.reduce((acc, item) => acc + item.cantidad, 0)} ítem(s)
                </span>
              </div>
              <button className="cart-close-btn" onClick={handleClose} aria-label="Cerrar modal">
                ✕
              </button>
            </div>

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

                        <div className="cart-item-qty-controls">
                          <button className="qty-btn minus" onClick={() => onUpdateQuantity(item.id, -1)} title="Disminuir">-</button>
                          <span className="qty-number">{item.cantidad}</span>
                          <button className="qty-btn plus" onClick={() => onUpdateQuantity(item.id, 1)} title="Aumentar">+</button>
                        </div>

                        <div className="cart-item-subtotal">$ {itemSubtotal}</div>

                        <button className="cart-item-remove-btn" onClick={() => onRemoveItem(item.id)} title="Quitar">
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-modal-footer">
                <div className="cart-summary-row">
                  <span className="summary-label">Total a pagar:</span>
                  <span className="summary-total-price">$ {formattedTotal}</span>
                </div>
                <div className="cart-actions-row">
                  <button className="btn-clear-cart" onClick={onClearCart}>Vaciar Pedido</button>
                  <button className="btn-checkout" onClick={handleIrADatos}>
                    🛍️ Confirmar Pedido →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PASO 2: Datos del cliente ── */}
        {paso === 'datos' && (
          <>
            <div className="cart-modal-header">
              <div className="cart-title-group">
                <span className="cart-header-icon">👤</span>
                <h2>Datos del Cliente</h2>
              </div>
              <button className="cart-close-btn" onClick={() => setPaso('carrito')} aria-label="Volver">
                ←
              </button>
            </div>

            <div className="cart-modal-body">
              <div className="checkout-form-wrap">
                <p className="checkout-form-hint">
                  Ingresa tus datos para guardar el cliente y dejar constancia de la compra en el historial.
                </p>

                <div className="form-group">
                  <label htmlFor="checkout-nombre">👤 Tu Nombre *</label>
                  <input
                    type="text"
                    id="checkout-nombre"
                    value={userData.nombre}
                    onChange={(e) => setUserData((p) => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej. María García"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-mesa">🪑 Número de Mesa</label>
                  <input
                    type="text"
                    id="checkout-mesa"
                    value={userData.mesa}
                    onChange={(e) => setUserData((p) => ({ ...p, mesa: e.target.value }))}
                    placeholder="Ej. 4"
                  />
                </div>

                {/* Resumen del pedido */}
                <div className="checkout-summary-box">
                  <h4>📝 Resumen del Pedido</h4>
                  <ul className="checkout-items-summary">
                    {cartItems.map((item) => (
                      <li key={item.id}>
                        <span>{item.nombre} × {item.cantidad}</span>
                        <span>$ {(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="checkout-total-row">
                    <strong>Total:</strong>
                    <strong>$ {formattedTotal}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="cart-modal-footer">
              <div className="cart-actions-row">
                <button className="btn-clear-cart" onClick={() => setPaso('carrito')}>
                  ← Volver
                </button>
                <button
                  className="btn-checkout"
                  onClick={handleConfirmarPedido}
                  disabled={!userData.nombre.trim() || guardandoOrden}
                >
                  {guardandoOrden ? '⏳ Enviando...' : '✅ Enviar Pedido'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartModal;
