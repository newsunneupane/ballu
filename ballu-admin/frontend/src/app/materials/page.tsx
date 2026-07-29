'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function MaterialsPage() {
  const queryClient = useQueryClient();
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameEn: '', nameNp: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['materials'] });

  const openNew = () => {
    setEditing(null);
    setForm({ nameEn: '', nameNp: '' });
    setShowForm(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setForm({ nameEn: m.name.en, nameNp: m.name.np });
    setShowForm(true);
  };

  const save = async () => {
    const payload = { name: { en: form.nameEn, np: form.nameNp } };
    if (editing) {
      await api.materials.update(editing._id, payload);
    } else {
      await api.materials.create(payload);
    }
    setShowForm(false);
    invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    await api.materials.delete(id);
    invalidate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Materials</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#dbb86b] text-[#0a0806] px-4 py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
          <Plus size={16} /> Add Material
        </button>
      </div>

      <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1a10] text-[#6e695f] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">English</th>
              <th className="text-left px-5 py-3 font-medium">Nepali</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m: any) => (
              <tr key={m._id} className="border-b border-[#1f1a10]/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-[#e5e5e0]">{m.name.en}</td>
                <td className="px-5 py-3 text-[#e5e5e0]">{m.name.np}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-[#8e897e] hover:text-[#dbb86b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(m._id)} className="text-[#8e897e] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-[#6e695f]">No materials yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#fbf7f0]">{editing ? 'Edit Material' : 'New Material'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e695f] hover:text-[#e5e5e0]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Name (English)</label>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Name (Nepali)</label>
                <input value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <button onClick={save} className="w-full bg-[#dbb86b] text-[#0a0806] py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors mt-2">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
