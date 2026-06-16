const API_BASE = '/api';

export async function getBooks(params = {}) {
  const query = new URLSearchParams();
  if (params.page)      query.set('page', params.page);
  if (params.page_size) query.set('page_size', params.page_size);
  if (params.title)     query.set('title', params.title);
  if (params.author)    query.set('author', params.author);

  const res = await fetch(`${API_BASE}/books/?${query}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function getBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`);
  if (!res.ok) throw new Error('Book not found');
  return res.json();
}

export async function createBook(data) {
  const res = await fetch(`${API_BASE}/books/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateBook(id, data) {
  const res = await fetch(`${API_BASE}/books/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
}
