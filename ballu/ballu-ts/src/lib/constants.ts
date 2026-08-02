export const SITE = {
  name: 'Ballu',
  suffix: 'JEWELLERS',
  fullName: 'Ballu Jewellers',
  tagline: 'Heirlooms, made for a quieter wear.',
  description: 'Forty years on the same bench in Kakarvitta. Hallmarked gold, hand-finished silver, made-to-order bridal sets.',
  est: '1984',
  location: 'KAKARVITTA',
} as const;

export const COLORS = {
  gold: '#dbb86b',
  goldLight: '#f5e3b8',
  goldDark: '#c9a96e',
  cream: '#f4edd9',
  creamLight: '#fbf7f0',
  bgDark: '#0e0b08',
  bgDarker: '#0a0806',
  border: '#2b2415',
  textMuted: '#8e897e',
  textBody: '#e2d5c3',
  textLight: '#ebd3b4',
} as const;

export const NAV_LINKS = {
  left: [
    { href: '/', label: 'Home' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/personalize', label: 'Personalize' },
  ],
  right: [
    { href: '/bridal', label: 'Bridal' },
    { href: '/stories', label: 'Stories' },
    { href: '/visit', label: 'Visit' },
  ],
} as const;

export const PHONE = '+977 9842 000 000';
export const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/[^0-9]/g, '')}`;
