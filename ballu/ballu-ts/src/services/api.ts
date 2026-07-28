const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  items: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/items${qs}`);
    },
    get: (id: string) => request<any>(`/items/${id}`),
  },
  categories: {
    list: () => request<any[]>('/categories'),
  },
  materials: {
    list: () => request<any[]>('/materials'),
  },
  dailyRates: {
    latest: (material?: string) => {
      const qs = material ? `?material=${material}` : '';
      return request<any>(`/daily-rates/latest${qs}`);
    },
  },
  customRequests: {
    create: (data: any) => request<any>('/custom-requests', { method: 'POST', body: JSON.stringify(data) }),
  },
  itemInquiries: {
    create: (data: any) => request<any>('/item-inquiries', { method: 'POST', body: JSON.stringify(data) }),
  },
  storeSettings: {
    get: () => request<any>('/store-settings'),
  },
};
