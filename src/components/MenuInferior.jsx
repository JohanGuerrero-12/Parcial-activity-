export function MenuInferior({ categorias = [], onSelectCategoria, onSelectVista }) {
  return (
    <div className="footer-column">
      <h4 className="footer-heading">Categorías</h4>
      <ul className="footer-list">
        <li>
          <button onClick={() => {
            if (onSelectVista) onSelectVista('catalogo');
            if (onSelectCategoria) onSelectCategoria('Inicio');
          }}>
            Todos los Productos
          </button>
        </li>
        {categorias.filter(c => c.nombre && c.nombre.toLowerCase() !== 'inicio').map((cat) => (
          <li key={cat.id || cat.nombre}>
            <button onClick={() => {
              if (onSelectVista) onSelectVista('catalogo');
              if (onSelectCategoria) onSelectCategoria(cat.nombre);
            }}>
              {cat.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuInferior;
