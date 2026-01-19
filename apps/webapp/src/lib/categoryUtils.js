/**
 * Utility function to determine category type based on category name
 * Maps category names to one of three types: Food, Toys, Accessories
 */
export const getCategoryType = (categoryName) => {
  if (!categoryName) return 'Accessories';
  
  const category = categoryName.toLowerCase();
  
  // Food categories
  if (category.includes('food') || 
      category.includes('treat') || 
      category.includes('nutrition') ||
      category.includes('supplement') ||
      category.includes('snack') ||
      category.includes('meal')) {
    return 'Food';
  }
  
  // Toy categories
  if (category.includes('toy') || 
      category.includes('play') || 
      category.includes('ball') ||
      category.includes('rope') ||
      category.includes('chew') ||
      category.includes('puzzle') ||
      category.includes('interactive')) {
    return 'Toys';
  }
  
  // Everything else is considered Accessories
  return 'Accessories';
};