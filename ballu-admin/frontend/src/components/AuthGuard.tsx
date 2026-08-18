'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [loading, user, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <p className="text-[#6b655b] text-xs tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  if (!user && !isLoginPage) return null;

  if (isLoginPage) return <>{children}</>;

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 pt-16 md:p-8 md:pt-8">{children}</main>
    </>
  );
}
