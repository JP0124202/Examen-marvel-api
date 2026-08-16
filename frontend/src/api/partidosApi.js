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
    throw new Error(data.message || 'Error al cargar partidos');
  }

  return data;
}

export async function getPartidos() {
  const data = await request('/api/partidos');
  return data.data;
}

export async function getPartidoById(id) {
  const data = await request(`/api/partidos/${id}`);
  return data.data;
}

export async function getPartidosByFase(fase) {
  const data = await request(`/api/partidos/fase/${fase}`);
  return data.data;
}

export async function createPartido(payload) {
  const data = await request('/api/partidos', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updatePartido(id, payload) {
  const data = await request(`/api/partidos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateResultadoPartido(id, payload) {
  const data = await request(`/api/partidos/${id}/resultado`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deletePartido(id) {
  const data = await request(`/api/partidos/${id}`, {
    method: 'DELETE'
  });
  return data;
}
