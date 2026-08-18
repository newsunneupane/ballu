'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: api.collections.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameEn: '', nameNp: '', description: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['collections'] });

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
        await api.collections.update(editing._id, payload);
      } else {
        await api.collections.create(payload);
      }
      setShowForm(false);
      invalidate();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this collection?')) return;
    try {
      setDeleteError('');
      await api.collections.delete(id);
      invalidate();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Collections</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#b8860b] text-[#ffffff] px-4 py-2 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
          <Plus size={16} /> Add Collection
        </button>
      </div>

      <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5ded2] text-[#6b655b] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">English</th>
              <th className="text-left px-5 py-3 font-medium">Nepali</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c: any) => (
              <tr key={c._id} className="border-b border-[#e5ded2]/50 last:border-0 hover:bg-black/5">
                <td className="px-5 py-3 text-[#26221d]">{c.name.en}</td>
                <td className="px-5 py-3 text-[#26221d]">{c.name.np}</td>
                <td className="px-5 py-3 text-[#7d776c] text-xs">{c.description || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="text-[#7d776c] hover:text-[#b8860b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(c._id)} className="text-[#7d776c] hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[#6b655b]">No collections yet</td></tr>
            )}
            {deleteError && (
              <tr><td colSpan={4} className="px-5 py-3 text-center text-red-600 text-sm bg-red-50">{deleteError}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1f1b16]">{editing ? 'Edit Collection' : 'New Collection'}</h2>
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
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
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
