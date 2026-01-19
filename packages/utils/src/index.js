import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents) {
  if (cents === null || cents === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(cents / 100);
}

export const getCategoryType = (categoryName) => {
  if (!categoryName) return 'Accessories';
  
  const category = categoryName.toLowerCase();
  
  if (category.includes('food') || category.includes('treat') || category.includes('nutrition') ||
      category.includes('supplement') || category.includes('snack') || category.includes('meal')) {
    return 'Food';
  }
  
  if (category.includes('toy') || category.includes('play') || category.includes('ball') ||
      category.includes('rope') || category.includes('chew') || category.includes('puzzle') ||
      category.includes('interactive')) {
    return 'Toys';
  }
  
  return 'Accessories';
};
