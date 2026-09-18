import React from 'react';

export function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="success-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon-wrap">🎉</div>
        <h2 className="success-modal-title">¡Compra Exitosa!</h2>
        <p className="success-modal-message">
          ¡Gracias por la compra, vuelva pronto!
        </p>
        <p className="success-modal-subtext">
          Tu pedido está siendo procesado por nuestro equipo.
        </p>
        <button className="btn-success-close" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
