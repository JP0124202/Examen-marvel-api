import React, { useEffect, useState } from 'react'
import api from '../services/api'
import HeroCard from '../components/HeroCard'
import { Link } from 'react-router-dom'

export default function Heroes() {
  const [heroes, setHeroes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    fetchHeroes()
  }, [])

  async function fetchHeroes() {
    setLoading(true); setError(null)
    try {
      const res = await api.get('/heroes')
      setHeroes(res.data.data)
    } catch (err) {
      setError('No se pudo cargar los héroes.')
    } finally { setLoading(false) }
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este superhéroe?')) return
    try {
      await api.delete(`/heroes/${id}`)
      setHeroes(prev => prev.filter(h => h.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  const filtered = heroes ? heroes.filter(h => h.nombre.toLowerCase().includes(query.toLowerCase())) : []

  return (
    <div>
      <div className="page-header">
        <h2>Héroes</h2>
        <div className="actions">
          <input placeholder="Buscar superhéroe..." value={query} onChange={e => setQuery(e.target.value)} />
          {user?.rol === 'ADMIN' && <Link to="/heroes/nuevo" className="btn">Nuevo</Link>}
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && heroes && heroes.length === 0 && <p>No hay superhéroes registrados.</p>}

      <div className="grid">
        {filtered.map(h => (
          <HeroCard key={h.id} hero={h} onDelete={user?.rol === 'ADMIN' ? handleDelete : null} showActions={user?.rol === 'ADMIN'} />
        ))}
      </div>
    </div>
  )
}
