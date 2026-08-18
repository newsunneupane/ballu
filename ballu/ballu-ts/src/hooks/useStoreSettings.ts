'use client';

import { useQuery } from '@tanstack/react-query';

export interface StoreSettings {
  contactEmail?: string;
  phoneNumbers?: string[];
  timings?: { dayFrom: string; dayTo: string; timeFrom: string; timeTo: string }[];
  tickerItems?: string[];
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: async (): Promise<StoreSettings | null> => {
      const res = await fetch('/api/store-settings');
      if (!res.ok) return null;
      return res.json();
    },
  });
}

export function whatsappNumber(settings?: StoreSettings | null): string | null | undefined {
  return settings?.phoneNumbers?.[0];
}
