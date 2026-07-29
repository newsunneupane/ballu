'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Trash2, X } from 'lucide-react';

export default function DailyRatesPage() {
  const queryClient = useQueryClient();
  const { data: rates = [] } = useQuery({
    queryKey: ['daily-rates'],
    queryFn: () => api.dailyRates.list(),
  });
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ material: '', ratePerGramNrs: '', ratePerGramInr: '' });

  const invalidateRates = () => queryClient.invalidateQueries({ queryKey: ['daily-rates'] });

  const openNew = () => {
    setForm({ material: materials[0]?._id || '', ratePerGramNrs: '', ratePerGramInr: '' });
    setShowForm(true);
  };

  const save = async () => {
    await api.dailyRates.create({
      material: form.material,
      ratePerGramNrs: Number(form.ratePerGramNrs),
      ratePerGramInr: Number(form.ratePerGramInr),
    });
    setShowForm(false);
    invalidateRates();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this rate entry?')) return;
    await api.dailyRates.delete(id);
    invalidateRates();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Daily Rates</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#dbb86b] text-[#0a0806] px-4 py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
          <Plus size={16} /> Add Rate
        </button>
      </div>

      <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1a10] text-[#6e695f] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">Material</th>
              <th className="text-right px-5 py-3 font-medium">Rate (NRS/g)</th>
              <th className="text-right px-5 py-3 font-medium">Rate (INR/g)</th>
              <th className="text-right px-5 py-3 font-medium">Date</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r: any) => (
              <tr key={r._id} className="border-b border-[#1f1a10]/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-[#e5e5e0]">{r.material?.name?.en || 'Unknown'}</td>
                <td className="px-5 py-3 text-right text-[#e5e5e0] tabular-nums">{r.ratePerGramNrs?.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-[#e5e5e0] tabular-nums">{r.ratePerGramInr?.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-[#8e897e] text-xs">{new Date(r.date || r.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(r._id)} className="text-[#8e897e] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {rates.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#6e695f]">No rates entered yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#fbf7f0]">New Daily Rate</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e695f] hover:text-[#e5e5e0]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Material</label>
                <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                  <option value="">Select material</option>
                  {materials.map((m: any) => <option key={m._id} value={m._id}>{m.name.en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Rate Per Gram (NRS)</label>
                <input type="number" value={form.ratePerGramNrs} onChange={(e) => setForm({ ...form, ratePerGramNrs: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Rate Per Gram (INR)</label>
                <input type="number" value={form.ratePerGramInr} onChange={(e) => setForm({ ...form, ratePerGramInr: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <button onClick={save} className="w-full bg-[#dbb86b] text-[#0a0806] py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors mt-2">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
