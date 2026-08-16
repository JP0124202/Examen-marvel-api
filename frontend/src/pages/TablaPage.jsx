import { useEffect, useState } from 'react';
import { getTablaGrupo } from '../api/tablaApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function TablaPage() {
  const [grupo, setGrupo] = useState('A');
  const [tabla, setTabla] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarTabla = async () => {
      try {
        setLoading(true);
        const data = await getTablaGrupo(grupo);
        setTabla(data || []);
        setError('');
      } catch (err) {
        setError(err.message || 'No se pudo cargar la tabla del grupo.');
      } finally {
        setLoading(false);
      }
    };

    cargarTabla();
  }, [grupo]);

  if (loading) return <Loader message="Cargando tabla del grupo..." />;

  return (
    <div>
      <div className="section-head">
        <h2>Tabla de posiciones</h2>
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <div className="field" style={{ maxWidth: '220px' }}>
          <label htmlFor="grupo">Grupo</label>
          <select id="grupo" value={grupo} onChange={(event) => setGrupo(event.target.value)}>
            {grupos.map((item) => (
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
              {tabla.map((row, index) => (
                <tr key={`${row.seleccion}-${index}`}>
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
    </div>
  );
}

export default TablaPage;
