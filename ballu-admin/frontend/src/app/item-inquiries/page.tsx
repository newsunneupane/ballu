'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cloudinaryUrl } from '@/lib/cloudinary';
import SearchableSelect from '@/components/SearchableSelect';
import { Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'text-amber-400 bg-amber-400/10',
  Reviewed: 'text-blue-400 bg-blue-400/10',
  Contacted: 'text-emerald-400 bg-emerald-400/10',
};

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Reviewed', label: 'Reviewed' },
  { value: 'Contacted', label: 'Contacted' },
];

export default function ItemInquiriesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: inquiries = [] } = useQuery({
    queryKey: ['item-inquiries', statusFilter || undefined],
    queryFn: () => api.itemInquiries.list(statusFilter || undefined),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['item-inquiries'] });
    queryClient.invalidateQueries({ queryKey: ['pending-counts'] });
  };

  const updateStatus = async (id: string, status: string) => {
    await api.itemInquiries.update(id, { status });
    invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await api.itemInquiries.delete(id);
    invalidate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Item Inquiries</h1>
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
        {inquiries.map((inq: any) => (
          <div key={inq._id} className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#fbf7f0] font-medium">{inq.customerName}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[inq.status] || ''}`}>
                    {inq.status}
                  </span>
                </div>
                <div className="text-sm text-[#8e897e] space-y-1">
                  <p>📞 {inq.phoneNumber}</p>
                  {inq.item && <p>Item: {inq.item.name?.en || 'Unknown'} {inq.item.images?.[0] && <img src={cloudinaryUrl(inq.item.images[0], { width: 80, aspect: '1:1' })} alt="" className="inline w-8 h-8 object-cover rounded ml-2 align-middle" />}</p>}
                  {inq.message && <p className="italic text-xs">{inq.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SearchableSelect
                  value={inq.status}
                  onChange={(v) => updateStatus(inq._id, v)}
                  options={statusOptions}
                  size="sm"
                  className="w-36"
                />
                <button onClick={() => remove(inq._id)} className="text-[#6e695f] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-center text-[#6e695f] py-12">No item inquiries</div>
        )}
      </div>
    </div>
  );
}
