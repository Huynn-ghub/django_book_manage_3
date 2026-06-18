const API_BASE = '/api';

export async function loginApi(username, password) {
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data; // { access, refresh }
}

export async function logoutApi(refreshToken) {
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error('Logout failed');
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data; // { access, refresh }
}
