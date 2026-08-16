import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

function Sidebar({ user, onLogout }){
  return (
    <aside className="sidebar">
      <div className="brand">MARVEL API</div>
      <nav className="menu">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/heroes">Héroes</NavLink>
        <NavLink to="/misiones">Misiones</NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="user-name">{user?.nombre}</div>
        <div className="user-role">{user?.rol}</div>
        <button className="btn small" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  )
}

export default function Layout(){
  const navigate = useNavigate()
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  function handleLogout(){
    fetch('http://localhost:3000/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .catch(()=>{})
      .finally(()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      })
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="main-area">
        <header className="topbar">
          <div className="top-left">MARVEL API</div>
          <div className="top-right">
            <div className="user-info">{user?.nombre} <span className="muted">({user?.rol})</span></div>
          </div>
        </header>
        <main className="container">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
