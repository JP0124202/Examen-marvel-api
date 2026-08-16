import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function HeroDetail() {
  const { id } = useParams()
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/heroes/${id}`).then(r => { setHero(r.data.data); setLoading(false) }).catch(e => { setError('Superhéroe no encontrado'); setLoading(false) })
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <div>
    <p>{error}</p>
    <button className="btn" onClick={() => navigate(-1)}>Volver</button>
  </div>

  return (
    <article className="card product-detail">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <button className="btn" onClick={() => navigate(-1)}>Volver</button>
        <div className="muted">ID: {hero.id}</div>
      </div>

      <div className="detail product-detail-inner">
        <div className="media">
          <img src={hero.imagen_url || 'https://via.placeholder.com/300x300?text=No+Image'} alt={hero.nombre} onError={(e)=>e.target.src='https://via.placeholder.com/300x300?text=No+Image'} />
        </div>
        <div className="product-info">
          <h2>{hero.nombre}</h2>
          <p className="muted"><b>Nombre real:</b> {hero.nombre_real}</p>
          <p className="muted"><b>Poder principal:</b> {hero.poder_principal}</p>
          <p className="muted"><b>Nivel de poder:</b> {hero.nivel_poder}</p>
          <p className="muted"><b>Estado:</b> {hero.estado}</p>
        </div>
      </div>
    </article>
  )
}
