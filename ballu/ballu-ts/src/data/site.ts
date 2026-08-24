import { SiteConfig, BrandFeature } from '@/types/common';

export const siteConfig: SiteConfig = {
  name: 'Balu',
  suffix: 'JEWELLERS',
  tagline: 'Heirlooms, made for a quieter wear.',
  description: 'Forty years on the same bench in Kakarvitta. Hallmarked gold, hand-finished silver, made-to-order bridal sets.',
  goldRate: '₨ 14,260/G',
  silverRate: '₨ 175/G',
  phone: '+977 9842 000 000',
  email: 'aalu@balujewellers.np',
  address: 'मुख्य बजार · काँकडभिट्टा · झापा',
  hours: 'Mon–Sat 10–7 · Sun 11–5',
  social: {
    instagram: 'https://www.instagram.com/balujewellerykakarvitta/',
    facebook: '#',
    whatsapp: 'https://wa.me/+9779842000000',
  },
};

export const brandFeatures: BrandFeature[] = [
  { title: 'BIS', description: 'HALLMARKED GOLD, EVERY PIECE' },
  { title: 'Buyback', description: "LIFETIME · TODAY's RATE" },
  { title: 'Care', description: 'FREE ANNUAL DEEP-CLEAN' },
  { title: 'Personalize', description: 'SKETCH IN 2 WORKING DAYS' },
];

export const PIECE_TYPES = [
  'BRIDAL SET',
  'NECKLACE',
  'EARRINGS',
  'RING',
  'BANGLES',
  'REMODEL',
  'OTHER',
] as const;

export const BUDGET_RANGE = {
  min: 50000,
  max: 2000000,
  step: 10000,
} as const;
