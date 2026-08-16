import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Misiones() {
  const [misiones, setMisiones] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

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
          {user?.rol === 'ADMIN' && <a className="btn" href="#" onClick={(e)=>{e.preventDefault(); alert('Crear misión en implementación futura')}}>Nueva misión</a>}
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && misiones && misiones.length === 0 && <p>No hay misiones registradas.</p>}

      <div className="list">
        {misiones && misiones.map(m => (
          <div key={m.id} className="card mission">
            <h3>{m.titulo}</h3>
            <p>{m.descripcion}</p>
            <p><b>Ubicación:</b> {m.ubicacion}</p>
            <p><b>Fecha:</b> {m.fecha}</p>
            <p><b>Nivel de peligro:</b> {m.nivel_peligro}</p>
            <p><b>Estado:</b> {m.estado}</p>
            <p><b>Superhéroe:</b> {m.superheroe_nombre}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
