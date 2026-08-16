import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSeleccion, getSeleccionById, updateSeleccion, getSelecciones } from '../api/seleccionesApi';
import ErrorMessage from '../components/ErrorMessage';
import Autocomplete from '../components/Autocomplete';

const initialForm = {
  nombre: null,
  continente: null,
  grupo: '',
  ranking_fifa: '',
  entrenador: ''
};

const CONTINENTES = [
  'África',
  'América del Sur',
  'América del Norte',
  'Asia',
  'Europa',
  'Oceanía'
];

const GRUPOS = ['A','B','C','D','E','F','G','H'];

// Lista local de países/selecciones (nombres en español). Fuente: lista de selecciones comunes.
const COUNTRIES = [
  'Afganistán','Albania','Argelia','Alemania','Andorra','Angola','Antigua y Barbuda','Arabia Saudita','Argelia','Argentina','Armenia','Australia','Austria','Azerbaiyán',
  'Bahamas','Baréin','Bangladés','Barbados','Bielorrusia','Bélgica','Belice','Benín','Bolivia','Bosnia y Herzegovina','Botsuana','Brasil','Brunéi','Bulgaria','Burkina Faso','Burundi',
  'Cabo Verde','Camerún','Canadá','Chad','Chile','China','Chipre','Colombia','Comoras','Corea del Norte','Corea del Sur','Costa de Marfil','Costa Rica','Croacia','Cuba','Dinamarca','Dominica','Ecuador','Egipto','El Salvador','Emiratos Árabes Unidos','Escocia','Eslovaquia','Eslovenia','España','Estados Unidos','Estonia','Etiopía','Filipinas','Finlandia','Fiyi','Francia','Gabón','Gambia','Georgia','Ghana','Granada','Grecia','Guatemala','Guinea','Guinea-Bisáu','Guinea Ecuatorial','Guyana','Haití','Honduras','Hungría','India','Indonesia','Irán','Iraq','Irlanda','Isla de Man','Islandia','Islas Feroe','Islas Salomón','Israel','Italia','Jamaica','Japón','Jordania','Kazajistán','Kenia','Kirguistán','Kiribati','Kuwait','Laos','Lesoto','Letonia','Líbano','Liberia','Libia','Liechtenstein','Lituania','Luxemburgo','Madagascar','Malasia','Malaui','Maldivas','Malí','Malta','Marruecos','Mauricio','Mauritania','México','Micronesia','Moldavia','Mongolia','Montenegro','Mozambique','Namibia','Nauru','Nepal','Nicaragua','Níger','Nigeria','Noruega','Nueva Zelanda','Omán','Pakistán','Palaos','Panamá','Papúa Nueva Guinea','Paraguay','Perú','Polonia','Portugal','Reino Unido','República Centroafricana','República Checa','República del Congo','República Democrática del Congo','República Dominicana','Ruanda','Rumania','Rusia','Samoa','San Cristóbal y Nieves','San Marino','San Vicente y las Granadinas','Santa Lucía','Santo Tomé y Príncipe','Serbia','Seychelles','Sierra Leona','Singapur','Siria','Somalia','Sri Lanka','Sudáfrica','Sudán','Sudán del Sur','Suecia','Suiza','Surinam','Tailandia','Tanzania','Tayikistán','Timor Oriental','Togo','Tonga','Trinidad y Tobago','Túnez','Turkmenistán','Turquía','Tuvalu','Ucrania','Uganda','Uruguay','Uzbekistán','Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabue'
];

function SeleccionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [allSelecciones, setAllSelecciones] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const s = await getSelecciones();
        setAllSelecciones(s || []);
      } catch (e) {
        // ignore
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    const cargarSeleccion = async () => {
      if (!id) return setLoading(false);

      try {
        const data = await getSeleccionById(id);
        // ensure the nombre is one of the known country options if possible
        const countryOption = COUNTRIES.find((c) => c.toLowerCase() === String(data.nombre).toLowerCase());
        setForm({
          nombre: countryOption ? { label: countryOption, value: countryOption } : { label: data.nombre, value: data.nombre },
          continente: { label: data.continente, value: data.continente },
          grupo: data.grupo || '',
          ranking_fifa: data.ranking_fifa ?? '',
          entrenador: data.entrenador || ''
        });
      } catch (err) {
        setError(err.message || 'No se pudo cargar la selección.');
      } finally {
        setLoading(false);
      }
    };

    cargarSeleccion();
  }, [id]);

  const handleChangeField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.nombre) {
      setError('Selecciona una selección válida.');
      return false;
    }

    if (!form.continente) {
      setError('Selecciona un continente válido.');
      return false;
    }

    if (!GRUPOS.includes(form.grupo)) {
      setError('Selecciona un grupo válido.');
      return false;
    }

    const ranking = Number(form.ranking_fifa);
    if (!Number.isInteger(ranking) || ranking < 1) {
      setError('El ranking FIFA debe ser un número entero positivo.');
      return false;
    }

    if (!form.entrenador || String(form.entrenador).trim() === '') {
      setError('El entrenador es obligatorio.');
      return false;
    }

    const existsName = allSelecciones.find((s) => s.nombre.toLowerCase() === form.nombre.label.toLowerCase());
    if (existsName && (!isEditing || String(existsName.id) !== String(id))) {
      setError('Esta selección ya existe.');
      return false;
    }

    const existsRanking = allSelecciones.find((s) => Number(s.ranking_fifa) === ranking);
    if (existsRanking && (!isEditing || String(existsRanking.id) !== String(id))) {
      setError(`El ranking FIFA ${ranking} ya está ocupado por otra selección.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (!validate()) return;

      const payload = {
        nombre: form.nombre.label,
        continente: form.continente.label,
        grupo: form.grupo,
        ranking_fifa: Number(form.ranking_fifa),
        entrenador: String(form.entrenador).trim()
      };

      if (isEditing) {
        await updateSeleccion(id, payload);
      } else {
        await createSeleccion(payload);
      }

      navigate('/selecciones');
    } catch (err) {
      setError(err.message || 'No se pudo guardar la selección.');
    }
  };

  if (loading) return <div className="page-state">Cargando selección...</div>;

  const countryOptions = COUNTRIES.map((c) => ({ label: c, value: c }));
  const continenteOptions = CONTINENTES.map((c) => ({ label: c, value: c }));

  return (
    <div className="form-shell">
      <h2 style={{ marginTop: 0 }}>{isEditing ? 'Editar selección' : 'Nueva selección'}</h2>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <Autocomplete
            id="nombre"
            options={countryOptions}
            value={form.nombre}
            onChange={(opt) => handleChangeField('nombre', opt)}
            placeholder="Busca y selecciona una selección"
            required
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="continente">Continente</label>
            <Autocomplete
              id="continente"
              options={continenteOptions}
              value={form.continente}
              onChange={(opt) => handleChangeField('continente', opt)}
              placeholder="Selecciona un continente"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="grupo">Grupo</label>
            <select id="grupo" name="grupo" value={form.grupo} onChange={(e) => handleChangeField('grupo', e.target.value)} required>
              <option value="">Selecciona</option>
              {GRUPOS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="ranking_fifa">Ranking FIFA</label>
            <input id="ranking_fifa" name="ranking_fifa" type="number" value={form.ranking_fifa} onChange={(e) => handleChangeField('ranking_fifa', e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="entrenador">Entrenador</label>
            <input id="entrenador" name="entrenador" value={form.entrenador} onChange={(e) => handleChangeField('entrenador', e.target.value)} required />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/selecciones')}>Cancelar</button>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Guardar cambios' : 'Crear selección'}</button>
        </div>
      </form>
    </div>
  );
}

export default SeleccionFormPage;
