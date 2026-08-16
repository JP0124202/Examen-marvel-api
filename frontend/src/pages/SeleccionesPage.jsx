import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteSeleccion, getSelecciones } from '../api/seleccionesApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function SeleccionesPage() {
  const { isAuthenticated, user } = useAuth();
  const [selecciones, setSelecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getSelecciones();
      setSelecciones(data);
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de selecciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta selección?')) return;

    try {
      await deleteSeleccion(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la selección.');
    }
  };

  if (loading) return <Loader message="Cargando selecciones..." />;

  return (
    <div>
      <div className="section-head">
        <h2>Selecciones</h2>
        {isAuthenticated && user?.rol === 'ADMIN' && (
          <Link to="/selecciones/nueva" className="btn btn-primary">Nueva selección</Link>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Continente</th>
                <th>Grupo</th>
                <th>Ranking</th>
                <th>Entrenador</th>
                {isAuthenticated && user?.rol === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {selecciones.map((seleccion) => (
                <tr key={seleccion.id}>
                  <td>{seleccion.id}</td>
                  <td>{seleccion.nombre}</td>
                  <td>{seleccion.continente}</td>
                  <td>{seleccion.grupo}</td>
                  <td>{seleccion.ranking_fifa}</td>
                  <td>{seleccion.entrenador}</td>
                  {isAuthenticated && user?.rol === 'ADMIN' && (
                    <td>
                      <Link to={`/selecciones/${seleccion.id}/editar`} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
                        Editar
                      </Link>
                      <button className="btn btn-danger" onClick={() => handleDelete(seleccion.id)}>
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SeleccionesPage;
