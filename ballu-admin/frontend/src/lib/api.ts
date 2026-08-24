const BASE_URL = '/api';

import { toast } from '@/lib/toast';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bj_token');
}

const RESOURCE_NAMES: Record<string, string> = {
  materials: 'Material',
  groups: 'Group',
  collections: 'Collection',
  occasions: 'Occasion',
  items: 'Item',
  'custom-requests': 'Custom request',
  'item-inquiries': 'Inquiry',
  'store-settings': 'Store settings',
  upload: 'Image',
  auth: 'Account',
  dashboard: 'Dashboard',
};

function describe(path: string, method: string): string {
  const clean = path.split('?')[0].replace(/^\/+/, '');
  const resource = clean.split('/')[0];
  const action = { POST: 'created', PUT: 'updated', DELETE: 'deleted' }[method];
  if (!action) return '';
  const noun =
    RESOURCE_NAMES[resource] ||
    resource
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Item';
  return `${noun} ${action}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  } catch {
    toast.error('Network error - please try again');
    throw new Error('Network error - please try again');
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('bj_token');
      window.location.href = '/login';
    }
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch { err = { error: text || res.statusText }; }
    const message = err.error || 'Request failed';
    if (res.status !== 401) toast.error(message);
    throw new Error(message);
  }

  const data = await res.json();
  const message = describe(path, method);
  if (message) toast.success(message);
  return data;
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
  groups: {
    list: (material?: string) => {
      const qs = material ? `?material=${material}` : '';
      return request<any[]>(`/groups${qs}`);
    },
    get: (id: string) => request<any>(`/groups/${id}`),
    create: (data: any) => request<any>('/groups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/groups/${id}`, { method: 'DELETE' }),
  },
  collections: {
    list: () => request<any[]>('/collections'),
    get: (id: string) => request<any>(`/collections/${id}`),
    create: (data: any) => request<any>('/collections', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/collections/${id}`, { method: 'DELETE' }),
  },
  occasions: {
    list: () => request<any[]>('/occasions'),
    get: (id: string) => request<any>(`/occasions/${id}`),
    create: (data: any) => request<any>('/occasions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/occasions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/occasions/${id}`, { method: 'DELETE' }),
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
  upload: {
    image: (file: string, folder?: string) =>
      request<{ url: string; public_id: string }>('/upload', { method: 'POST', body: JSON.stringify({ file, folder }) }),
  },
};
