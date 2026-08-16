import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSelecciones } from '../api/seleccionesApi';
import { getPartidos } from '../api/partidosApi';
import { getTablaGrupo } from '../api/tablaApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const [selecciones, setSelecciones] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [tabla, setTabla] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only fetch protected resources when the user is authenticated
        if (!isAuthenticated) {
          setSelecciones([]);
          setPartidos([]);
          setTabla([]);
          setError('');
          return;
        }

        const [allSelecciones, allPartidos, allTabla] = await Promise.all([
          getSelecciones(),
          getPartidos(),
          getTablaGrupo('A')
        ]);

        setSelecciones(allSelecciones || []);
        setPartidos(allPartidos || []);
        setTabla(allTabla || []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la información del Mundial.');
      }
    };

    if (authLoading) {
      setLoading(true);
      return;
    }

    loadData().finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  const partCount = partidos.length;
  const selectedCount = selecciones.length;
  const finalizados = partidos.filter((p) => p.estado === 'FINALIZADO').length;
  const programados = partidos.filter((p) => p.estado === 'PROGRAMADO').length;
  const topTable = tabla.slice(0, 4);
  const recentMatches = [...partidos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).slice(0, 4);

  const heroMetrics = useMemo(() => [
    { label: 'Selecciones', value: selectedCount },
    { label: 'Partidos', value: partCount },
    { label: 'Finalizados', value: finalizados },
    { label: 'Programados', value: programados }
  ], [selectedCount, partCount, finalizados, programados]);

  if (loading) return <Loader message="Cargando resumen del Mundial..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <section className="hero">
        <div className="hero-card">
          <span className="hero-kicker">FIFA World Cup</span>
          <h1>Todo el Mundial, en una sola vista.</h1>
          <p>
            Consulta selecciones, partidos y tablas por grupo con una interfaz clara y moderna para gestionar
            el torneo desde el backend existente.
          </p>

          <div className="hero-metrics">
            {heroMetrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="panel">
            <h3>Acceso rápido</h3>
            <div className="quick-actions">
              <Link to="/selecciones" className="btn btn-primary">Ver selecciones</Link>
              <Link to="/partidos" className="btn btn-secondary">Ver partidos</Link>
              <Link to="/tabla" className="btn btn-secondary">Ver tabla</Link>
            </div>
          </div>

          <div className="panel">
            <h3>API Docs</h3>
            <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer" className="btn btn-secondary">
              Abrir Swagger
            </a>
          </div>
        </aside>
      </section>

      <div className="section-head">
        <h2>Partidos destacados</h2>
      </div>

      <div className="grid-3">
        {recentMatches.map((match) => (
          <article className="card" key={match.id}>
            <h3>{match.fase}</h3>
            <div className="card-list">
              <div className="list-item">
                <div>
                  <strong>{match.seleccion_local}</strong>
                  <div className="list-subtle">Local</div>
                </div>
                <span className="badge green">{match.goles_local ?? 0}</span>
              </div>

              <div className="list-item">
                <div>
                  <strong>{match.seleccion_visitante}</strong>
                  <div className="list-subtle">Visitante</div>
                </div>
                <span className="badge gold">{match.goles_visitante ?? 0}</span>
              </div>
            </div>
            <p style={{ marginTop: '1rem' }}>{new Date(match.fecha).toLocaleString()}</p>
          </article>
        ))}
      </div>

      <div className="section-head">
        <h2>Tabla de Grupo A</h2>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Selección</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th>PP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {topTable.map((row, index) => (
                <tr key={row.seleccion || index}>
                  <td>{row.seleccion}</td>
                  <td>{row.PJ}</td>
                  <td>{row.PG}</td>
                  <td>{row.PE}</td>
                  <td>{row.PP}</td>
                  <td>{row.GF}</td>
                  <td>{row.GC}</td>
                  <td>{row.DG}</td>
                  <td>{row.PTS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default HomePage;
