'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Save, Plus, X } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface TimingSlot {
  dayFrom: string;
  dayTo: string;
  timeFrom: string;
  timeTo: string;
}

interface FormState {
  contactEmail: string;
  phoneNumbers: string[];
  timings: TimingSlot[];
  tickerItems: string[];
}

const emptySlot = (): TimingSlot => ({ dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' });

export default function StoreSettingsPage() {
  const [form, setForm] = useState<FormState>({
    contactEmail: '',
    phoneNumbers: [''],
    timings: [emptySlot()],
    tickerItems: [''],
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.storeSettings.get().then((settings) => {
      setForm({
        contactEmail: settings.contactEmail || '',
        phoneNumbers: settings.phoneNumbers?.length ? settings.phoneNumbers : [''],
        timings: settings.timings?.length ? settings.timings : [emptySlot()],
        tickerItems: settings.tickerItems?.length ? settings.tickerItems : [''],
      });
    });
  }, []);

  const updatePhone = (index: number, value: string) => {
    const phones = [...form.phoneNumbers];
    phones[index] = value;
    setForm({ ...form, phoneNumbers: phones });
  };

  const addPhone = () => setForm({ ...form, phoneNumbers: [...form.phoneNumbers, ''] });

  const removePhone = (index: number) => {
    const phones = form.phoneNumbers.filter((_, i) => i !== index);
    setForm({ ...form, phoneNumbers: phones.length ? phones : [''] });
  };

  const updateTiming = (index: number, field: keyof TimingSlot, value: string) => {
    const timings = form.timings.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    setForm({ ...form, timings });
  };

  const addTiming = () => {
    if (form.timings.length >= 4) return;
    setForm({ ...form, timings: [...form.timings, emptySlot()] });
  };

  const removeTiming = (index: number) => {
    const timings = form.timings.filter((_, i) => i !== index);
    setForm({ ...form, timings: timings.length ? timings : [emptySlot()] });
  };

  const updateTickerItem = (index: number, value: string) => {
    const items = [...form.tickerItems];
    items[index] = value;
    setForm({ ...form, tickerItems: items });
  };

  const addTickerItem = () => setForm({ ...form, tickerItems: [...form.tickerItems, ''] });

  const removeTickerItem = (index: number) => {
    const items = form.tickerItems.filter((_, i) => i !== index);
    setForm({ ...form, tickerItems: items.length ? items : [''] });
  };

  const save = async () => {
    await api.storeSettings.update({
      contactEmail: form.contactEmail,
      phoneNumbers: form.phoneNumbers.filter(Boolean),
      timings: form.timings,
      tickerItems: form.tickerItems.filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#fbf7f0] mb-8">Store Settings</h1>

      <div className="max-w-xl space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Contact Email</label>
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full bg-[#0f0c0a] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Phone Numbers</label>
          <div className="space-y-2">
            {form.phoneNumbers.map((phone, i) => (
              <div key={i} className="flex gap-2">
                <input value={phone} onChange={(e) => updatePhone(i, e.target.value)} className="flex-1 bg-[#0f0c0a] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" placeholder="+977 ..." />
                <button onClick={() => removePhone(i)} className="text-[#6e695f] hover:text-red-400 transition-colors text-xs">✕</button>
              </div>
            ))}
            <button onClick={addPhone} className="text-[#dbb86b] text-xs hover:underline">+ Add another</button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Timings (max 4 slots)</label>
          <div className="space-y-3">
            {form.timings.map((slot, i) => (
              <div key={i} className="bg-[#0f0c0a] border border-[#1f1a10] rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#6e695f]">Slot {i + 1}</span>
                  <button onClick={() => removeTiming(i)} className="text-[#6e695f] hover:text-red-400 transition-colors"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[9px] tracking-[0.15em] uppercase text-[#6e695f] mb-1">From Day</label>
                    <select value={slot.dayFrom} onChange={(e) => updateTiming(i, 'dayFrom', e.target.value)} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-2 py-1.5 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.15em] uppercase text-[#6e695f] mb-1">To Day</label>
                    <select value={slot.dayTo} onChange={(e) => updateTiming(i, 'dayTo', e.target.value)} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-2 py-1.5 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.15em] uppercase text-[#6e695f] mb-1">Open</label>
                    <select value={slot.timeFrom} onChange={(e) => updateTiming(i, 'timeFrom', e.target.value)} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-2 py-1.5 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                      {Array.from({ length: 24 }, (_, h) => h).map((h) => {
                        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
                        return <option key={h} value={String(h)}>{label}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.15em] uppercase text-[#6e695f] mb-1">Close</label>
                    <select value={slot.timeTo} onChange={(e) => updateTiming(i, 'timeTo', e.target.value)} className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-2 py-1.5 text-xs text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]">
                      {Array.from({ length: 24 }, (_, h) => h).map((h) => {
                        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
                        return <option key={h} value={String(h)}>{label}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {form.timings.length < 4 && (
              <button onClick={addTiming} className="flex items-center gap-1.5 text-[#dbb86b] text-xs hover:underline">
                <Plus size={14} /> Add timing slot
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Top Navbar Ticker Items</label>
          <p className="text-[9px] tracking-[0.1em] text-[#6e695f] mb-2">Rates and WhatsApp are always shown. Add optional text snippets below.</p>
          <div className="space-y-2">
            {form.tickerItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={(e) => updateTickerItem(i, e.target.value)} className="flex-1 bg-[#0f0c0a] border border-[#1f1a10] rounded px-3 py-2 text-sm text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]" placeholder="e.g. TIHAR ATELIER HOURS · NOW EXTENDED TO 9PM" />
                <button onClick={() => removeTickerItem(i)} className="text-[#6e695f] hover:text-red-400 transition-colors text-xs">✕</button>
              </div>
            ))}
            <button onClick={addTickerItem} className="text-[#dbb86b] text-xs hover:underline">+ Add ticker item</button>
          </div>
        </div>

        <button onClick={save} className="flex items-center gap-2 bg-[#dbb86b] text-[#0a0806] px-5 py-2.5 rounded text-sm font-medium hover:bg-[#c9a96e] transition-colors">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
