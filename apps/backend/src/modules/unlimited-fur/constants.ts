export const BUDGET_TIERS = [
  { value: 100000, label: '₹1,000', description: '2-3 essential items' },
  { value: 200000, label: '₹2,000', description: '4-6 quality products' },
  { value: 300000, label: '₹3,000', description: '6-8 premium items' },
  { value: 500000, label: '₹5,000', description: '10+ complete care' },
];

export const MIN_BUDGET = 50000; // ₹500 in cents
export const BUNDLE_MIN_PRODUCTS = 3;
export const BUNDLE_DISCOUNT_RATE = 0.15; // 15%

export const PET_TYPES = ['cat', 'dog'] as const;
export const PLAN_STATUSES = ['draft', 'active', 'paused', 'cancelled'] as const;
export const ORDER_STATUSES = ['pending', 'confirmed', 'skipped', 'failed'] as const;

export const CATEGORIES = [
  'food',
  'toys',
  'accessories',
  'grooming',
  'health',
] as const;
