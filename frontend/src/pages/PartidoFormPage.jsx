import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPartido, getPartidoById, updatePartido } from '../api/partidosApi';
import { getSelecciones } from '../api/seleccionesApi';
import ErrorMessage from '../components/ErrorMessage';
import Autocomplete from '../components/Autocomplete';

const initialForm = {
  seleccion_local_id: null,
  seleccion_visitante_id: null,
  fecha: '',
  estadio: '',
  fase: 'GRUPOS',
  goles_local: 0,
  goles_visitante: 0,
  estado: 'PROGRAMADO'
};

function PartidoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [seleccionesOptions, setSeleccionesOptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getSelecciones();
        const opts = (s || []).map((se) => ({ label: se.nombre, value: se.id }));
        setSeleccionesOptions(opts);

        if (!id) {
          setLoading(false);
          return;
        }

        const data = await getPartidoById(id);
        setForm({
          seleccion_local_id: opts.find((o) => Number(o.value) === Number(data.seleccion_local_id)) || null,
          seleccion_visitante_id: opts.find((o) => Number(o.value) === Number(data.seleccion_visitante_id)) || null,
          fecha: data.fecha ? new Date(data.fecha).toISOString().slice(0, 16) : '',
          estadio: data.estadio || '',
          fase: data.fase || 'GRUPOS',
          goles_local: data.goles_local ?? 0,
          goles_visitante: data.goles_visitante ?? 0,
          estado: data.estado || 'PROGRAMADO'
        });
      } catch (err) {
        setError(err.message || 'No se pudo cargar el partido.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setForm((prev) => ({ ...prev, [name]: option }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // ensure both selections are actual selected options
      if (!form.seleccion_local_id || !form.seleccion_local_id.value) {
        setError('Selecciona una selección válida para el equipo local.');
        return;
      }
      if (!form.seleccion_visitante_id || !form.seleccion_visitante_id.value) {
        setError('Selecciona una selección válida para el equipo visitante.');
        return;
      }
      const payload = {
        ...form,
        seleccion_local_id: Number(form.seleccion_local_id?.value ?? 0),
        seleccion_visitante_id: Number(form.seleccion_visitante_id?.value ?? 0),
        goles_local: Number(form.goles_local),
        goles_visitante: Number(form.goles_visitante)
      };

      if (isEditing) {
        await updatePartido(id, payload);
      } else {
        await createPartido(payload);
      }

      navigate('/partidos');
    } catch (err) {
      setError(err.message || 'No se pudo guardar el partido.');
    }
  };

  if (loading) return <div className="page-state">Cargando partido...</div>;

  return (
    <div className="form-shell">
      <h2 style={{ marginTop: 0 }}>{isEditing ? 'Editar partido' : 'Nuevo partido'}</h2>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <div className="field">
            <label htmlFor="seleccion_local_id">Selección local (ID)</label>
            <Autocomplete
              id="seleccion_local_id"
              options={seleccionesOptions}
              value={form.seleccion_local_id}
              onChange={(opt) => handleSelect('seleccion_local_id', opt)}
              placeholder="Selecciona la selección local"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="seleccion_visitante_id">Selección visitante (ID)</label>
            <Autocomplete
              id="seleccion_visitante_id"
              options={seleccionesOptions}
              value={form.seleccion_visitante_id}
              onChange={(opt) => handleSelect('seleccion_visitante_id', opt)}
              placeholder="Selecciona la selección visitante"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" name="fecha" type="datetime-local" value={form.fecha} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="estadio">Estadio</label>
            <input id="estadio" name="estadio" value={form.estadio} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="fase">Fase</label>
            <select id="fase" name="fase" value={form.fase} onChange={handleChange}>
              <option value="GRUPOS">GRUPOS</option>
              <option value="OCTAVOS">OCTAVOS</option>
              <option value="CUARTOS">CUARTOS</option>
              <option value="SEMIFINAL">SEMIFINAL</option>
              <option value="FINAL">FINAL</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
              <option value="PROGRAMADO">PROGRAMADO</option>
              <option value="EN_JUEGO">EN_JUEGO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="goles_local">Goles local</label>
            <input id="goles_local" name="goles_local" type="number" min="0" value={form.goles_local} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="goles_visitante">Goles visitante</label>
            <input id="goles_visitante" name="goles_visitante" type="number" min="0" value={form.goles_visitante} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/partidos')}>Cancelar</button>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Guardar cambios' : 'Crear partido'}</button>
        </div>
      </form>
    </div>
  );
}

export default PartidoFormPage;
