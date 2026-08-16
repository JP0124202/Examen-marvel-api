import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/')
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Email y contraseña son requeridos')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const payload = res.data.data
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify({ nombre: payload.nombre, email: payload.email, rol: payload.rol }))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Marvel API</h2>
        {error && <div className="alert">{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <label>Contraseña</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button className="btn" disabled={loading}>{loading ? 'Cargando...' : 'Iniciar sesión'}</button>
      </form>
    </div>
  )
}
