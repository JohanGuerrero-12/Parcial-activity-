import { useState } from 'react';

const USUARIOS_DEMO = [
  { usuario: 'admin', password: 'admin123', rol: 'admin', nombre: 'Administrador' },
  { usuario: 'administrador', password: 'admin123', rol: 'admin', nombre: 'Administrador' },
  { usuario: 'trabajador', password: 'trabajador123', rol: 'trabajador', nombre: 'Trabajador' },
  { usuario: 'empleado', password: 'trabajador123', rol: 'trabajador', nombre: 'Trabajador' },
];

export function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const usuario = String(formData.usuario).trim().toLowerCase();
    const password = String(formData.password).trim();

    const usuarioEncontrado = USUARIOS_DEMO.find(
      (item) => item.usuario === usuario && item.password === password
    );

    if (!usuarioEncontrado) {
      setError('Credenciales incorrectas. Usa admin / admin123 o trabajador / trabajador123.');
      return;
    }

    setError('');
    onLogin({
      nombre: usuarioEncontrado.nombre,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
    });
  };

  return (
    <div className="login-shell">
      <div className="admin-form-card login-card">
        <div className="form-card-header">
          <h1 className="admin-title">QuickOrder</h1>
          <p className="form-card-subtitle">Inicia sesión para acceder al sistema</p>
        </div>

        {error && <div className="alert-banner error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="login-user">Usuario</label>
            <input
              id="login-user"
              name="usuario"
              type="text"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="admin o trabajador"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="login-hint">
            <strong>Credenciales demo:</strong>
            <span>Admin: admin / admin123</span>
            <span>Trabajador: trabajador / trabajador123</span>
          </div>

          <button type="submit" className="btn-primary">Entrar al sistema</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
