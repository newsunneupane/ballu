export interface Pricing {
  goldValue: string;
  wastage: string;
  making: string;
  discount: string;
}

export interface Product {
  id: string | number;
  tag: string | null;
  category: string;
  type: string;
  material: string;
  title: string;
  subTitle: string;
  karat: string;
  weight: string;
  price: string;
  description?: string;
  purity?: string;
  stones?: string;
  karigar?: string;
  pricing?: Pricing;
  images?: string[];
  _apiItem?: any;
}

export interface ProductFilters {
  categories: string[];
  material: string;
  viewMode: 'GRID' | 'LIST';
}
