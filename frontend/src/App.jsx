import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Heroes from './pages/Heroes'
import HeroDetail from './pages/HeroDetail'
import HeroForm from './pages/HeroForm'
import Misiones from './pages/Misiones'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Navigate to="/heroes" replace />} />
          <Route path="heroes" element={<Heroes />} />
          <Route path="heroes/nuevo" element={<HeroForm />} />
          <Route path="heroes/:id" element={<HeroDetail />} />
          <Route path="heroes/:id/editar" element={<HeroForm />} />
          <Route path="misiones" element={<Misiones />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
