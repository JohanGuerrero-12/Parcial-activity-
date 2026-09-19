import { MenuInferior } from './MenuInferior';

export function Footer({ categorias, onSelectCategoria, onSelectVista, rol }) {
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
          <MenuInferior 
            categorias={categorias} 
            onSelectCategoria={onSelectCategoria} 
            onSelectVista={onSelectVista}
          />

          <div className="footer-column">
            <h4 className="footer-heading">Contacto & Horarios</h4>
            <p className="footer-info">📍 Av. 19# 23-31 Barrio Santander #123, Cúcuta</p>
            <p className="footer-info">🕒 Lunes a Domingo: 8:00 AM - 9:00 PM</p>
            <p className="footer-info">📞 +57 312 351 4310</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DulceBendicion. Todas las Bendiciones en camino.</p>
      </div>
    </footer>
  );
}

export default Footer;
