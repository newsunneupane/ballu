'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { toast, dismiss, ToastMessage } from '@/lib/toast';

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => toast.subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="flex items-start gap-3 min-w-[280px] max-w-sm bg-[#ffffff] border border-[#e5ded2] rounded-lg px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] animate-toast-in"
        >
          {t.type === 'success' ? (
            <CheckCircle2 size={18} className="text-[#16a34a] shrink-0 mt-0.5" />
          ) : (
            <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <span
            className={`text-sm ${t.type === 'success' ? 'text-[#26221d]' : 'text-red-700'} leading-snug flex-1`}
          >
            {t.message}
          </span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            className="text-[#6b655b] hover:text-[#26221d] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
