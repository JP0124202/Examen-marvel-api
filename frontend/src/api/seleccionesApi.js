const API_BASE = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('worldcup_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error al cargar selecciones');
  }

  return data;
}

export async function getSelecciones() {
  const data = await request('/api/selecciones');
  return data.data;
}

export async function getSeleccionById(id) {
  const data = await request(`/api/selecciones/${id}`);
  return data.data;
}

export async function createSeleccion(payload) {
  const data = await request('/api/selecciones', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateSeleccion(id, payload) {
  const data = await request(`/api/selecciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteSeleccion(id) {
  const data = await request(`/api/selecciones/${id}`, {
    method: 'DELETE'
  });
  return data;
}
