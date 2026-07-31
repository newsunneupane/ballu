'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameEn: '', nameNp: '', description: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] });

  const openNew = () => {
    setEditing(null);
    setForm({ nameEn: '', nameNp: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ nameEn: c.name.en, nameNp: c.name.np, description: c.description || '' });
    setShowForm(true);
  };

  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    const payload = { name: { en: form.nameEn, np: form.nameNp }, description: form.description };
    try {
      if (editing) {
        await api.categories.update(editing._id, payload);
      } else {
        await api.categories.create(payload);
      }
      setShowForm(false);
      invalidate();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      setDeleteError('');
      await api.categories.delete(id);
      invalidate();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Categories</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#dbb86b] text-[#0a0806] px-4 py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1a10] text-[#6e695f] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">English</th>
              <th className="text-left px-5 py-3 font-medium">Nepali</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c._id} className="border-b border-[#1f1a10]/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-[#e5e5e0]">{c.name.en}</td>
                <td className="px-5 py-3 text-[#e5e5e0]">{c.name.np}</td>
                <td className="px-5 py-3 text-[#8e897e] text-xs">{c.description || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="text-[#8e897e] hover:text-[#dbb86b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(c._id)} className="text-[#8e897e] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[#6e695f]">No categories yet</td></tr>
            )}
            {deleteError && (
              <tr><td colSpan={4} className="px-5 py-3 text-center text-red-400 text-sm bg-red-400/5">{deleteError}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#fbf7f0]">{editing ? 'Edit Category' : 'New Category'}</h2>
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
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              {error && (
                <div className="text-red-400 text-sm px-3 py-2 rounded bg-red-400/10">{error}</div>
              )}
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
