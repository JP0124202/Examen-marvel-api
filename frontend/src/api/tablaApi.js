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
    throw new Error(data.message || 'Error al cargar la tabla');
  }

  return data;
}

export async function getTablaGrupo(grupo) {
  const data = await request(`/api/grupos/${grupo}/tabla`);
  return data.data;
}
