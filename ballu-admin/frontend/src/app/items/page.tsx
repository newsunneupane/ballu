'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Upload, Database } from 'lucide-react';

export default function ItemsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    nameEn: '', nameNp: '', description: '', tag: '', purity: '',
    category: '', material: '', weightGrams: '', wastageGrams: '',
    makingCharges: '', boutiqueDeduction: '', diamondValue: '',
    stonesDetails: '', karigarName: '', images: '',
  });
  const [showBulk, setShowBulk] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');

  const params: Record<string, string> = {};
  if (filterCategory) params.category = filterCategory;
  if (filterMaterial) params.material = filterMaterial;
  const qKey = Object.keys(params).length ? params : undefined;

  const { data: items = [] } = useQuery({
    queryKey: ['items', qKey],
    queryFn: () => api.items.list(qKey),
  });
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const invalidateItems = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  const openNew = () => {
    setEditing(null);
    setForm({
      nameEn: '', nameNp: '', description: '', tag: '', purity: '',
      category: categories[0]?._id || '', material: materials[0]?._id || '',
      weightGrams: '', wastageGrams: '0', makingCharges: '0',
      boutiqueDeduction: '0', diamondValue: '0',
      stonesDetails: '', karigarName: '', images: '',
    });
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      nameEn: item.name.en, nameNp: item.name.np, description: item.description || '',
      tag: item.tag || '', purity: item.purity || '',
      category: item.category?._id || '', material: item.material?._id || '',
      weightGrams: String(item.weightGrams), wastageGrams: String(item.wastageGrams),
      makingCharges: String(item.makingCharges), boutiqueDeduction: String(item.boutiqueDeduction),
      diamondValue: String(item.diamondValue), stonesDetails: item.stonesDetails || '',
      karigarName: item.karigarName || '', images: (item.images || []).join(', '),
    });
    setShowForm(true);
  };

  const save = async () => {
    const payload = {
      name: { en: form.nameEn, np: form.nameNp },
      description: form.description,
      tag: form.tag || undefined,
      purity: form.purity || undefined,
      category: form.category,
      material: form.material,
      weightGrams: Number(form.weightGrams),
      wastageGrams: Number(form.wastageGrams),
      makingCharges: Number(form.makingCharges),
      boutiqueDeduction: Number(form.boutiqueDeduction),
      diamondValue: Number(form.diamondValue),
      stonesDetails: form.stonesDetails || undefined,
      karigarName: form.karigarName || undefined,
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };

    if (editing) {
      await api.items.update(editing._id, payload);
    } else {
      await api.items.create(payload);
    }
    setShowForm(false);
    invalidateItems();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await api.items.delete(id);
    invalidateItems();
  };

  const handleBulkUpload = async () => {
    setBulkResult(null);
    try {
      const data = JSON.parse(bulkJson);
      const arr = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(arr) || arr.length === 0) throw new Error('Provide an array of items');
      const res = await api.items.bulkCreate(arr);
      setBulkResult(`Created ${res.count} items successfully`);
      setBulkJson('');
      invalidateItems();
    } catch (err: any) {
      setBulkResult(`Error: ${err.message}`);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will seed 40 random items. Continue?')) return;
    setSeeding(true);
    setSeedResult(null);
    try {
      const token = localStorage.getItem('bj_token');
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ seedItems: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSeedResult(data.created?.join(', ') || `${data.itemCount} items seeded`);
      invalidateItems();
    } catch (err: any) {
      setSeedResult(`Error: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const tags = ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#fbf7f0]">Items</h1>
        <div className="flex gap-2">
          <button onClick={() => { setBulkJson(''); setBulkResult(null); setShowBulk(true); }} className="flex items-center gap-2 bg-[#0f0c0a] border border-[#1f1a10] text-[#e5e5e0] px-4 py-2 rounded text-sm font-medium hover:border-[#dbb86b] transition-colors">
            <Upload size={16} /> Bulk Upload
          </button>
          <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 bg-[#0f0c0a] border border-[#1f1a10] text-[#e5e5e0] px-4 py-2 rounded text-sm font-medium hover:border-[#dbb86b] transition-colors disabled:opacity-50">
            <Database size={16} /> {seeding ? 'Seeding...' : 'Seed 40 Items'}
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-[#dbb86b] text-[#0a0806] px-4 py-2 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#0f0c0a] border border-[#1f1a10] rounded px-3 py-2 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]"
        >
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name.en}</option>
          ))}
        </select>
        <select
          value={filterMaterial}
          onChange={(e) => setFilterMaterial(e.target.value)}
          className="bg-[#0f0c0a] border border-[#1f1a10] rounded px-3 py-2 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]"
        >
          <option value="">All Materials</option>
          {materials.map((m: any) => (
            <option key={m._id} value={m._id}>{m.name.en}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1a10] text-[#6e695f] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-4 py-3 font-medium">Image</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Material</th>
              <th className="text-right px-4 py-3 font-medium">Weight</th>
              <th className="text-right px-4 py-3 font-medium">Price</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item._id} className="border-b border-[#1f1a10]/50 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-[#1f1a10]" />
                  ) : (
                    <div className="w-10 h-10 rounded border border-[#1f1a10] bg-[#0a0806]" />
                  )}
                </td>
                <td className="px-4 py-3 text-[#e5e5e0] whitespace-nowrap">{item.name?.en}</td>
                <td className="px-4 py-3 text-[#8e897e]">{item.category?.name?.en || '—'}</td>
                <td className="px-4 py-3 text-[#8e897e]">{item.material?.name?.en || '—'}</td>
                <td className="px-4 py-3 text-right text-[#e5e5e0] tabular-nums">{item.weightGrams}g</td>
                <td className="px-4 py-3 text-right text-[#dbb86b] tabular-nums font-medium">
                  {item.finalPrice != null ? `Rs ${item.finalPrice.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-[#8e897e] hover:text-[#dbb86b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(item._id)} className="text-[#8e897e] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-[#6e695f]">No items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setShowForm(false)}>
          <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#fbf7f0]">{editing ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e695f] hover:text-[#e5e5e0]"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Name (English)</label>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Name (Nepali)</label>
                <input value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                  <option value="">Select</option>
                  {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name.en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Material</label>
                <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                  <option value="">Select</option>
                  {materials.map((m: any) => <option key={m._id} value={m._id}>{m.name.en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Tag</label>
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                  <option value="">None</option>
                  {tags.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Purity</label>
                <input value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" placeholder="e.g. 22K" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Weight (grams)</label>
                <input type="number" step="0.01" value={form.weightGrams} onChange={(e) => setForm({ ...form, weightGrams: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Wastage (grams)</label>
                <input type="number" step="0.01" value={form.wastageGrams} onChange={(e) => setForm({ ...form, wastageGrams: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Making Charges (Rs)</label>
                <input type="number" value={form.makingCharges} onChange={(e) => setForm({ ...form, makingCharges: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Boutique Deduction (Rs)</label>
                <input type="number" value={form.boutiqueDeduction} onChange={(e) => setForm({ ...form, boutiqueDeduction: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Diamond Value (Rs)</label>
                <input type="number" value={form.diamondValue} onChange={(e) => setForm({ ...form, diamondValue: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Karigar Name</label>
                <input value={form.karigarName} onChange={(e) => setForm({ ...form, karigarName: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Stones Details</label>
                <input value={form.stonesDetails} onChange={(e) => setForm({ ...form, stonesDetails: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Image URLs (comma-separated)</label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" placeholder="https://..." />
              </div>
            </div>
            <button onClick={save} className="w-full bg-[#dbb86b] text-[#0a0806] py-2.5 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors mt-5">
              {editing ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      )}

      {showBulk && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setShowBulk(false)}>
          <div className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#fbf7f0]">Bulk Upload Items</h2>
              <button onClick={() => setShowBulk(false)} className="text-[#6e695f] hover:text-[#e5e5e0]"><X size={18} /></button>
            </div>
            <p className="text-xs text-[#6e695f] mb-3">Paste a JSON array of items. Each item needs <span className="text-[#dbb86b]">category</span>, <span className="text-[#dbb86b]">material</span> (IDs), <span className="text-[#dbb86b]">name</span> (object with <span className="text-[#dbb86b]">en</span>/<span className="text-[#dbb86b]">np</span>), and <span className="text-[#dbb86b]">weightGrams</span>.</p>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              rows={12}
              className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] font-mono focus:outline-none focus:border-[#dbb86b]"
              placeholder='[{&quot;category&quot;: &quot;...&quot;, &quot;material&quot;: &quot;...&quot;, &quot;name&quot;: {&quot;en&quot;: &quot;Item Name&quot;, &quot;np&quot;: &quot;...&quot;}, &quot;weightGrams&quot;: 10}]'
            />
            {bulkResult && (
              <div className={`mt-3 text-sm px-3 py-2 rounded ${bulkResult.startsWith('Error') ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'}`}>
                {bulkResult}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={handleBulkUpload} className="flex-1 bg-[#dbb86b] text-[#0a0806] py-2.5 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
                Upload Items
              </button>
              <button onClick={() => { setBulkJson(''); setBulkResult(null); }} className="bg-[#1f1a10] text-[#e5e5e0] px-4 py-2.5 rounded text-sm hover:bg-[#2a2418] transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {seedResult && (
        <div className="fixed bottom-6 right-6 max-w-md bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-4 shadow-xl z-50">
          <div className="flex items-start justify-between gap-3">
            <p className={`text-sm ${seedResult.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{seedResult}</p>
            <button onClick={() => setSeedResult(null)} className="text-[#6e695f] hover:text-[#e5e5e0] shrink-0"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
