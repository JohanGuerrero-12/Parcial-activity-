import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getProductos } from './services/productService';
import { getCategorias } from './services/categoryService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const [vistaActiva, setVistaActiva] = useState("catalogo"); // "catalogo" | "productos" | "categorias"
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [cartCount, setCartCount] = useState(0);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Cargar datos desde MockAPI usando los servicios
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorApi(null);
    try {
      const [dataProductos, dataCategorias] = await Promise.all([
        getProductos(),
        getCategorias()
      ]);
      setProductos(Array.isArray(dataProductos) ? dataProductos : []);
      setCategorias(Array.isArray(dataCategorias) ? dataCategorias : []);
    } catch (error) {
      console.error("Error al cargar los datos desde MockAPI:", error);
      setErrorApi("No se pudieron cargar los datos de MockAPI. Verifica la conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const renderPaginaActiva = () => {
    switch (vistaActiva) {
      case "catalogo":
        return (
          <CatalogoPage
            categoriaActiva={categoriaActiva}
            productos={productos}
            cargando={cargando}
            onAddToCart={handleAddToCart}
          />
        );
      case "productos":
        return (
          <ProductosPage
            productos={productos}
            categorias={categorias}
            onReloadData={cargarDatos}
          />
        );
      case "categorias":
        return (
          <CategoriasPage
            categorias={categorias}
            onReloadData={cargarDatos}
          />
        );
      default:
        return (
          <NotFoundPage 
            onGoHome={() => setVistaActiva("catalogo")} 
          />
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Header con menú de navegación y selección de vistas */}
      <Header
        vistaActiva={vistaActiva}
        onSelectVista={setVistaActiva}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
      />

      <main className="app-container">
        {errorApi && (
          <div className="alert-banner error text-center">
            ⚠️ {errorApi}
            <button className="btn-retry" onClick={cargarDatos}>Reintentar</button>
          </div>
        )}

        {/* Vista Renderizada */}
        {renderPaginaActiva()}
      </main>

      {/* Footer con links y categorías */}
      <Footer 
        categorias={categorias}
        onSelectCategoria={setCategoriaActiva} 
        onSelectVista={setVistaActiva}
      />
    </div>
  );
}

export default App;
