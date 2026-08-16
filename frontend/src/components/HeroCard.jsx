import React from 'react'
import { Link } from 'react-router-dom'

export default function HeroCard({ hero, onDelete, showActions=true }) {
  function handleImgError(e){
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
  }

  const estado = (hero?.estado || '').toString()

  return (
    <article className="hero-card card product-card">
      <div className="media">
        <img src={hero?.imagen_url || 'https://via.placeholder.com/400x300?text=No+Image'} alt={hero?.nombre || 'Sin nombre'} onError={handleImgError} />
        {hero?.categoria && <span className="tag">{hero.categoria}</span>}
      </div>

      <div className="hero-body">
        <h3 className="product-title">{hero?.nombre || '—'}</h3>
        <p className="real muted">{hero?.nombre_real || '—'}</p>
        <p className="muted product-sub">{hero?.poder_principal || '—'}</p>
        <div className="meta">
          <span className="badge">Nivel: {hero?.nivel_poder ?? '—'}</span>
          <span className={`status ${estado.toLowerCase()}`}>{estado || '—'}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="price-like muted">Poder: {hero?.nivel_poder ?? '—'}</div>
        <div className="actions">
          <Link to={`/heroes/${hero?.id}`} className="btn small primary">Ver</Link>
          {showActions && (
            <>
              <Link to={`/heroes/${hero?.id}/editar`} className="btn small">Editar</Link>
              <button className="btn small danger" onClick={() => onDelete && onDelete(hero?.id)}>Eliminar</button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
