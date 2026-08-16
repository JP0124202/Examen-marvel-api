import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const niveles = ['BAJO','MEDIO','ALTO']
const estados = ['PENDIENTE','EN_PROGRESO','COMPLETADA']

export default function MisionForm(){
  const { id } = useParams()
  const editing = Boolean(id)
  const [form, setForm] = useState({
    titulo: '', descripcion: '', ubicacion: '', fecha: '', nivel_peligro: 'BAJO', estado: 'PENDIENTE', superheroe_id: ''
  })
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHeroes()
    if (editing) fetchMission()
  }, []) // eslint-disable-line

  async function fetchHeroes(){
    try{
      const res = await api.get('/heroes')
      setHeroes(res.data.data || [])
    }catch(e){
      setError('No se pudieron cargar los héroes')
    }
  }

  async function fetchMission(){
    setLoading(true)
    try{
      const res = await api.get(`/misiones/${id}`)
      const data = res.data.data
      // map fields
      setForm({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        ubicacion: data.ubicacion || '',
        fecha: data.fecha || '',
        nivel_peligro: data.nivel_peligro || 'BAJO',
        estado: data.estado || 'PENDIENTE',
        superheroe_id: data.superheroe_id ? String(data.superheroe_id) : ''
      })
    }catch(e){
      setError('Misión no encontrada')
    }finally{ setLoading(false) }
  }

  function validate(){
    if(!form.titulo) return 'El título es obligatorio'
    if(!form.descripcion) return 'La descripción es obligatoria'
    if(!form.ubicacion) return 'La ubicación es obligatoria'
    if(!form.fecha) return 'La fecha es obligatoria'
    if(!niveles.includes(form.nivel_peligro)) return 'Nivel de peligro inválido'
    if(!estados.includes(form.estado)) return 'Estado inválido'
    if(!form.superheroe_id) return 'Debe seleccionar un superhéroe'
    return null
  }

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    const v = validate()
    if(v){ setError(v); return }
    setLoading(true)
    try{
      if(editing){
        await api.put(`/misiones/${id}`, { ...form, superheroe_id: Number(form.superheroe_id) })
      }else{
        await api.post('/misiones', { ...form, superheroe_id: Number(form.superheroe_id) })
      }
      navigate('/misiones')
    }catch(err){
      setError(err.response?.data?.error || 'Error al guardar la misión')
    }finally{ setLoading(false) }
  }

  return (
    <div className="card form">
      <h3>{editing ? 'Editar misión' : 'Nueva misión'}</h3>
      {error && <div className="alert">{error}</div>}
      {loading && <p>Cargando...</p>}
      <form onSubmit={handleSubmit}>
        <label>Título</label>
        <input value={form.titulo} onChange={e=>setForm({...form, titulo:e.target.value})} />

        <label>Descripción</label>
        <textarea value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} />

        <label>Ubicación</label>
        <input value={form.ubicacion} onChange={e=>setForm({...form, ubicacion:e.target.value})} />

        <label>Fecha</label>
        <input type="date" value={form.fecha} onChange={e=>setForm({...form, fecha:e.target.value})} />

        <label>Nivel de peligro</label>
        <select value={form.nivel_peligro} onChange={e=>setForm({...form, nivel_peligro:e.target.value})}>
          {niveles.map(n=> <option key={n} value={n}>{n}</option>)}
        </select>

        <label>Estado</label>
        <select value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
          {estados.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>

        <label>Superhéroe</label>
        <select value={form.superheroe_id} onChange={e=>setForm({...form, superheroe_id:e.target.value})}>
          <option value="">-- Seleccione --</option>
          {heroes.map(h=> <option key={h.id} value={String(h.id)}>{h.nombre}</option>)}
        </select>

        <div className="form-actions">
          <button className="btn" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" className="btn" onClick={()=>navigate('/misiones')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
