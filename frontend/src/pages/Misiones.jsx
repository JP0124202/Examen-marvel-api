import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Misiones() {
  const [misiones, setMisiones] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  useEffect(() => { fetchMisiones() }, [])

  async function fetchMisiones() {
    setLoading(true); setError(null)
    try { const res = await api.get('/misiones'); setMisiones(res.data.data) } catch (e) { setError('No se pudieron cargar las misiones') } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Misiones</h2>
        <div className="actions">
          {user?.rol === 'ADMIN' && <Link to="/misiones/nueva" className="btn">Nueva misión</Link>}
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && misiones && misiones.length === 0 && <p>No hay misiones registradas.</p>}

      <div className="list">
        {misiones && misiones.map(m => (
          <div key={m.id} className="card mission">
            <h3>{m.titulo || '—'}</h3>
            <p className="muted">{m.descripcion || 'Sin descripción'}</p>
            <div className="mission-meta">
              <span><b>Ubicación:</b> {m.ubicacion || '—'}</span>
              <span><b>Fecha:</b> {m.fecha || '—'}</span>
            </div>
            <div className="mission-meta">
              <span className={`badge danger`}>{m.nivel_peligro || '—'}</span>
              <span className={`badge`}>{m.estado || '—'}</span>
            </div>
            <p><b>Superhéroe:</b> {m.superheroe_nombre || '—'}</p>
            {user?.rol === 'ADMIN' && (
              <div style={{marginTop:8}}>
                <Link to={`/misiones/${m.id}/editar`} className="btn small">Editar</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
