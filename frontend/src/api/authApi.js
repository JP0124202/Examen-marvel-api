const API_BASE = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Error en la solicitud';
    throw new Error(message);
  }

  return data;
}

export async function loginRequest({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  return data;
}

export async function registerRequest(userData) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

  return data;
}

export async function getCurrentUser(token) {
  const data = await request('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.data;
}

export async function logoutRequest() {
  return Promise.resolve();
}
