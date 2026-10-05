export type ProductCategory = 'general' | 'serum' | 'equipment';

export interface Product {
  id: number | string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  inStock?: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export interface SiteContent {
  siteTitle: string;
  siteSubtitle: string;
  topNote: string;
  phone: string;
  telegramPhone: string;
  hours: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroImg: string;
  catTitle: string;
  catSubtitle: string;
  footerBrand: string;
  footerAbout: string;
  footerAddress: string;
}
