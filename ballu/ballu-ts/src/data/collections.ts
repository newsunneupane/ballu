export interface CategoryConfig {
  nepaliTitle: string;
  englishTitle: string;
  glowStyle: string;
  borderColor: string;
}

export interface CategoryPageConfig {
  slug: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
}

export const categorySlugMap: Record<string, string> = {
  BRIDAL: 'bridal',
  FESTIVE: 'festive',
  'DAILY WEAR': 'daily-wear',
  ENGAGEMENT: 'engagement',
  OFFICE: 'office',
  GIFT: 'gift',
  OTHERS: 'others',
};

export const categoryFromSlug: Record<string, string> = {};
for (const [cat, slug] of Object.entries(categorySlugMap)) {
  categoryFromSlug[slug] = cat;
}

export const categoryPageConfig: Record<string, CategoryPageConfig> = {
  BRIDAL: {
    slug: 'bridal',
    title: 'Bridal Heritage.',
    subtitle: 'बेहुलीको शृङ्गार',
    breadcrumb: 'Home · Bridal',
  },
  FESTIVE: {
    slug: 'festive',
    title: 'The Festive Edit.',
    subtitle: 'चाडपर्वको सङ्ग्रह',
    breadcrumb: 'Home · Festive',
  },
  'DAILY WEAR': {
    slug: 'daily-wear',
    title: 'Daily Essentials.',
    subtitle: 'दैनिकको सङ्ग्रह',
    breadcrumb: 'Home · Daily Wear',
  },
  ENGAGEMENT: {
    slug: 'engagement',
    title: 'The Proposal.',
    subtitle: 'सगाईको सङ्ग्रह',
    breadcrumb: 'Home · Engagement',
  },
  OFFICE: {
    slug: 'office',
    title: 'The Desk Edit.',
    subtitle: 'कार्यालयको सङ्ग्रह',
    breadcrumb: 'Home · Office',
  },
  GIFT: {
    slug: 'gift',
    title: 'The Giving.',
    subtitle: 'उपहारको सङ्ग्रह',
    breadcrumb: 'Home · Gift',
  },
  OTHERS: {
    slug: 'others',
    title: 'Other Designs.',
    subtitle: 'अन्य डिजाइनहरू',
    breadcrumb: 'Home · Others',
  },
};

export const categoryConfigMap: Record<string, CategoryConfig> = {
  BRIDAL: {
    nepaliTitle: 'विवाह',
    englishTitle: 'Bridal Heritage',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(213,165,96,0.22) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#d5a560]/10',
  },
  FESTIVE: {
    nepaliTitle: 'पर्व',
    englishTitle: 'Festive Core',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(197,143,77,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#c58f4d]/10',
  },
  'DAILY WEAR': {
    nepaliTitle: 'दैनिक',
    englishTitle: 'Daily Wear',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(200,190,175,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#c8beaf]/10',
  },
  ENGAGEMENT: {
    nepaliTitle: 'सगाई',
    englishTitle: 'Engagement',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(255,215,175,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#ffd7af]/10',
  },
  OFFICE: {
    nepaliTitle: 'कार्यालय',
    englishTitle: 'Office Edit',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(180,190,200,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#b4bec8]/10',
  },
  GIFT: {
    nepaliTitle: 'उपहार',
    englishTitle: 'Gift Edit',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(235,195,145,0.2) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#ebc391]/10',
  },
  OTHERS: {
    nepaliTitle: 'अन्य',
    englishTitle: 'Other Designs',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(160,160,160,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#a0a0a0]/10',
  },
};
