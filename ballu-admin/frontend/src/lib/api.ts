const BASE_URL = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bj_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('bj_token');
      window.location.href = '/login';
    }
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch { err = { error: text || res.statusText }; }
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  request: <T>(path: string, options?: RequestInit) => request<T>(path, options),
  materials: {
    list: () => request<any[]>('/materials'),
    get: (id: string) => request<any>(`/materials/${id}`),
    create: (data: any) => request<any>('/materials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/materials/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request<any[]>('/categories'),
    get: (id: string) => request<any>(`/categories/${id}`),
    create: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
  },
  items: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/items${qs}`);
    },
    get: (id: string) => request<any>(`/items/${id}`),
    create: (data: any) => request<any>('/items', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/items/${id}`, { method: 'DELETE' }),
    bulkCreate: (items: any[]) => request<{ count: number; items: any[] }>('/items/bulk', { method: 'POST', body: JSON.stringify(items) }),
    bulkDelete: (ids: string[]) => request<{ deleted: number }>('/items', { method: 'DELETE', body: JSON.stringify({ ids }) }),
  },
  dailyRates: {
    list: (material?: string) => {
      const qs = material ? `?material=${material}` : '';
      return request<any[]>(`/daily-rates${qs}`);
    },
    latest: (material?: string) => {
      const qs = material ? `?material=${material}` : '';
      return request<any>(`/daily-rates/latest${qs}`);
    },
    create: (data: any) => request<any>('/daily-rates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/daily-rates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/daily-rates/${id}`, { method: 'DELETE' }),
  },
  customRequests: {
    list: (status?: string) => {
      const qs = status ? `?status=${status}` : '';
      return request<any[]>(`/custom-requests${qs}`);
    },
    update: (id: string, data: any) => request<any>(`/custom-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/custom-requests/${id}`, { method: 'DELETE' }),
  },
  itemInquiries: {
    list: (status?: string) => {
      const qs = status ? `?status=${status}` : '';
      return request<any[]>(`/item-inquiries${qs}`);
    },
    update: (id: string, data: any) => request<any>(`/item-inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/item-inquiries/${id}`, { method: 'DELETE' }),
  },
  storeSettings: {
    get: () => request<any>('/store-settings'),
    update: (data: any) => request<any>('/store-settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
};
