'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'text-amber-400 bg-amber-400/10',
  Reviewed: 'text-blue-400 bg-blue-400/10',
  Contacted: 'text-emerald-400 bg-emerald-400/10',
};

export default function CustomRequestsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: requests = [] } = useQuery({
    queryKey: ['custom-requests', statusFilter || undefined],
    queryFn: () => api.customRequests.list(statusFilter || undefined),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['custom-requests'] });

  const updateStatus = async (id: string, status: string) => {
    await api.customRequests.update(id, { status });
    invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this request?')) return;
    await api.customRequests.delete(id);
    invalidate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Custom Requests</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Contacted">Contacted</option>
        </select>
      </div>

      <div className="space-y-3">
        {requests.map((r: any) => (
          <div key={r._id} className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#fbf7f0] font-medium">{r.username}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || ''}`}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-[#6e695f] ml-auto">{new Date(r.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
                <div className="text-sm text-[#8e897e] space-y-1">
                  <p>📞 {r.phoneNumber}</p>
                  {r.pieceType && <p className="text-xs">Piece: {r.pieceType}</p>}
                  <p>
                    Category: {r.category?.name?.en || 'N/A'}
                    {r.material?.name?.en ? ` · Material: ${r.material.name.en}` : ''}
                    {' · '}Budget: Rs {r.budgetNrs?.toLocaleString()}
                  </p>
                  {r.requirements && <p className="italic text-xs">📝 {r.requirements}</p>}
                  <p className="text-xs text-[#a8a397] mt-1">{r.description || <span className="text-[#6e695f] italic">No description</span>}</p>
                  {r.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {r.images.map((img: string, i: number) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded border border-[#1f1a10]" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r._id, e.target.value)}
                  className="bg-[#0a0806] border border-[#1f1a10] rounded px-2 py-1 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Contacted">Contacted</option>
                </select>
                <button onClick={() => remove(r._id)} className="text-[#6e695f] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center text-[#6e695f] py-12">No custom requests</div>
        )}
      </div>
    </div>
  );
}
