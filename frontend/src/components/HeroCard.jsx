import React from 'react'
import { Link } from 'react-router-dom'

export default function HeroCard({ hero, onDelete, showActions=true }) {
  function handleImgError(e){
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
  }

  return (
    <div className="hero-card">
      <img src={hero.imagen_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={hero.nombre} onError={handleImgError} />
      <div className="hero-body">
        <h3>{hero.nombre}</h3>
        <p className="real">{hero.nombre_real}</p>
        <p>{hero.poder_principal}</p>
        <div className="meta">
          <span className="badge">Nivel: {hero.nivel_poder}</span>
          <span className={`status ${hero.estado.toLowerCase()}`}>{hero.estado}</span>
        </div>
        <div className="actions">
          <Link to={`/heroes/${hero.id}`} className="btn small">Ver</Link>
          {showActions && (
            <>
              <Link to={`/heroes/${hero.id}/editar`} className="btn small">Editar</Link>
              <button className="btn small danger" onClick={() => onDelete && onDelete(hero.id)}>Eliminar</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
