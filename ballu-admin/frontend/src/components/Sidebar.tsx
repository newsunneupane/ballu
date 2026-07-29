'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  LayoutDashboard,
  Gem,
  Tag,
  Package,
  DollarSign,
  MessageSquare,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/materials', label: 'Materials', icon: Gem },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/items', label: 'Items', icon: Package },
  { href: '/daily-rates', label: 'Daily Rates', icon: DollarSign },
  { href: '/custom-requests', label: 'Custom Requests', icon: MessageSquare, badgeKey: 'pendingRequests' as const },
  { href: '/item-inquiries', label: 'Item Inquiries', icon: PhoneCall, badgeKey: 'pendingInquiries' as const },
  { href: '/store-settings', label: 'Store Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: pendingCounts = {} as Record<string, number> } = useQuery({
    queryKey: ['pending-counts'],
    queryFn: async () => {
      const [customData, inquiryData] = await Promise.all([
        api.customRequests.list('Pending').catch(() => []),
        api.itemInquiries.list('Pending').catch(() => []),
      ]);
      return { pendingRequests: customData.length, pendingInquiries: inquiryData.length };
    },
    refetchInterval: 30000,
  });

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-[#1f1a10] flex items-center justify-between">
        <div>
          <h1 className="text-[#dbb86b] text-lg font-semibold tracking-wider">BALLU ADMIN</h1>
          <p className="text-[#6e695f] text-[10px] tracking-[0.2em] uppercase mt-1">Jewellers CMS</p>
        </div>
        <button onClick={closeMobile} className="md:hidden text-[#6e695f] hover:text-[#ebd3b4]">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const badge = item.badgeKey ? pendingCounts[item.badgeKey] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'text-[#dbb86b] bg-[#dbb86b]/5 border-r-2 border-[#dbb86b]'
                  : 'text-[#8e897e] hover:text-[#ebd3b4] hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#1f1a10] shrink-0">
        {user && (
          <div className="px-5 py-3 text-[#6e695f]">
            <p className="text-xs text-[#8e897e]">{user.name}</p>
            <p className="text-[10px]">{user.email}</p>
          </div>
        )}
        <div className="px-5 py-3 flex items-center justify-between">
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-[#6e695f] text-[10px] tracking-[0.2em] hover:text-[#dbb86b] transition-colors">
            View Site →
          </a>
          <button onClick={() => { logout(); closeMobile(); }} className="text-[#6e695f] hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0f0c0a] border border-[#1f1a10] rounded p-2 text-[#8e897e] hover:text-[#ebd3b4]"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 w-60 h-screen bg-[#0f0c0a] border-r border-[#1f1a10]
          transition-transform duration-300 overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
