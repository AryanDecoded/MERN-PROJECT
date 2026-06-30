// Central place for all backend API calls.
// BASE_URL points to your Express server.
// Change this to your Render URL when deployed.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper: attach JWT token to every request automatically
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Generic fetch wrapper
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(),
  });

  // For CSV download, return raw response
  if (options.rawResponse) return res;

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => request('/auth/me'),
};

// ─── Pantry ───────────────────────────────────────────────────────────────────
export const pantryAPI = {
  getAll:       ()           => request('/pantry'),
  getSummary:   ()           => request('/pantry/summary'),
  getOne:       (id)         => request(`/pantry/${id}`),
  add:          (item)       => request('/pantry', { method: 'POST', body: JSON.stringify(item) }),
  update:       (id, item)   => request(`/pantry/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  updateQty:    (id, qty)    => request(`/pantry/${id}/quantity`, { method: 'PATCH', body: JSON.stringify({ quantity: qty }) }),
  remove:       (id)         => request(`/pantry/${id}`, { method: 'DELETE' }),
};

// ─── Shopping ─────────────────────────────────────────────────────────────────
export const shoppingAPI = {
  getAll:   ()     => request('/shopping'),
  add:      (item) => request('/shopping', { method: 'POST', body: JSON.stringify(item) }),
  checkOff: (id)   => request(`/shopping/${id}`, { method: 'PATCH' }),
  remove:   (id)   => request(`/shopping/${id}`, { method: 'DELETE' }),
};

// ─── Recipes ──────────────────────────────────────────────────────────────────
export const recipeAPI = {
  getSuggestions: () => request('/recipes'),
};

// ─── Spending ─────────────────────────────────────────────────────────────────
export const spendingAPI = {
  getBreakdown: ()      => request('/spending'),
  invite:       (email) => request('/spending/invite', { method: 'POST', body: JSON.stringify({ email }) }),
  exportCSV:    ()      => request('/spending/export', { rawResponse: true }),
};
