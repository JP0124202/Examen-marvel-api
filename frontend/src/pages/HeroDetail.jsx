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
    <div className="card">
      <button className="btn" onClick={() => navigate(-1)}>Volver</button>
      <div className="detail">
        <img src={hero.imagen_url || 'https://via.placeholder.com/300'} alt={hero.nombre} />
        <div>
          <h2>{hero.nombre}</h2>
          <p><b>Nombre real:</b> {hero.nombre_real}</p>
          <p><b>Poder principal:</b> {hero.poder_principal}</p>
          <p><b>Nivel de poder:</b> {hero.nivel_poder}</p>
          <p><b>Estado:</b> {hero.estado}</p>
        </div>
      </div>
    </div>
  )
}
