export interface Pricing {
  goldValueNpr: number;
  wastageNpr: number;
  wastagePercent: number;
  makingNpr: number;
  accessoriesNpr: number;
  discountNpr: number;
  ratePerGramNpr: number;
}

export interface ProductVariant {
  label: string;
  weightGrams: number;
  weight: string;
  priceNpr: number | null;
  isAvailable: boolean;
  pricing?: Pricing;
}

export interface Product {
  id: string | number;
  tag: string | null;
  collection: string;
  collections: string[];
  type: string;
  occasions: string[];
  material: string;
  title: string;
  subTitle: string;
  karat: string;
  weight: string;
  priceNpr: number | null;
  description?: string;
  purity?: string;
  stones?: string;
  caratWeight?: number;
  isAvailable: boolean;
  showPrice: boolean;
  estimatedMakingDays?: { min?: number; max?: number };
  viewCount?: number;
  pricing?: Pricing;
  variants?: ProductVariant[];
  images?: string[];
  _apiItem?: any;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'most-viewed';

export interface ProductFilters {
  collections: string[];
  occasions?: string[];
  material: string;
  purity?: string;
  tag: string;
  availableOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  viewMode: 'GRID' | 'LIST';
}
