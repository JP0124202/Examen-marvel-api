import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="brand">Marvel API</div>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/heroes">Héroes</NavLink>
        <NavLink to="/misiones">Misiones</NavLink>
      </nav>
      <div className="user">
        <div className="user-info">{user?.nombre} ({user?.rol})</div>
        <button className="btn" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  )
}

export default function Layout() {
  const navigate = useNavigate()
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  function handleLogout() {
    // call backend logout then clear
    fetch('http://localhost:3000/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      })
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
