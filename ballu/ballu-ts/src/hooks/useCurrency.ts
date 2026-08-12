'use client';

import { useEffect, useState } from 'react';
import { countryToCurrency, formatCurrency, type CurrencyCode } from '@/lib/utils/currency';

function readCountryCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )bj_country=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function useCurrency(): { currency: CurrencyCode; format: (npr: number) => string } {
  const [currency, setCurrency] = useState<CurrencyCode>('NPR');

  useEffect(() => {
    setCurrency(countryToCurrency(readCountryCookie()));
  }, []);

  return {
    currency,
    format: (npr: number) => formatCurrency(npr, currency),
  };
}
