import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  getCollectionsData,
  getMaterialsData,
  getRatesData,
  getStoreSettingsData,
} from '@/lib/server/catalog-data';

export async function prefetchCatalogData() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['rates-current'],
      queryFn: () => getRatesData(),
      staleTime: 60 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['store-settings'],
      queryFn: () => getStoreSettingsData(),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['onboarding-materials'],
      queryFn: () => getMaterialsData(),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['onboarding-collections'],
      queryFn: () => getCollectionsData(),
      staleTime: 5 * 60 * 1000,
    }),
  ]);

  return dehydrate(queryClient);
}
