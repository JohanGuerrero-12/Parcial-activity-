import { MenuInferior } from './MenuInferior';

export function Footer({ categorias, onSelectCategoria, onSelectVista }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <div className="footer-brand">
            <span className="brand-logo">†</span>
            <span className="brand-name">Dulce<span className="brand-highlight">Bendicion</span></span>
          </div>
          <p className="footer-description">
            Tu comida favorita lista para ordenar de forma rápida, fresca , sin complicaciones y con bendicion.
          </p>
        </div>

        <div className="footer-links-group">
          {/* Componente del Menú de Opciones del Pie de Página */}
          <MenuInferior 
            categorias={categorias} 
            onSelectCategoria={onSelectCategoria} 
            onSelectVista={onSelectVista}
          />

          <div className="footer-column">
            <h4 className="footer-heading">Contacto & Horarios</h4>
            <p className="footer-info">📍 Av. Principal #123, Ciudad</p>
            <p className="footer-info">🕒 Lunes a Domingo: 11:00 AM - 10:00 PM</p>
            <p className="footer-info">📞 +57 300 000 0000</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DulceBendicion. Todos las Bendiciones en camino.</p>
      </div>
    </footer>
  );
}

export default Footer;
