'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Package, Gem, Tag, MessageSquare, PhoneCall } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.allSettled([
      api.items.list(),
      api.materials.list(),
      api.categories.list(),
      api.customRequests.list(),
      api.itemInquiries.list(),
    ]).then(([items, materials, categories, customRequests, itemInquiries]) => {
      const val = (r: any) => (r.status === 'fulfilled' ? r.value : []);
      setStats({
        items: val(items).length,
        materials: val(materials).length,
        categories: val(categories).length,
        customRequests: val(customRequests).length,
        pendingRequests: val(customRequests).filter((r: any) => r.status === 'Pending').length,
        itemInquiries: val(itemInquiries).length,
        pendingInquiries: val(itemInquiries).filter((i: any) => i.status === 'Pending').length,
      });
    });
  }, []);

  if (!stats) return (
    <div>
      <h1 className="text-2xl font-semibold text-[#fbf7f0] mb-8">Dashboard</h1>
      <p className="text-[#6e695f] text-xs tracking-widest uppercase">Loading...</p>
    </div>
  );

  const cards = [
    { label: 'Items', value: stats.items, icon: Package, color: 'text-blue-400' },
    { label: 'Materials', value: stats.materials, icon: Gem, color: 'text-emerald-400' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'text-purple-400' },
    { label: 'Custom Requests', value: stats.customRequests, icon: MessageSquare, color: 'text-amber-400' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: MessageSquare, color: 'text-red-400' },
    { label: 'Item Inquiries', value: stats.itemInquiries, icon: PhoneCall, color: 'text-cyan-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#fbf7f0] mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className={`${card.color}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#6e695f] text-[10px] tracking-[0.2em] uppercase">{card.label}</p>
                  <p className="text-2xl font-semibold text-[#fbf7f0] mt-0.5">{card.value ?? '—'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
