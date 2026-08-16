import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

export default function HeroForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const [form, setForm] = useState({ nombre:'', nombre_real:'', poder_principal:'', nivel_poder:1, imagen_url:'', estado:'ACTIVO' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (editing) {
      api.get(`/heroes/${id}`).then(r => setForm(r.data.data)).catch(() => setError('No se encontró el héroe'))
    }
  }, [id, editing])

  async function handleSubmit(e) {
    e.preventDefault(); setError(null); setLoading(true)
    try {
      if (editing) await api.put(`/heroes/${id}`, form)
      else await api.post('/heroes', form)
      navigate('/heroes')
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="card form">
      <h3>{editing ? 'Editar superhéroe' : 'Nuevo superhéroe'}</h3>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <label>Nombre real</label>
        <input value={form.nombre_real} onChange={e => setForm({...form, nombre_real: e.target.value})} />
        <label>Poder principal</label>
        <input value={form.poder_principal} onChange={e => setForm({...form, poder_principal: e.target.value})} />
        <label>Nivel de poder</label>
        <input type="number" min={1} max={100} value={form.nivel_poder} onChange={e => setForm({...form, nivel_poder: Number(e.target.value)})} />
        <label>Imagen URL</label>
        <input value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} />
        <label>Estado</label>
        <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}>
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>
        <div className="form-actions">
          <button className="btn" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
