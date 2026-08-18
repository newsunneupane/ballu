'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { nprToInr } from '@/lib/utils/units';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function MaterialsPage() {
  const queryClient = useQueryClient();
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameEn: '', nameNp: '', rateNpr: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['materials'] });

  const openNew = () => {
    setEditing(null);
    setForm({ nameEn: '', nameNp: '', rateNpr: '' });
    setShowForm(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setForm({ nameEn: m.name.en, nameNp: m.name.np, rateNpr: String(m.rateNpr ?? '') });
    setShowForm(true);
  };

  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    if (!form.rateNpr || Number(form.rateNpr) <= 0) {
      setError('Rate (NPR/g) is required and must be greater than 0');
      return;
    }
    const payload = { name: { en: form.nameEn, np: form.nameNp }, rateNpr: Number(form.rateNpr) };
    try {
      if (editing) {
        await api.materials.update(editing._id, payload);
      } else {
        await api.materials.create(payload);
      }
      setShowForm(false);
      invalidate();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    try {
      setDeleteError('');
      await api.materials.delete(id);
      invalidate();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

  const inrValue = form.rateNpr ? nprToInr(Number(form.rateNpr) || 0) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Materials</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#b8860b] text-[#ffffff] px-4 py-2 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
          <Plus size={16} /> Add Material
        </button>
      </div>

      <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5ded2] text-[#6b655b] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">English</th>
              <th className="text-left px-5 py-3 font-medium">Nepali</th>
              <th className="text-right px-5 py-3 font-medium">Rate (NPR/g)</th>
              <th className="text-right px-5 py-3 font-medium">Rate (INR/g)</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m: any) => (
              <tr key={m._id} className="border-b border-[#e5ded2]/50 last:border-0 hover:bg-black/5">
                <td className="px-5 py-3 text-[#26221d]">{m.name.en}</td>
                <td className="px-5 py-3 text-[#26221d]">{m.name.np}</td>
                <td className="px-5 py-3 text-right text-[#b8860b] tabular-nums">{Number(m.rateNpr || 0).toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-[#7d776c] tabular-nums">{nprToInr(Number(m.rateNpr || 0)).toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-[#7d776c] hover:text-[#b8860b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(m._id)} className="text-[#7d776c] hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#6b655b]">No materials yet</td></tr>
            )}
            {deleteError && (
              <tr><td colSpan={5} className="px-5 py-3 text-center text-red-600 text-sm bg-red-50">{deleteError}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1f1b16]">{editing ? 'Edit Material' : 'New Material'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6b655b] hover:text-[#26221d]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Name (English)</label>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Name (Nepali)</label>
                <input value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Rate (NPR per gram)</label>
                <input type="number" step="0.01" min="0" value={form.rateNpr} onChange={(e) => setForm({ ...form, rateNpr: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                {inrValue != null && (
                  <p className="text-[10px] text-[#6b655b] mt-1.5">≈ ₹ {inrValue.toLocaleString()} per gram</p>
                )}
              </div>
              {error && (
                <div className="text-red-600 text-sm px-3 py-2 rounded bg-red-50">{error}</div>
              )}
              <button onClick={save} className="w-full bg-[#b8860b] text-[#ffffff] py-2 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors mt-2">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
