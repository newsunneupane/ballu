'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cloudinaryUrl } from '@/lib/cloudinary';
import SearchableSelect from '@/components/SearchableSelect';
import { Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'text-amber-700 bg-amber-100',
  Reviewed: 'text-blue-700 bg-blue-100',
  Contacted: 'text-emerald-700 bg-emerald-100',
};

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Reviewed', label: 'Reviewed' },
  { value: 'Contacted', label: 'Contacted' },
];

export default function CustomRequestsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: requests = [] } = useQuery({
    queryKey: ['custom-requests', statusFilter || undefined],
    queryFn: () => api.customRequests.list(statusFilter || undefined),
  });

  const listKey = ['custom-requests', statusFilter || undefined] as const;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
    queryClient.invalidateQueries({ queryKey: ['pending-counts'] });
  };

  const updateStatus = async (id: string, status: string) => {
    const prev = queryClient.getQueryData<any[]>(listKey)?.find((r) => r._id === id)?.status;

    queryClient.setQueryData<any[]>(listKey, (old = []) =>
      old.map((r) => (r._id === id ? { ...r, status } : r))
    );

    if (prev && prev !== status) {
      const delta = (status === 'Pending' ? 1 : 0) - (prev === 'Pending' ? 1 : 0);
      queryClient.setQueryData<Record<string, number>>(['pending-counts'], (old = {}) => ({
        ...old,
        pendingRequests: Math.max(0, (old.pendingRequests || 0) + delta),
      }));
    }

    try {
      await api.customRequests.update(id, { status });
    } catch {
      queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
      return;
    }
    invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this request?')) return;
    queryClient.setQueryData<any[]>(listKey, (old = []) => old.filter((r) => r._id !== id));
    try {
      await api.customRequests.delete(id);
    } catch {
      queryClient.invalidateQueries({ queryKey: ['custom-requests'] });
      return;
    }
    invalidate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Custom Requests</h1>
        <SearchableSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          options={statusOptions}
          placeholder="All Statuses"
          clearLabel="All Statuses"
          size="sm"
          className="w-48"
        />
      </div>

      <div className="space-y-3">
        {requests.map((r: any) => (
          <div key={r._id} className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#1f1b16] font-medium">{r.username}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || ''}`}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-[#6b655b] ml-auto">{new Date(r.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
                <div className="text-sm text-[#7d776c] space-y-1">
                  <p>📞 {r.phoneNumber}</p>
                  {r.pieceType && <p className="text-xs">Piece: {r.pieceType}</p>}
                  <p>
                    Collection: {r.category?.name?.en || 'N/A'}
                    {r.material?.name?.en ? ` · Material: ${r.material.name.en}` : ''}
                    {' · '}Budget: Rs {r.budgetNrs?.toLocaleString()}
                  </p>
                  {r.requirements && <p className="italic text-xs">📝 {r.requirements}</p>}
                  <p className="text-xs text-[#6b655b] mt-1">{r.description || <span className="text-[#6b655b] italic">No description</span>}</p>
                  {r.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {r.images.map((img: string, i: number) => (
                        <img key={i} src={cloudinaryUrl(img, { width: 120, aspect: '1:1' })} alt="" className="w-16 h-16 object-cover rounded border border-[#e5ded2]" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SearchableSelect
                  value={r.status}
                  onChange={(v) => updateStatus(r._id, v)}
                  options={statusOptions}
                  size="sm"
                  className="w-36"
                />
                <button onClick={() => remove(r._id)} className="text-[#6b655b] hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center text-[#6b655b] py-12">No custom requests</div>
        )}
      </div>
    </div>
  );
}
