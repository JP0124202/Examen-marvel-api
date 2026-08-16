import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [counts, setCounts] = useState({heroes:0, misiones:0})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user')||'null')

  useEffect(()=>{
    async function load(){
      setLoading(true); setError(null)
      try{
        const [h, m] = await Promise.all([api.get('/heroes'), api.get('/misiones')])
        setCounts({ heroes: (h.data.data || []).length, misiones: (m.data.data || []).length })
      }catch(e){ setError('No se pudieron cargar estadísticas') }
      finally{ setLoading(false) }
    }
    load()
  },[])

  return (
    <div>
      <h1>Bienvenido al universo Marvel</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      <div className="dashboard-grid">
        <div className="card stat">
          <h4>SUPERHÉROES</h4>
          <div className="big">{counts.heroes}</div>
        </div>
        <div className="card stat">
          <h4>MISIONES</h4>
          <div className="big">{counts.misiones}</div>
        </div>
        <div className="card stat">
          <h4>USUARIO</h4>
          <div className="muted">{user?.nombre || '—'}</div>
        </div>
        <div className="card stat">
          <h4>ROL</h4>
          <div className="muted">{user?.rol || '—'}</div>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <h3>Accesos rápidos</h3>
        <div style={{display:'flex',gap:8}}>
          <Link to="/heroes" className="btn">Ver héroes</Link>
          <Link to="/misiones" className="btn">Ver misiones</Link>
        </div>
      </div>
    </div>
  )
}
