'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center px-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-[#dbb86b] text-xl md:text-3xl lg:text-4xl font-semibold tracking-wider">BALLU ADMIN</h1>
          <p className="text-[#6e695f] text-[10px] md:text-xs tracking-[0.2em] uppercase mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0f0c0a] border border-[#1f1a10] rounded-lg p-5 md:p-8 lg:p-10 space-y-4 md:space-y-5">
          {error && (
            <div className="text-red-400 text-xs md:text-sm bg-red-400/10 border border-red-400/20 rounded px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm md:text-base text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]"
            />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#6e695f] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0806] border border-[#1f1a10] rounded px-3 py-2 text-sm md:text-base text-[#e5e5e0] focus:outline-none focus:border-[#dbb86b]"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-[#dbb86b] text-[#0a0806] py-2.5 md:py-3 rounded text-sm md:text-base font-medium hover:bg-[#c9a96e] transition-colors disabled:opacity-50"
          >
            <LogIn size={16} className="md:w-5 md:h-5" /> {busy ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
