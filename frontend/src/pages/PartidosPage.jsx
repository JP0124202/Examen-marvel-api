import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePartido, getPartidos, getPartidosByFase } from '../api/partidosApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const fases = ['GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

function PartidosPage() {
  const { isAuthenticated, user } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [fase, setFase] = useState('GRUPOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async (nextFase = fase) => {
    try {
      setLoading(true);
      const data = nextFase ? await getPartidosByFase(nextFase) : await getPartidos();
      setPartidos(data);
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de partidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleFaseChange = (event) => {
    const next = event.target.value;
    setFase(next);
    cargarDatos(next);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este partido?')) return;

    try {
      await deletePartido(id);
      await cargarDatos(fase);
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el partido.');
    }
  };

  const partidosOrdenados = useMemo(
    () => [...partidos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [partidos]
  );

  if (loading) return <Loader message="Cargando partidos..." />;

  return (
    <div>
      <div className="section-head">
        <h2>Partidos</h2>
        {isAuthenticated && user?.rol === 'ADMIN' && (
          <Link to="/partidos/nuevo" className="btn btn-primary">Nuevo partido</Link>
        )}
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <div className="field" style={{ maxWidth: '220px' }}>
          <label htmlFor="fase">Filtrar por fase</label>
          <select id="fase" value={fase} onChange={handleFaseChange}>
            {fases.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Visitante</th>
                <th>Fecha</th>
                <th>Estadio</th>
                <th>Fase</th>
                <th>Marcador</th>
                <th>Estado</th>
                {isAuthenticated && user?.rol === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {partidosOrdenados.map((partido) => (
                <tr key={partido.id}>
                  <td>{partido.id}</td>
                  <td>{partido.seleccion_local}</td>
                  <td>{partido.seleccion_visitante}</td>
                  <td>{new Date(partido.fecha).toLocaleString()}</td>
                  <td>{partido.estadio}</td>
                  <td>{partido.fase}</td>
                  <td>{partido.goles_local ?? 0} - {partido.goles_visitante ?? 0}</td>
                  <td>
                    <span className={`badge ${partido.estado === 'FINALIZADO' ? 'green' : partido.estado === 'PROGRAMADO' ? 'gold' : 'red'}`}>
                      {partido.estado}
                    </span>
                  </td>
                  {isAuthenticated && user?.rol === 'ADMIN' && (
                    <td>
                      <Link to={`/partidos/${partido.id}/editar`} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
                        Editar
                      </Link>
                      <button className="btn btn-danger" onClick={() => handleDelete(partido.id)}>
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

export default PartidosPage;
