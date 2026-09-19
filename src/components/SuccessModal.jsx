import React from 'react';

export function SuccessModal({ isOpen, onClose, ordenId }) {
  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-container success-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-content">
          <div className="success-icon-wrap">
            <span className="success-icon-big">✅</span>
          </div>

          <h2 className="success-title">¡Pedido Enviado!</h2>

          {ordenId && (
            <div className="success-order-id">
              <span className="order-id-label">Número de orden</span>
              <span className="order-id-value">#{ordenId}</span>
            </div>
          )}

          <p className="success-subtitle">
            Tu pedido ha sido registrado correctamente. Pronto estará listo para ti.
          </p>

          <div className="success-steps">
            <div className="success-step">
              <span className="step-icon">👨‍🍳</span>
              <span>En preparación</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="success-step">
              <span className="step-icon">🔔</span>
              <span>Listo en breve</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="success-step">
              <span className="step-icon">🛍️</span>
              <span>¡A disfrutar!</span>
            </div>
          </div>

          <button className="btn-primary" onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>
            Continuar Explorando
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
