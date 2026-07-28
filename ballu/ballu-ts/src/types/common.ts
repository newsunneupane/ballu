export interface NavLink {
  href: string;
  label: string;
}

export interface BrandFeature {
  title: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  suffix: string;
  tagline: string;
  description: string;
  goldRate: string;
  silverRate: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  social: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}
