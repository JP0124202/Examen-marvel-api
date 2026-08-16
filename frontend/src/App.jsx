import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeleccionesPage from './pages/SeleccionesPage';
import SeleccionFormPage from './pages/SeleccionFormPage';
import PartidosPage from './pages/PartidosPage';
import PartidoFormPage from './pages/PartidoFormPage';
import TablaPage from './pages/TablaPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/selecciones" element={<ProtectedRoute><SeleccionesPage /></ProtectedRoute>} />
          <Route path="/selecciones/nueva" element={<ProtectedRoute><SeleccionFormPage /></ProtectedRoute>} />
          <Route path="/selecciones/:id/editar" element={<ProtectedRoute><SeleccionFormPage /></ProtectedRoute>} />
          <Route path="/partidos" element={<ProtectedRoute><PartidosPage /></ProtectedRoute>} />
          <Route path="/partidos/nuevo" element={<ProtectedRoute><PartidoFormPage /></ProtectedRoute>} />
          <Route path="/partidos/:id/editar" element={<ProtectedRoute><PartidoFormPage /></ProtectedRoute>} />
          <Route path="/tabla" element={<ProtectedRoute><TablaPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
