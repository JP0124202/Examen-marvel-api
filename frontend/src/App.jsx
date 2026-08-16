import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Heroes from './pages/Heroes'
import HeroDetail from './pages/HeroDetail'
import HeroForm from './pages/HeroForm'
import Misiones from './pages/Misiones'
import MisionForm from './pages/MisionForm'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}> 
            <Route index element={<Dashboard />} />
          <Route path="heroes" element={<Heroes />} />
          <Route path="heroes/nuevo" element={<HeroForm />} />
          <Route path="heroes/:id" element={<HeroDetail />} />
          <Route path="heroes/:id/editar" element={<HeroForm />} />
          <Route path="misiones" element={<Misiones />} />
          <Route path="misiones/nueva" element={<MisionForm />} />
          <Route path="misiones/:id/editar" element={<MisionForm />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
