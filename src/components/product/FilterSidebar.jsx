import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-auto p-0 hover:text-primary">Clear All</Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'brand']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                 <Checkbox 
                    id="cat-all" 
                    checked={selectedCategory === 'All'}
                    onCheckedChange={() => onCategoryChange('All')}
                 />
                 <Label htmlFor="cat-all">All Products</Label>
              </div>
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat.id}`} 
                    checked={selectedCategory === cat.name}
                    onCheckedChange={() => onCategoryChange(cat.name)}
                  />
                  <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-2 space-y-4">
              <Slider 
                defaultValue={[0, 5000]} 
                max={5000} 
                step={100} 
                value={priceRange}
                onValueChange={onPriceChange}
              />
              <div className="flex items-center justify-between text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['Fur&Co', 'Whiskas', 'Pedigree', 'Royal Canin'].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand}`} />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
