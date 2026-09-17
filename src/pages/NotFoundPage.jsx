export function NotFoundPage({ onGoHome }) {
  return (
    <div className="empty-state" style={{ minHeight: '60vh', justifyContent: 'center' }}>
      <span className="empty-icon">🔍</span>
      <h2>404 - Página no encontrada</h2>
      <p>La página que estás buscando no existe o se ha movido.</p>
      <button 
        className="btn-primary" 
        style={{ marginTop: '16px' }}
        onClick={onGoHome}
      >
        Volver al Catálogo
      </button>
    </div>
  );
}

export default NotFoundPage;
