import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'CONSULTA' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'No se pudo registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-panel">
      <h1>Crear cuenta</h1>
      <p>Registra un usuario del Mundial para acceder al panel.</p>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="rol">Rol</label>
          <select id="rol" name="rol" value={form.rol} onChange={handleChange}>
            <option value="CONSULTA">CONSULTA</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#7dd3fc' }}>Inicia sesión</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
