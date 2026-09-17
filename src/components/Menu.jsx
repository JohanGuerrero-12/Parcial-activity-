function capitalizar(texto) {
  if (!texto) return "";
  return texto
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

export function Menu({ categorias = [], categoriaActiva = "Inicio", onSelectCategoria }) {
  const tieneInicio = categorias.some(c => c.nombre && c.nombre.toLowerCase() === "inicio");

  return (
    <nav className="nav-categories">
      {!tieneInicio && (
        <button
          className={`category-pill ${categoriaActiva === "Inicio" ? 'active' : ''}`}
          onClick={() => onSelectCategoria("Inicio")}
        >
          Inicio
        </button>
      )}

      {categorias.map((cat) => {
        const label = capitalizar(cat.nombre);
        const isActive = categoriaActiva.toLowerCase() === label.toLowerCase();
        return (
          <button
            key={cat.id || cat.nombre}
            className={`category-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategoria(label)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export default Menu;
