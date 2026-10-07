'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { tolaToGrams, gramsToTola } from '@/lib/utils/units';
import { stripCountFromName } from '@/lib/utils/itemName';
import SearchableSelect from '@/components/SearchableSelect';
import { Plus, Pencil, Trash2, X, Upload, ImagePlus, Loader2, Search } from 'lucide-react';

type WeightUnit = 'g' | 'tola';

interface VariantRow {
  weightValue: string;
  weightUnit: WeightUnit;
  label: string;
  labelTouched: boolean;
  manualPrice: string;
  isAvailable: boolean;
}

const emptyVariant = (): VariantRow => ({
  weightValue: '', weightUnit: 'g', label: '', labelTouched: false, manualPrice: '', isAvailable: true,
});

const initialForm = {
  nameEn: '', nameNp: '', description: '', tag: '', group: '',
  collections: [] as string[],
  variants: [emptyVariant()] as VariantRow[],
  wastagePercent: '', makingCharges: '', accessoriesCharge: '', boutiqueDeduction: '', diamondValue: '',
  caratWeight: '', stonesDetails: '',   images: [] as string[],
  isAvailable: true, showPrice: true, makingDaysMin: '', makingDaysMax: '', manualPrice: '',
  occasion: [] as string[],
};

const variantGrams = (v: VariantRow): number => {
  const n = Number(v.weightValue) || 0;
  return v.weightUnit === 'tola' ? tolaToGrams(n) : n;
};

const variantDisplayLabel = (v: VariantRow): string => {
  if (v.label.trim()) return v.label.trim();
  if (!v.weightValue) return '';
  const grams = variantGrams(v);
  if (!(grams > 0)) return '';
  return v.weightUnit === 'tola' ? `${Number(v.weightValue)} tola` : `${Number(v.weightValue)}g`;
};

