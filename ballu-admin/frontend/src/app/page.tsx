'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Package, Gem, Tag, MessageSquare, PhoneCall } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.request<{
      items: number; materials: number; categories: number;
      customRequests: number; pendingRequests: number;
      itemInquiries: number; pendingInquiries: number;
    }>('/dashboard/stats'),
  });

  if (isLoading) return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1f1b16] mb-8">Dashboard</h1>
      <p className="text-[#6b655b] text-xs tracking-widest uppercase">Loading...</p>
    </div>
  );

  const cards = [
    { label: 'Items', value: stats?.items, icon: Package, color: 'text-blue-700', href: '/items' },
    { label: 'Materials', value: stats?.materials, icon: Gem, color: 'text-emerald-700', href: '/materials' },
    { label: 'Categories', value: stats?.categories, icon: Tag, color: 'text-purple-700', href: '/categories' },
    { label: 'Custom Requests', value: stats?.customRequests, icon: MessageSquare, color: 'text-amber-700', href: '/custom-requests' },
    { label: 'Pending Requests', value: stats?.pendingRequests, icon: MessageSquare, color: 'text-red-600', href: '/custom-requests' },
    { label: 'Item Inquiries', value: stats?.itemInquiries, icon: PhoneCall, color: 'text-cyan-700', href: '/item-inquiries' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1f1b16] mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-[#ffffff] border border-[#e5ded2] rounded-lg p-5 hover:border-[#b8860b] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`${card.color}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#6b655b] text-[10px] tracking-[0.2em] uppercase">{card.label}</p>
                  <p className="text-2xl font-semibold text-[#1f1b16] mt-0.5">{card.value ?? '—'}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
