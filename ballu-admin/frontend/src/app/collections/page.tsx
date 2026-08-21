'use client';

import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { Plus, Pencil, Trash2, X, ImagePlus, Loader2 } from 'lucide-react';

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: api.collections.list,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameEn: '', nameNp: '', description: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['collections'] });

  const openNew = () => {
    setEditing(null);
    setForm({ nameEn: '', nameNp: '', description: '', image: '' });
    setUploadError('');
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ nameEn: c.name.en, nameNp: c.name.np, description: c.description || '', image: c.image || '' });
    setUploadError('');
    setShowForm(true);
  };

  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    const payload = { name: { en: form.nameEn, np: form.nameNp }, description: form.description, image: form.image };
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

  const uploadImage = async (file: File) => {
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
      const res = await api.upload.image(base64, 'ballu/collections');
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
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
              <th className="text-left px-5 py-3 font-medium">Image</th>
              <th className="text-left px-5 py-3 font-medium">English</th>
              <th className="text-left px-5 py-3 font-medium">Nepali</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c: any) => (
              <tr key={c._id} className="border-b border-[#e5ded2]/50 last:border-0 hover:bg-black/5">
                <td className="px-5 py-3">
                  {c.image ? (
                    <img src={cloudinaryUrl(c.image, { width: 80, aspect: '3:4' })} alt="" className="w-10 h-12 object-cover rounded border border-[#e5ded2]" />
                  ) : (
                    <span className="text-[#c9c2b4] text-xs">—</span>
                  )}
                </td>
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
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#6b655b]">No collections yet</td></tr>
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
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Card Image</label>
                {form.image ? (
                  <div className="flex items-center gap-3">
                    <img src={cloudinaryUrl(form.image, { width: 160, aspect: '3:4' })} alt="Collection" className="w-16 h-20 object-cover rounded border border-[#e5ded2]" />
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 text-xs text-[#7d776c] hover:text-[#b8860b] transition-colors disabled:opacity-50">
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                        {uploading ? 'Uploading…' : 'Replace'}
                      </button>
                      <button type="button" onClick={() => setForm({ ...form, image: '' })} disabled={uploading} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-50">
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                      id="collection-image-input"
                    />
                    <label
                      htmlFor="collection-image-input"
                      className={`flex items-center justify-center gap-2 w-full bg-[#faf8f4] border border-dashed border-[#e5ded2] rounded px-3 py-4 text-sm text-[#6b655b] hover:border-[#b8860b] hover:text-[#b8860b] transition-colors cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                      {uploading ? 'Uploading…' : 'Upload Image'}
                    </label>
                  </>
                )}
                {uploadError && <p className="text-red-600 text-xs mt-1.5">{uploadError}</p>}
                <p className="text-[10px] text-[#6b655b] mt-1.5">Uploaded to Cloudinary and shown on the homepage collection card.</p>
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
