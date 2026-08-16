import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/selecciones', label: 'Selecciones' },
  { to: '/partidos', label: 'Partidos' },
  { to: '/tabla', label: 'Tabla' }
];

function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand">
            <span className="brand-badge">WC</span>
            <span>World Cup</span>
          </Link>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-badge">{user?.email}</span>
              <button className="btn btn-secondary" onClick={async () => { await logout(); navigate('/'); }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
