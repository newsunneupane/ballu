'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cloudinaryUrl } from '@/lib/cloudinary';
import SearchableSelect from '@/components/SearchableSelect';
import { Save, Plus, X, ChevronUp, ChevronDown, ImagePlus, Loader2, Presentation } from 'lucide-react';

type BannerType = 'collection' | 'material' | 'group' | 'item';

interface Banner {
  type: BannerType;
  refId: string;
  image: string;
  title?: string;
  subtitle?: string;
}

const MAX_BANNERS = 8;
const TYPE_OPTIONS: { value: BannerType; label: string }[] = [
  { value: 'collection', label: 'Collection' },
  { value: 'material', label: 'Material' },
  { value: 'group', label: 'Group' },
  { value: 'item', label: 'Item' },
];

const emptyBanner = (): Banner => ({ type: 'collection', refId: '', image: '' });

const itemSubLabel = (i: { group?: { name?: string } | string | null; material?: { name?: { en?: string } } | string | null; purity?: string | null } | null | undefined) =>
  (i?.group && typeof i.group === 'object' && i.group.name) ||
  (i?.material && typeof i.material === 'object' && i.material.name?.en) ||
  i?.purity ||
  '';

export default function HeroBannerPage() {
  const queryClient = useQueryClient();
  const [banners, setBanners] = useState<Banner[]>([emptyBanner()]);
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [imageError, setImageError] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [saveError, setSaveError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: api.collections.list,
  });
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.groups.list(),
  });
  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: () => api.items.list(),
  });
  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: api.storeSettings.get,
  });

  const initBanners = () => {
    if (!settings) return;
    const savedBanners: Banner[] = Array.isArray(settings.heroBanners) && settings.heroBanners.length > 0
      ? (settings.heroBanners as Banner[]).map((b) => ({
          type: b.type as BannerType,
          refId: b.refId || '',
          image: b.image || '',
          title: b.title || '',
          subtitle: b.subtitle || '',
        }))
      : [emptyBanner()];
    setBanners(savedBanners);
    setInitialized(true);
  };

  if (settings && !initialized) initBanners();

  const updateBanner = (index: number, patch: Partial<Banner>) => {
    setDuplicateError('');
    const target = banners[index];
    const next = { ...target, ...patch };
    const clash = banners.some(
      (b, i) => i !== index && b.refId && b.refId === next.refId && b.type === next.type
    );
    if (clash) {
      setDuplicateError(`Can't create the duplicate item: this ${next.type} is already in the list. Pick a different one.`);
      return;
    }
    setBanners((prev) => prev.map((b, i) => (i === index ? next : b)));
  };

  const addBanner = () => {
    if (banners.length >= MAX_BANNERS) return;
    setBanners((prev) => [...prev, emptyBanner()]);
  };

  const removeBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBanner = (index: number, dir: -1 | 1) => {
    setBanners((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const entityOptions = (type: BannerType): { value: string; label: string }[] => {
    switch (type) {
      case 'collection':
        return collections.map((c) => ({ value: c._id, label: c.name?.en || '' }));
      case 'material':
        return materials.map((m) => ({ value: m._id, label: m.name?.en || '' }));
      case 'group':
        return groups.map((g) => ({ value: g._id, label: `${g.name} · ${g.material?.name?.en || ''}`.trim() }));
      case 'item':
        return items.map((i) => ({
          value: i._id,
          label: [i.name?.en, itemSubLabel(i)].filter(Boolean).join(' · '),
        }));
    }
  };

  const entityLabel = (banner: Banner) => {
    const options = entityOptions(banner.type);
    return options.find((o) => o.value === banner.refId)?.label || '';
  };

  const openFilePicker = (index: number) => {
    setImageError('');
    setPendingIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || pendingIndex == null) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setUploadingIndex(pendingIndex);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
      const res = await api.upload.image(base64, 'ballu/hero');
      updateBanner(pendingIndex, { image: res.url });
    } catch (err) {
      setImageError((err as Error).message || 'Upload failed. Please try again.');
    } finally {
      setUploadingIndex(null);
      setPendingIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    setSaveError('');
    const complete = banners
      .filter((b) => b.type && b.refId && b.image.trim())
      .map((b) => ({
        type: b.type,
        refId: b.refId,
        image: b.image.trim(),
        title: b.title?.trim() || undefined,
        subtitle: b.subtitle?.trim() || undefined,
      }));
    if (complete.length === 0) {
      setSaveError('Add at least one banner with a type, entity and image before saving.');
      return;
    }
    const seen = new Set<string>();
    for (const b of complete) {
      const key = `${b.type}:${b.refId}`;
      if (seen.has(key)) {
        setSaveError(`Can't create the duplicate item: the ${b.type} "${b.refId}" is already used in another banner.`);
        return;
      }
      seen.add(key);
    }
    try {
      await api.storeSettings.update({ heroBanners: complete });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError((err as Error).message || 'Failed to save banners.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Hero Banner</h1>
        <button onClick={save} className="flex items-center gap-2 bg-[#b8860b] text-[#ffffff] px-5 py-2.5 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Banners'}
        </button>
      </div>
      <p className="text-[11px] text-[#6b655b] mb-6">
        Build a rotating homepage slider (up to {MAX_BANNERS} banners). Each banner links to a collection, material, material group, or item.
        Order shown here is the slider order.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileChange}
        className="hidden"
        id="hero-banner-image-input"
      />

      <div className="space-y-4 max-w-3xl">
        {banners.map((banner, index) => (
          <div key={index} className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#6b655b]">Banner {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveBanner(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 text-[#6b655b] hover:text-[#b8860b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  onClick={() => moveBanner(index, 1)}
                  disabled={index === banners.length - 1}
                  className="p-1.5 text-[#6b655b] hover:text-[#b8860b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown size={15} />
                </button>
                <button onClick={() => removeBanner(index)} className="p-1.5 text-[#6b655b] hover:text-red-600 transition-colors" aria-label="Remove banner">
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Type</label>
                <select
                  value={banner.type}
                  onChange={(e) => updateBanner(index, { type: e.target.value as BannerType, refId: '' })}
                  className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Link To</label>
                <SearchableSelect
                  value={banner.refId}
                  onChange={(v) => updateBanner(index, { refId: v })}
                  options={entityOptions(banner.type)}
                  placeholder={`Select ${banner.type}`}
                  clearLabel={`No ${banner.type}`}
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Title (optional)</label>
                <input
                  value={banner.title || ''}
                  onChange={(e) => updateBanner(index, { title: e.target.value })}
                  className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]"
                  placeholder="Falls back to entity name"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Subtitle (optional)</label>
                <input
                  value={banner.subtitle || ''}
                  onChange={(e) => updateBanner(index, { subtitle: e.target.value })}
                  className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]"
                  placeholder="Short supporting line"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Image</label>
              <div className="flex items-center gap-4">
                {banner.image ? (
                  <div className="relative group shrink-0">
                    <img
                      src={cloudinaryUrl(banner.image, { width: 320, aspect: '16:9' })}
                      alt=""
                      className="w-48 aspect-video object-cover rounded border border-[#e5ded2]"
                    />
                    <button
                      type="button"
                      onClick={() => updateBanner(index, { image: '' })}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-48 aspect-video rounded border border-dashed border-[#e5ded2] bg-[#faf8f4] flex items-center justify-center text-[#6b655b] text-[10px] uppercase tracking-widest shrink-0">
                    No image
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openFilePicker(index)}
                    className="inline-flex items-center gap-2 bg-[#ffffff] border border-[#e5ded2] text-[#26221d] px-4 py-2 rounded text-sm font-medium hover:border-[#b8860b] transition-colors"
                  >
                    {uploadingIndex === index ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                    {uploadingIndex === index ? 'Uploading…' : banner.image ? 'Replace Image' : 'Upload Image'}
                  </button>
                  <span className="text-[10px] text-[#6b655b]">
                    Recommended: 1920 × 1080 (16:9) hero image, uploaded to Cloudinary.
                  </span>
                </div>
              </div>
            </div>

            {banner.refId && banner.type && (
              <div className="mt-3 text-[11px] text-[#6b655b]">
                Target: <span className="text-[#b8860b]">{entityLabel(banner)}</span>
              </div>
            )}
          </div>
        ))}

        {banners.length < MAX_BANNERS ? (
          <button onClick={addBanner} className="flex items-center gap-1.5 text-[#b8860b] text-xs hover:underline">
            <Plus size={14} /> Add banner ({banners.length}/{MAX_BANNERS})
          </button>
        ) : (
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#6b655b]">Maximum of {MAX_BANNERS} banners reached.</p>
        )}

        {imageError && <p className="text-red-600 text-xs">{imageError}</p>}
        {duplicateError && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{duplicateError}</p>}
        {saveError && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{saveError}</p>}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[11px] text-[#6b655b]">
        <Presentation size={14} className="text-[#b8860b]" />
        Banners appear on the public site hero and auto-rotate every 4 seconds.
      </div>
    </div>
  );
}
