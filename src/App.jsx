import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getProductos } from './services/productService';
import { getCategorias } from './services/categoryService';
import { crearOrden } from './services/orderService';
import { getUsuarioActivo, setUsuarioActivo, buscarOCrearUsuario } from './services/usuarioService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { OrdenesPage } from './pages/OrdenesPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { InformationPage } from './pages/InformationPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { CartModal } from './components/CartModal';
import { SuccessModal } from './components/SuccessModal';

const AUTH_KEY = 'quickorder_session';

const PERMISOS = {
  admin: ['catalogo', 'productos', 'categorias', 'ordenes', 'usuarios', 'informacion'],
  trabajador: ['catalogo', 'ordenes', 'usuarios', 'informacion'],
};

function getSesionGuardada() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function guardarSesion(usuario) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
  } catch (error) {
    console.error('No se pudo guardar la sesión:', error);
  }
}

function limpiarSesion() {
  localStorage.removeItem(AUTH_KEY);
}

function App() {
  const [usuarioSesion, setUsuarioSesion] = useState(() => getSesionGuardada());
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");

  // Carrito
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  // Datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Usuario activo (desde localStorage)
  const [usuarioActivo, setUsuarioActivoState] = useState(() => getUsuarioActivo());

  useEffect(() => {
    if (!usuarioSesion) return;
    const vistasPermitidas = PERMISOS[usuarioSesion.rol] || [];
    if (!vistasPermitidas.includes(vistaActiva)) {
      setVistaActiva('catalogo');
    }
  }, [usuarioSesion, vistaActiva]);

  const handleLogin = ({ nombre, usuario, rol }) => {
    const sesion = { nombre, usuario, rol };
    setUsuarioSesion(sesion);
    guardarSesion(sesion);
    setVistaActiva('catalogo');
    setCategoriaActiva('Inicio');
  };

  const handleLogout = () => {
    setUsuarioSesion(null);
    limpiarSesion();
    setVistaActiva('catalogo');
    setCategoriaActiva('Inicio');
  };

  // Cargar productos y categorías
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorApi(null);
    try {
      const [dataProductos, dataCategorias] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(Array.isArray(dataProductos) ? dataProductos : []);
      setCategorias(Array.isArray(dataCategorias) ? dataCategorias : []);
    } catch (error) {
      console.error("Error al cargar datos desde MockAPI:", error);
      setErrorApi("No se pudieron cargar los datos de MockAPI. Verifica la conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // ── Carrito ────────────────────────────────────────────────────────────────
  const handleAddToCart = (producto) => {
    setCartItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const handleUpdateQuantity = (productoId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productoId) {
            const nuevaCantidad = item.cantidad + delta;
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productoId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productoId));
  };

  const handleClearCart = () => setCartItems([]);

  // ── Checkout — guarda la orden en MockAPI ──────────────────────────────────
  const handleCheckout = async ({ nombre, mesa }) => {
    const total = cartItems.reduce((acc, item) => {
      const precio = typeof item.precio === 'number'
        ? item.precio
        : parseFloat(String(item.precio || 0).replace(/\./g, '').replace(/,/g, '.')) || 0;
      return acc + precio * item.cantidad;
    }, 0);

    try {
      let clienteGuardado = { id: null, nombre, mesa, email: '' };
      try {
        const cliente = await buscarOCrearUsuario({ nombre, mesa });
        clienteGuardado = {
          id: cliente?.id || null,
          nombre: cliente?.nombre || nombre,
          mesa: cliente?.mesa || mesa,
          email: cliente?.email || '',
        };
      } catch (userErr) {
        console.error("No se pudo guardar el cliente en Usuarios:", userErr);
      }

      const ordenData = {
        usuarioId: clienteGuardado.id,
        usuario: clienteGuardado.nombre,
        cliente: clienteGuardado.nombre,
        mesa: clienteGuardado.mesa,
        email: clienteGuardado.email,
        items: cartItems.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
        })),
        total,
        estado: 'pendiente',
        fecha: new Date().toISOString(),
      };

      const ordenCreada = await crearOrden(ordenData);
      setOrdenId(ordenCreada?.id || null);
      const activo = {
        id: clienteGuardado.id,
        nombre: clienteGuardado.nombre,
        mesa: clienteGuardado.mesa,
      };
      setUsuarioActivo(activo);
      setUsuarioActivoState(activo);
    } catch (err) {
      console.error("Error al guardar la orden:", err);
      setOrdenId(null);
    } finally {
      setCartItems([]);
      setIsCartOpen(false);
      setShowSuccessModal(true);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  // ── Renderizado de vista activa ────────────────────────────────────────────
  const renderPaginaActiva = () => {
    const vistasPermitidas = PERMISOS[usuarioSesion?.rol] || [];

    if (!usuarioSesion) {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (!vistasPermitidas.includes(vistaActiva)) {
      return <OrdenesPage />;
    }

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
      case "ordenes":
        return <OrdenesPage />;
      case "usuarios":
        return <UsuariosPage />;
      case "informacion":
        return <InformationPage />;
      default:
        return <NotFoundPage onGoHome={() => setVistaActiva("catalogo")} />;
    }
  };

  if (!usuarioSesion) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <Header
        vistaActiva={vistaActiva}
        onSelectVista={setVistaActiva}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        usuarioActivo={usuarioActivo}
        usuarioSesion={usuarioSesion}
        onLogout={handleLogout}
      />

      <main className="app-container">
        {errorApi && (
          <div className="alert-banner error text-center">
            ⚠️ {errorApi}
            <button className="btn-retry" onClick={cargarDatos}>Reintentar</button>
          </div>
        )}
        {renderPaginaActiva()}
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); setOrdenId(null); }}
        ordenId={ordenId}
      />

      <Footer
        categorias={categorias}
        onSelectCategoria={setCategoriaActiva}
        onSelectVista={setVistaActiva}
        rol={usuarioSesion?.rol}
      />
    </div>
  );
}

export default App;
