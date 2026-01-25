export interface WalletState {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  canAddMore: boolean;
}

export interface ProductAvailability {
  productId: string;
  variantId: string;
  isEligible: boolean;
  isAffordable: boolean;
  isSelectable: boolean;
  blockingReason?: 'exceeds_budget' | 'out_of_stock' | 'wrong_pet_type' | 'not_eligible';
}

export interface MonthlyPlanDraft {
  id: string;
  userId: string;
  monthlyBudget?: number;
  petType?: string;
  selectedCategories?: string[];
  planStatus: string;
}

export interface BundleDraft {
  id: string;
  userId: string;
  bundleBudget?: number;
  petType?: string;
  selectedCategories?: string[];
}
