'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import SearchableSelect from '@/components/SearchableSelect';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [filterMaterial, setFilterMaterial] = useState('');
  const { data: groups = [] } = useQuery({
    queryKey: ['groups', filterMaterial || undefined],
    queryFn: () => api.groups.list(filterMaterial || undefined),
  });
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', material: '' });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['groups'] });

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', material: filterMaterial || materials[0]?._id || '' });
    setShowForm(true);
  };

  const openEdit = (g: any) => {
    setEditing(g);
    setForm({ name: g.name, material: g.material?._id || '' });
    setShowForm(true);
  };

  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    if (!form.name.trim()) {
      setError('Group name is required');
      return;
    }
    if (!form.material) {
      setError('Please select a material');
      return;
    }
    const payload = { name: form.name, material: form.material };
    try {
      if (editing) {
        await api.groups.update(editing._id, payload);
      } else {
        await api.groups.create(payload);
      }
      setShowForm(false);
      invalidate();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this group? Items and rates linked to it will lose the group.')) return;
    try {
      setDeleteError('');
      await api.groups.delete(id);
      invalidate();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

  const materialName = (g: any) => g.material?.name?.en || '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Groups</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#b8860b] text-[#ffffff] px-4 py-2 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
          <Plus size={16} /> Add Group
        </button>
      </div>

      <div className="mb-4">
        <SearchableSelect
          value={filterMaterial}
          onChange={(v) => setFilterMaterial(v)}
          options={materials.map((m: any) => ({ value: m._id, label: m.name.en }))}
          placeholder="All Materials"
          clearLabel="All Materials"
          size="sm"
          className="w-56"
        />
      </div>

      <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5ded2] text-[#6b655b] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Material</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g: any) => (
              <tr key={g._id} className="border-b border-[#e5ded2]/50 last:border-0 hover:bg-black/5">
                <td className="px-5 py-3 text-[#26221d]">{g.name}</td>
                <td className="px-5 py-3 text-[#7d776c]">{materialName(g)}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(g)} className="text-[#7d776c] hover:text-[#b8860b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(g._id)} className="text-[#7d776c] hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-[#6b655b]">No groups yet</td></tr>
            )}
            {deleteError && (
              <tr><td colSpan={3} className="px-5 py-3 text-center text-red-600 text-sm bg-red-50">{deleteError}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1f1b16]">{editing ? 'Edit Group' : 'New Group'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6b655b] hover:text-[#26221d]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Material</label>
                <SearchableSelect
                  value={form.material}
                  onChange={(v) => setForm({ ...form, material: v })}
                  options={materials.map((m: any) => ({ value: m._id, label: m.name.en }))}
                  placeholder="Select material"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 22K" className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
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