export default function ItemsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(initialForm);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [filterCollection, setFilterCollection] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const params: Record<string, string> = {};
  if (filterCollection) params.collection = filterCollection;
  if (filterMaterial) params.material = filterMaterial;
  const qKey = Object.keys(params).length ? params : undefined;

  const { data: items = [] } = useQuery({
    queryKey: ['items', qKey],
    queryFn: () => api.items.list(qKey),
  });
  const { data: allItems = [] } = useQuery({
    queryKey: ['items', 'all'],
    queryFn: () => api.items.list(),
    staleTime: 30000,
  });
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: api.materials.list,
  });
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.groups.list(),
  });
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: api.collections.list,
  });
  const { data: occasions = [] } = useQuery({
    queryKey: ['occasions'],
    queryFn: api.occasions.list,
  });

  const invalidateItems = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  const filteredItems = items.filter((item: any) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.name?.en || '').toLowerCase().includes(q) ||
      (item.name?.np || '').toLowerCase().includes(q)
    );
  });

  const visibleIds = filteredItems.map((i: any) => i._id as string);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const bulkRemove = async () => {
    if (selected.size === 0) return;
    const ids = [...selected];
    if (!confirm(`Delete ${ids.length} item${ids.length > 1 ? 's' : ''}?`)) return;
    setDeleteError('');
    queryClient.setQueryData<any[]>(['items', qKey], (old = []) => old.filter((i) => !ids.includes(i._id)));
    setSelected(new Set());
    try {
      await api.items.bulkDelete(ids);
    } catch (err: any) {
      setDeleteError(err.message);
    }
    invalidateItems();
  };

  const openNew = () => {
    setEditing(null);
    const othersCat = collections.find((c: any) => c.name?.en === 'Others');
    const defaultCollection = othersCat?._id || collections[0]?._id || '';
    setForm({
      ...initialForm,
      collections: defaultCollection ? [defaultCollection] : [],
      wastagePercent: '0', makingCharges: '0', accessoriesCharge: '0',
      boutiqueDeduction: '0', diamondValue: '0',
    });
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const storedVariants: any[] = Array.isArray(item.variants) && item.variants.length > 0
      ? item.variants
      : [{ label: `${item.weightGrams}g`, weightGrams: item.weightGrams, manualPriceNpr: undefined, isAvailable: true }];
    setForm({
      nameEn: item.name.en, nameNp: item.name.np, description: item.description || '',
      tag: item.tag || '', group: item.group?._id || '',
      collections: (item.collections?.length
        ? item.collections.map((c: any) => c?._id || c).filter(Boolean)
        : item.collection ? [item.collection?._id || item.collection].filter(Boolean) : []) as string[],
      variants: storedVariants.map((v: any) => ({
        weightValue: String(v.weightGrams),
        weightUnit: 'g' as WeightUnit,
        label: v.label || `${v.weightGrams}g`,
        labelTouched: true,
        manualPrice: v.manualPriceNpr != null ? String(v.manualPriceNpr) : '',
        isAvailable: v.isAvailable !== false,
      })),
      wastagePercent: String(item.wastagePercent ?? 0),
      makingCharges: String(item.makingCharges), accessoriesCharge: String(item.accessoriesCharge ?? 0),
      boutiqueDeduction: String(item.boutiqueDeduction), diamondValue: String(item.diamondValue),
      caratWeight: item.caratWeight != null ? String(item.caratWeight) : '',
      stonesDetails: item.stonesDetails || '', images: item.images || [],
      isAvailable: item.isAvailable ?? true, showPrice: item.showPrice ?? true,
      makingDaysMin: item.estimatedMakingDays?.min != null ? String(item.estimatedMakingDays.min) : '',
      makingDaysMax: item.estimatedMakingDays?.max != null ? String(item.estimatedMakingDays.max) : '',
      manualPrice: item.manualPriceNpr != null ? String(item.manualPriceNpr) : '',
      occasion: (item.occasion || []).map((o: any) => o?._id || o).filter(Boolean) as string[],
    });
    setShowForm(true);
  };

  const updateVariant = (index: number, patch: Partial<VariantRow>) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  };

  const addVariant = () => {
    if (form.variants.length >= 12) return;
    setForm((prev) => ({ ...prev, variants: [...prev.variants, emptyVariant()] }));
  };

  const removeVariant = (index: number) => {
    if (form.variants.length <= 1) return;
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const setVariantUnit = (index: number, unit: WeightUnit) => {
    const v = form.variants[index];
    if (!v) return;
    if (!v.weightValue) {
      updateVariant(index, { weightUnit: unit });
      return;
    }
    const currentGrams = variantGrams(v);
    const nextValue = unit === 'tola' ? gramsToTola(currentGrams) : currentGrams;
    const patch: Partial<VariantRow> = { weightUnit: unit, weightValue: String(Math.round(nextValue * 1000) / 1000) };
    if (!v.labelTouched) {
      patch.label = unit === 'tola' ? `${patch.weightValue} tola` : `${patch.weightValue}g`;
    }
    updateVariant(index, patch);
  };

  const handleVariantWeight = (index: number, value: string) => {
    const v = form.variants[index];
    if (!v) return;
    const patch: Partial<VariantRow> = { weightValue: value };
    if (!v.labelTouched && value) {
      patch.label = v.weightUnit === 'tola' ? `${value} tola` : `${value}g`;
    }
    updateVariant(index, patch);
  };

  const selectedGroup = groups.find((g: any) => g._id === form.group);
  const selectedMaterial = materials.find((m: any) => m._id === selectedGroup?.material?._id);
  const groupRate = selectedGroup?.rateNpr != null && Number(selectedGroup.rateNpr) > 0 ? Number(selectedGroup.rateNpr) : Number(selectedMaterial?.rateNpr || 0);

  const priceForGrams = (weight: number, variantManual?: string): number => {
    if (form.manualPrice) return Number(form.manualPrice) || 0;
    if (variantManual) return Number(variantManual) || 0;
    const rate = groupRate;
    const goldValue = weight * rate;
    const wastage = goldValue * ((Number(form.wastagePercent) || 0) / 100);
    const making = Number(form.makingCharges) || 0;
    const accessories = Number(form.accessoriesCharge) || 0;
    const deduction = Number(form.boutiqueDeduction) || 0;
    const diamond = Number(form.diamondValue) || 0;
    return Math.round(goldValue + wastage + making + accessories - deduction + diamond);
  };

  const variantTotals = form.variants.map((v) => priceForGrams(variantGrams(v), v.manualPrice));

  const liveBreakdown = (() => {
    const weight = variantGrams(form.variants[0] || emptyVariant());
    const rate = groupRate;
    const goldValue = weight * rate;
    const wastage = goldValue * ((Number(form.wastagePercent) || 0) / 100);
    const making = Number(form.makingCharges) || 0;
    const accessories = Number(form.accessoriesCharge) || 0;
    const deduction = Number(form.boutiqueDeduction) || 0;
    const diamond = Number(form.diamondValue) || 0;
    const total = form.manualPrice ? Number(form.manualPrice) || 0 : priceForGrams(weight, form.variants[0]?.manualPrice);
    return { goldValue, wastage, making, accessories, deduction, diamond, total: Math.round(total) };
  })();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    setValidationErrors([]);
    const errors: string[] = [];
    if (form.collections.length === 0) errors.push('At least one collection is required');
    if (!form.group) errors.push('Group is required');
    if (!form.nameEn.trim()) errors.push('Name (English) is required');
    if (!form.nameNp.trim()) errors.push('Name (Nepali) is required');
    const gramsList = form.variants.map(variantGrams);
    if (gramsList.length === 0 || gramsList.some((g) => !(g > 0))) errors.push('Each variant needs a valid weight');
    const labels = form.variants.map((v) => variantDisplayLabel(v).toLowerCase() || `variant-${form.variants.indexOf(v) + 1}`);
    if (new Set(labels).size !== labels.length) errors.push('Variant labels must be unique');
    const incomingPrices = variantTotals;
    const baseKey = stripCountFromName(form.nameEn).toLowerCase();
    const sameName = allItems.filter(
      (it: any) =>
        it._id !== editing?._id &&
        stripCountFromName(it.name?.en || '').toLowerCase() === baseKey
    );
    const priceSetOf = (it: any): number[] => {
      if (Array.isArray(it.variantPrices) && it.variantPrices.length > 0) return it.variantPrices.map(Number);
      if (it.finalPrice != null) return [Number(it.finalPrice)];
      return [];
    };
    const priceDup = sameName.find((it: any) => {
      const set = priceSetOf(it);
      return incomingPrices.some((p) => set.includes(p));
    });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    let allowDuplicate = false;
    if (priceDup) {
      const unchanged =
        !!editing &&
        stripCountFromName(editing.name?.en || '').toLowerCase() === baseKey;
      if (!unchanged) {
        const dupPrice = incomingPrices.find((p) => priceSetOf(priceDup).includes(p));
        const ok = window.confirm(
          `"${form.nameEn.trim()}" with price NPR ${(dupPrice ?? incomingPrices[0]).toLocaleString()} already exists. Do you want to repeat this item?`
        );
        if (!ok) return;
        allowDuplicate = true;
      }
    }
    const makingDaysMin = form.makingDaysMin ? Number(form.makingDaysMin) : undefined;
    const makingDaysMax = form.makingDaysMax ? Number(form.makingDaysMax) : undefined;
    const payload = {
      name: { en: form.nameEn, np: form.nameNp },
      description: form.description,
      tag: form.tag || undefined,
      group: form.group,
      collections: form.collections,
      occasion: form.occasion,
      weightGrams: gramsList[0],
      variants: form.variants.map((v, i) => ({
        label: variantDisplayLabel(v) || `Variant ${i + 1}`,
        weightGrams: gramsList[i],
        ...(v.manualPrice ? { manualPriceNpr: Number(v.manualPrice) } : {}),
        isAvailable: v.isAvailable,
      })),
      wastagePercent: Number(form.wastagePercent),
      makingCharges: Number(form.makingCharges),
      accessoriesCharge: Number(form.accessoriesCharge),
      boutiqueDeduction: Number(form.boutiqueDeduction),
      diamondValue: Number(form.diamondValue),
      caratWeight: form.caratWeight ? Number(form.caratWeight) : undefined,
      stonesDetails: form.stonesDetails || undefined,
      images: form.images,
      isAvailable: form.isAvailable,
      showPrice: form.showPrice,
      estimatedMakingDays: (makingDaysMin != null || makingDaysMax != null) ? { min: makingDaysMin, max: makingDaysMax } : undefined,
      manualPriceNpr: form.manualPrice ? Number(form.manualPrice) : undefined,
      allowDuplicate,
    };

    try {
      if (editing) {
        await api.items.update(editing._id, payload);
      } else {
        await api.items.create(payload);
      }
      setShowForm(false);
      invalidateItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      setDeleteError('');
      await api.items.delete(id);
      invalidateItems();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

  const MAX_IMAGES = 4;

  const uploadImages = async (files: FileList | File[]) => {
    setImageError('');
    const toUpload = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (toUpload.length === 0) return;

    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) return;
    const accepted = toUpload.slice(0, remaining);

    setUploading(true);
    try {
      for (const file of accepted) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
        const res = await api.upload.image(base64);
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, res.url].slice(0, MAX_IMAGES),
        }));
      }
      if (accepted.length < toUpload.length) {
        setImageError(`Only ${remaining} more image slot${remaining === 1 ? '' : 's'} available.`);
      }
    } catch (err: any) {
      setImageError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const tags = ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending', 'light-weight'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1f1b16]">Items</h1>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button onClick={bulkRemove} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-500 transition-colors">
              <Trash2 size={16} /> Delete Selected ({selected.size})
            </button>
          )}
          <button onClick={() => { setBulkJson(''); setBulkResult(null); setShowBulk(true); }} className="flex items-center gap-2 bg-[#ffffff] border border-[#e5ded2] text-[#26221d] px-4 py-2 rounded text-sm font-medium hover:border-[#b8860b] transition-colors">
            <Upload size={16} /> Bulk Upload
          </button>

          <button onClick={openNew} className="flex items-center gap-2 bg-[#b8860b] text-[#ffffff] px-4 py-2 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d776c]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(new Set()); }}
            placeholder="Search by name..."
            className="w-56 bg-[#ffffff] border border-[#e5ded2] rounded pl-8 pr-3 py-2 text-sm text-[#26221d] placeholder:text-[#7d776c] focus:outline-none focus:border-[#b8860b]"
          />
        </div>
        <SearchableSelect
          value={filterCollection}
          onChange={(v) => { setFilterCollection(v); setSelected(new Set()); }}
          options={collections.map((c: any) => ({ value: c._id, label: c.name.en }))}
          placeholder="All Collections"
          clearLabel="All Collections"
          size="sm"
          className="w-56"
        />
        <SearchableSelect
          value={filterMaterial}
          onChange={(v) => { setFilterMaterial(v); setSelected(new Set()); }}
          options={materials.map((m: any) => ({ value: m._id, label: m.name.en }))}
          placeholder="All Materials"
          clearLabel="All Materials"
          size="sm"
          className="w-56"
        />
      </div>

      <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5ded2] text-[#6b655b] text-[10px] tracking-[0.2em] uppercase">
              <th className="text-left px-4 py-3 font-medium w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-[#b8860b]"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium">Image</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Collection</th>
              <th className="text-left px-4 py-3 font-medium">Group</th>
              <th className="text-left px-4 py-3 font-medium">Material</th>
              <th className="text-right px-4 py-3 font-medium">Weight</th>
              <th className="text-right px-4 py-3 font-medium">Price</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any) => (
              <tr key={item._id} className={`border-b border-[#e5ded2]/50 last:border-0 hover:bg-black/5 ${selected.has(item._id) ? 'bg-[#b8860b]/5' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="accent-[#b8860b]"
                  />
                </td>
                <td className="px-4 py-3">
                  {item.images?.[0] ? (
                    <img src={cloudinaryUrl(item.images[0], { width: 80, aspect: '1:1' })} alt="" className="w-10 h-10 object-cover rounded border border-[#e5ded2]" />
                  ) : (
                    <div className="w-10 h-10 rounded border border-[#e5ded2] bg-[#faf8f4]" />
                  )}
                </td>
                <td className="px-4 py-3 text-[#26221d] whitespace-nowrap">
                  {item.name?.en}
                  {item.isAvailable === false && (
                    <span className="ml-2 text-[9px] tracking-wider uppercase text-red-600 border border-red-500/40 rounded px-1.5 py-0.5">Unavailable</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#7d776c]">
                  {(() => {
                    const cols = item.collections?.length ? item.collections : item.collection ? [item.collection] : [];
                    const names = cols.map((c: any) => c?.name?.en).filter(Boolean);
                    if (names.length === 0) return '—';
                    return names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`;
                  })()}
                </td>
                <td className="px-4 py-3 text-[#7d776c]">{item.group?.name || '—'}</td>
                <td className="px-4 py-3 text-[#7d776c]">{item.material?.name?.en || '—'}</td>
                <td className="px-4 py-3 text-right text-[#26221d] tabular-nums whitespace-nowrap">
                  {(() => {
                    const vs: any[] = Array.isArray(item.variants) && item.variants.length > 0 ? item.variants : [{ label: `${item.weightGrams}g`, weightGrams: item.weightGrams }];
                    if (vs.length === 1) return `${vs[0].weightGrams}g`;
                    const grams = vs.map((v) => Number(v.weightGrams)).filter((n) => Number.isFinite(n));
                    return `${Math.min(...grams)}–${Math.max(...grams)}g (${vs.length})`;
                  })()}
                </td>
                <td className="px-4 py-3 text-right text-[#b8860b] tabular-nums font-medium whitespace-nowrap">
                  {item.showPrice === false ? <span className="text-[#6b655b]">Hidden</span> : (() => {
                    const prices: number[] = Array.isArray(item.variantPrices) && item.variantPrices.length > 0
                      ? item.variantPrices.map(Number)
                      : item.finalPrice != null ? [Number(item.finalPrice)] : [];
                    if (prices.length === 0) return '—';
                    if (prices.length === 1) return `Rs ${prices[0].toLocaleString()}`;
                    return `Rs ${Math.min(...prices).toLocaleString()}–${Math.max(...prices).toLocaleString()}`;
                  })()}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-[#7d776c] hover:text-[#b8860b] transition-colors mr-3"><Pencil size={14} /></button>
                  <button onClick={() => remove(item._id)} className="text-[#7d776c] hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-[#6b655b]">{items.length === 0 ? 'No items yet' : 'No items match your search'}</td></tr>
            )}
            {deleteError && (
              <tr><td colSpan={8} className="px-5 py-3 text-center text-red-600 text-sm bg-red-50">{deleteError}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setShowForm(false)}>
          <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1f1b16]">{editing ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6b655b] hover:text-[#26221d]"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Name (English)</label>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Name (Nepali)</label>
                <input value={form.nameNp} onChange={(e) => setForm({ ...form, nameNp: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Collections</label>
                  <SearchableSelect
                    multiple
                    values={form.collections}
                    onValuesChange={(v) => setForm({ ...form, collections: v })}
                    options={collections.map((c: any) => ({ value: c._id, label: c.name.en }))}
                    placeholder="Select collections"
                />
                  <p className="text-[10px] text-[#6b655b] mt-1.5">An item can belong to multiple collections. The first one is used as its primary collection.</p>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Occasions</label>
                  <SearchableSelect
                    multiple
                    values={form.occasion}
                    onValuesChange={(v) => setForm({ ...form, occasion: v })}
                    options={(() => {
                      const othersDoc = occasions.find((o: any) => o.name?.en === 'Others');
                      const normal = occasions
                        .filter((o: any) => (o.name?.en || '').toLowerCase() !== 'others')
                        .map((o: any) => ({ value: o._id, label: o.name.en }));
                      return othersDoc
                        ? [...normal, { value: othersDoc._id, label: 'Others' }]
                        : normal;
                    })()}
                    placeholder="Select occasions"
                  />
                <p className="text-[10px] text-[#6b655b] mt-1.5">An item can be suited to multiple occasions.</p>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Group</label>
                <SearchableSelect
                  value={form.group}
                  onChange={(v) => setForm({ ...form, group: v })}
                  options={groups.map((g: any) => ({ value: g._id, label: `${g.name} · ${g.material?.name?.en || ''}`.trim() }))}
                  placeholder="Select group"
                />
                {groups.length === 0 && (
                  <p className="text-[10px] text-[#6b655b] mt-1.5">No groups yet. Add them in the Groups page.</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Material</label>
                <input
                  value={selectedGroup?.material?.name?.en || ''}
                  readOnly
                  placeholder={selectedGroup ? 'No material assigned to this group' : 'Select a group to auto-select material'}
                  className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] opacity-70 cursor-not-allowed"
                />
                {selectedGroup && !selectedGroup.material && (
                  <p className="text-[10px] text-red-600 mt-1.5">This group has no material assigned — create or reassign its material in the Groups page.</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Tag</label>
                <SearchableSelect
                  value={form.tag}
                  onChange={(v) => setForm({ ...form, tag: v })}
                  options={tags.map((t) => ({ value: t, label: t }))}
                  placeholder="None"
                  clearLabel="None"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b]">Variants · weight wise ({form.variants.length}/12)</label>
                  <span className="text-[10px] text-[#6b655b]">First row = default weight & price</span>
                </div>
                <div className="space-y-2.5">
                  {form.variants.map((v, i) => {
                    const grams = variantGrams(v);
                    return (
                      <div key={i} className="border border-[#e5ded2] rounded-lg p-3 bg-[#faf8f4]/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#6b655b]">
                            {i === 0 ? '★ Default' : `Variant ${i + 1}`} · <span className="text-[#b8860b] font-semibold">Rs {(variantTotals[i] || 0).toLocaleString()}</span>
                          </span>
                          {form.variants.length > 1 && (
                            <button type="button" onClick={() => removeVariant(i)} className="text-[#7d776c] hover:text-red-600 transition-colors" aria-label={`Remove variant ${i + 1}`}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="col-span-1">
                            <label className="block text-[10px] uppercase tracking-wider text-[#6b655b] mb-1">Weight</label>
                            <div className="flex gap-1.5">
                              <input type="number" step="0.001" value={v.weightValue} onChange={(e) => handleVariantWeight(i, e.target.value)} placeholder="e.g. 10" className="flex-1 min-w-0 bg-[#ffffff] border border-[#e5ded2] rounded px-2.5 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                              <div className="flex border border-[#e5ded2] rounded overflow-hidden shrink-0 bg-white">
                                <button type="button" onClick={() => setVariantUnit(i, 'g')} className={`px-2 py-2 text-xs ${v.weightUnit === 'g' ? 'bg-[#b8860b] text-[#ffffff]' : 'text-[#7d776c]'}`}>g</button>
                                <button type="button" onClick={() => setVariantUnit(i, 'tola')} className={`px-2 py-2 text-xs ${v.weightUnit === 'tola' ? 'bg-[#b8860b] text-[#ffffff]' : 'text-[#7d776c]'}`}>tola</button>
                              </div>
                            </div>
                            {v.weightValue && grams > 0 && (
                              <p className="text-[10px] text-[#6b655b] mt-1">
                                {v.weightUnit === 'tola' ? `= ${grams.toFixed(3)} g` : `= ${gramsToTola(grams).toFixed(3)} tola`}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#6b655b] mb-1">Label (pill)</label>
                            <input value={v.label} onChange={(e) => updateVariant(i, { label: e.target.value, labelTouched: true })} placeholder={variantDisplayLabel(v) || 'e.g. 10g'} className="w-full bg-[#ffffff] border border-[#e5ded2] rounded px-2.5 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#6b655b] mb-1">Manual Rs (opt.)</label>
                            <input type="number" min="0" value={v.manualPrice} onChange={(e) => updateVariant(i, { manualPrice: e.target.value })} placeholder="Auto" className="w-full bg-[#ffffff] border border-[#e5ded2] rounded px-2.5 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                          </div>
                          <label className="flex items-center gap-2 text-xs text-[#26221d] cursor-pointer pt-5">
                            <input type="checkbox" checked={v.isAvailable} onChange={(e) => updateVariant(i, { isAvailable: e.target.checked })} className="accent-[#b8860b]" />
                            In stock
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {form.variants.length < 12 ? (
                  <button type="button" onClick={addVariant} className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#b8860b] border border-dashed border-[#b8860b]/50 rounded-lg px-3 py-2 hover:bg-[#b8860b]/5 transition-colors">
                    <Plus size={14} /> Add weight variant
                  </button>
                ) : (
                  <p className="text-[10px] text-[#6b655b] mt-2">Maximum of 12 variants reached.</p>
                )}
                <p className="text-[10px] text-[#6b655b] mt-1.5">Same design, different weights — e.g. 5g, 10g, 2 tola. Price recalculates from weight automatically.</p>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Wastage (%)</label>
                <input type="number" step="0.01" value={form.wastagePercent} onChange={(e) => setForm({ ...form, wastagePercent: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" placeholder="e.g. 8 for 8%" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Making Charges (Rs)</label>
                <input type="number" value={form.makingCharges} onChange={(e) => setForm({ ...form, makingCharges: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Accessories Charge (Rs)</label>
                <input type="number" value={form.accessoriesCharge} onChange={(e) => setForm({ ...form, accessoriesCharge: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Boutique Deduction (Rs)</label>
                <input type="number" value={form.boutiqueDeduction} onChange={(e) => setForm({ ...form, boutiqueDeduction: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Diamond Value (Rs)</label>
                <input type="number" value={form.diamondValue} onChange={(e) => setForm({ ...form, diamondValue: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Carat Weight (ct)</label>
                <input type="number" step="0.01" value={form.caratWeight} onChange={(e) => setForm({ ...form, caratWeight: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Stones Details</label>
                <input value={form.stonesDetails} onChange={(e) => setForm({ ...form, stonesDetails: e.target.value })} className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Estimated Making Period (days)</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={form.makingDaysMin} onChange={(e) => setForm({ ...form, makingDaysMin: e.target.value })} placeholder="Min" className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                  <span className="text-[#6b655b] text-xs shrink-0">to</span>
                  <input type="number" value={form.makingDaysMax} onChange={(e) => setForm({ ...form, makingDaysMax: e.target.value })} placeholder="Max" className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]" />
                </div>
              </div>
              <div className="flex items-end gap-6 pb-2">
                <label className="flex items-center gap-2 text-sm text-[#26221d] cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-[#b8860b]" />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-[#26221d] cursor-pointer">
                  <input type="checkbox" checked={form.showPrice} onChange={(e) => setForm({ ...form, showPrice: e.target.checked })} className="accent-[#b8860b]" />
                  Show Price to Users
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">
                  Images · {form.images.length}/{MAX_IMAGES}
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={cloudinaryUrl(src, { width: 160, aspect: '3:4' })}
                        alt={`Item image ${i + 1}`}
                        className="w-20 h-24 object-cover rounded border border-[#e5ded2]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  multiple
                  onChange={(e) => e.target.files && uploadImages(e.target.files)}
                  className="hidden"
                  id="item-images-input"
                />
                <div className="flex items-center gap-3">
                  {form.images.length < MAX_IMAGES ? (
                    <label
                      htmlFor="item-images-input"
                      className="inline-flex items-center gap-2 bg-[#ffffff] border border-[#e5ded2] text-[#26221d] px-4 py-2 rounded text-sm font-medium hover:border-[#b8860b] transition-colors cursor-pointer"
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                      {uploading ? 'Uploading…' : 'Upload Images'}
                    </label>
                  ) : (
                    <span className="text-xs text-[#6b655b]">Maximum of {MAX_IMAGES} images reached.</span>
                  )}
                  {imageError && <span className="text-red-600 text-xs">{imageError}</span>}
                </div>
                <p className="text-[10px] text-[#6b655b] mt-1.5">Images are uploaded to Cloudinary and stored as URLs. Up to 4 images, 5MB each. The first image is shown in the catalogue.</p>
                <p className="text-[11px] text-[#b8860b] mt-2 border border-[#e9e3d8] bg-[#b8860b]/5 rounded px-3 py-2">
                  Recommended image: 1200 × 1500 px (4:5 portrait) — this length/breadth of image will exactly fit and looks good on the item page. Other sections auto-center-crop to fill.
                </p>
              </div>
            </div>
            <div className="mt-5 border border-[#e5ded2] rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-[#b8860b]/5 border-b border-[#e5ded2] flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#b8860b]">Live Price</span>
                <span className="text-[#6b655b] text-[10px]">
                  {selectedGroup && groupRate > 0
                    ? `${selectedMaterial?.name?.en || 'Material'} rate: Rs ${groupRate.toLocaleString()}/g`
                    : selectedGroup
                      ? 'No rate set for this material'
                      : 'Select a group to see price'}
                </span>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#7d776c]">
                  <span>Gold value (weight × rate)</span>
                  <span className="tabular-nums">Rs {liveBreakdown.goldValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7d776c]">
                  <span>Wastage ({(Number(form.wastagePercent) || 0)}%)</span>
                  <span className="tabular-nums">Rs {liveBreakdown.wastage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7d776c]">
                  <span>Making charges</span>
                  <span className="tabular-nums">Rs {liveBreakdown.making.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7d776c]">
                  <span>Accessories charge</span>
                  <span className="tabular-nums">Rs {liveBreakdown.accessories.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7d776c]">
                  <span>Less: boutique deduction</span>
                  <span className="tabular-nums">− Rs {liveBreakdown.deduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7d776c]">
                  <span>Add: diamond value</span>
                  <span className="tabular-nums">+ Rs {liveBreakdown.diamond.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#e5ded2] text-[#1f1b16] font-semibold">
                  <span>Total — default variant (NPR)</span>
                  <span className="text-[#b8860b] tabular-nums text-lg">{liveBreakdown.total.toLocaleString()}</span>
                </div>
                {form.variants.length > 1 && (
                  <div className="pt-2 space-y-1 border-t border-[#e5ded2]/60">
                    {form.variants.map((v, i) => (
                      <div key={i} className="flex justify-between text-xs text-[#7d776c]">
                        <span>{variantDisplayLabel(v) || `Variant ${i + 1}`}{i === 0 ? ' (default)' : ''}</span>
                        <span className="tabular-nums">Rs {(variantTotals[i] || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6b655b] mb-1.5">Manual Price (NPR) — optional override for ALL variants</label>
              <input
                type="number"
                min="0"
                value={form.manualPrice}
                onChange={(e) => setForm({ ...form, manualPrice: e.target.value })}
                className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] focus:outline-none focus:border-[#b8860b]"
                placeholder="Leave empty to use the auto-calculated price"
              />
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-4 space-y-1">
                {validationErrors.map((e, i) => (
                  <div key={i} className="text-red-600 text-sm px-3 py-1.5 rounded bg-red-50">{e}</div>
                ))}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-sm px-3 py-2 rounded bg-red-50 mt-2">{error}</div>
            )}
            <button onClick={save} className="w-full bg-[#b8860b] text-[#ffffff] py-2.5 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors mt-5">
              {editing ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      )}

      {showBulk && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setShowBulk(false)}>
          <div className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-6 w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1f1b16]">Bulk Upload Items</h2>
              <button onClick={() => setShowBulk(false)} className="text-[#6b655b] hover:text-[#26221d]"><X size={18} /></button>
            </div>
              <p className="text-xs text-[#6b655b] mb-3">Paste a JSON array of items. Each item needs <span className="text-[#b8860b]">collections</span> (array of IDs), <span className="text-[#b8860b]">group</span> (ID — material is derived from the group), <span className="text-[#b8860b]">name</span> (object with <span className="text-[#b8860b]">en</span>/<span className="text-[#b8860b]">np</span>), and <span className="text-[#b8860b]">weightGrams</span> — or a <span className="text-[#b8860b]">variants</span> array like <span className="font-mono">[{`{label, weightGrams}`}]</span>.</p>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              rows={12}
              className="w-full bg-[#faf8f4] border border-[#e5ded2] rounded px-3 py-2 text-sm text-[#26221d] font-mono focus:outline-none focus:border-[#b8860b]"
              placeholder='[{&quot;collections&quot;: [&quot;...&quot;], &quot;group&quot;: &quot;...&quot;, &quot;name&quot;: {&quot;en&quot;: &quot;Item Name&quot;, &quot;np&quot;: &quot;...&quot;}, &quot;weightGrams&quot;: 10}]'
            />
            {bulkResult && (
              <div className={`mt-3 text-sm px-3 py-2 rounded ${bulkResult.startsWith('Error') ? 'text-red-600 bg-red-50' : 'text-green-700 bg-green-100'}`}>
                {bulkResult}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={handleBulkUpload} className="flex-1 bg-[#b8860b] text-[#ffffff] py-2.5 rounded text-sm font-medium hover:bg-[#9a7208] transition-colors">
                Upload Items
              </button>
              <button onClick={() => { setBulkJson(''); setBulkResult(null); }} className="bg-[#e5ded2] text-[#26221d] px-4 py-2.5 rounded text-sm hover:bg-[#e9e3d8] transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
