import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bone, RotateCcw } from 'lucide-react';
import { cn } from '@fur-co/utils';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, isMobile = false }) => {
  return (
    <div className={cn(
      "bg-[#FDFBF7]",
      !isMobile && "p-6 rounded-[2rem] border border-black/5 sticky top-32 shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-peace-sans font-bold text-black">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-auto p-0 hover:text-furco-yellow hover:bg-transparent transition-colors font-medium gap-1"
          onClick={() => {
            onCategoryChange('All');
            onPriceChange([0, 5000]);
          }}
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'brand']} className="w-full space-y-4">

        {/* Category Filter */}
        <AccordionItem value="category" className="border-b border-black/5">
          <AccordionTrigger className="text-lg font-bold text-black hover:text-furco-gold hover:no-underline py-4">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 pb-4">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox
                  id="cat-all"
                  checked={selectedCategory === 'All'}
                  onCheckedChange={() => onCategoryChange('All')}
                  className="border-black/20 data-[state=checked]:bg-furco-yellow data-[state=checked]:text-black data-[state=checked]:border-furco-yellow rounded-md w-5 h-5 transition-all duration-300"
                />
                <Label htmlFor="cat-all" className="text-base font-medium text-black/80 group-hover:text-black cursor-pointer flex items-center gap-2">
                  All Products
                </Label>
              </div>
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-3 group cursor-pointer">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCategory === cat.name}
                    onCheckedChange={() => onCategoryChange(cat.name)}
                    className="border-black/20 data-[state=checked]:bg-furco-yellow data-[state=checked]:text-black data-[state=checked]:border-furco-yellow rounded-md w-5 h-5 transition-all duration-300"
                  />
                  <Label htmlFor={`cat-${cat.id}`} className="text-base font-medium text-black/80 group-hover:text-black cursor-pointer flex items-center gap-2">
                    {cat.name.toLowerCase().includes('dog') ? <Dog className="w-4 h-4 text-furco-gold" /> :
                      cat.name.toLowerCase().includes('cat') ? <Cat className="w-4 h-4 text-furco-gold" /> :
                        <Bone className="w-4 h-4 text-furco-gold" />}
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-b border-black/5">
          <AccordionTrigger className="text-lg font-bold text-black hover:text-furco-gold hover:no-underline py-4">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 px-2 pb-6 space-y-6">
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={onPriceChange}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between text-sm font-bold text-black">
                <span className="bg-white px-3 py-1 rounded-full border border-black/10">₹{priceRange[0]}</span>
                <span className="bg-white px-3 py-1 rounded-full border border-black/10">₹{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand" className="border-none">
          <AccordionTrigger className="text-lg font-bold text-black hover:text-furco-gold hover:no-underline py-4">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {['Fur&Co', 'Whiskas', 'Pedigree', 'Royal Canin'].map((brand) => (
                <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
                  <Checkbox
                    id={`brand-${brand}`}
                    className="border-black/20 data-[state=checked]:bg-furco-yellow data-[state=checked]:text-black data-[state=checked]:border-furco-yellow rounded-md w-5 h-5 transition-all duration-300"
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-base font-medium text-black/80 group-hover:text-black cursor-pointer">{brand}</Label>
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
