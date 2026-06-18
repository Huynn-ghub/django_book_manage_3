const API_BASE = '/api';

// ─── Helper: fetch với Authorization header ───────────────────────────────────

function getAccessToken() {
  return localStorage.getItem('access_token');
}

async function authFetch(url, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // Token hết hạn → clear storage, reload về trang login
  if (res.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  return res;
}

// ─── Book API ─────────────────────────────────────────────────────────────────

export async function getBooks(params = {}) {
  const query = new URLSearchParams();
  if (params.page)      query.set('page', params.page);
  if (params.page_size) query.set('page_size', params.page_size);
  if (params.title)     query.set('title', params.title);
  if (params.author)    query.set('author', params.author);

  const res = await authFetch(`${API_BASE}/books/?${query}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function getBook(id) {
  const res = await authFetch(`${API_BASE}/books/${id}/`);
  if (!res.ok) throw new Error('Book not found');
  return res.json();
}

export async function createBook(data) {
  const res = await authFetch(`${API_BASE}/books/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateBook(id, data) {
  const res = await authFetch(`${API_BASE}/books/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function deleteBook(id) {
  const res = await authFetch(`${API_BASE}/books/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
}
