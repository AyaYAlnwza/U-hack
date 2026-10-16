export const MARKETPLACE_CATEGORIES = ['AI', 'Environment', 'Health', 'Education', 'Community', 'Camp', 'Other'] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];
export type ContactMethod = 'email' | 'line';

export interface SaleListing {
  id: string;
  isBoosted?: boolean;
  title: string;
  category: MarketplaceCategory;
  summary: string;
  askingPrice: number | null;
  sellerName: string;
  contactMethod: ContactMethod;
  contactValue: string;
  createdAt: string;
}
