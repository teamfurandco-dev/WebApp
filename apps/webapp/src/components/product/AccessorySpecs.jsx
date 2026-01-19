import { Palette, Ruler, Package } from 'lucide-react';

const AccessorySpecs = ({ product }) => {
  const { specifications } = product;
  
  // Extract accessory-specific specs from the specifications object
  const material = specifications?.material || 'High-Quality Material';
  const colors = specifications?.colors || ['Available in multiple colors'];
  const sizes = specifications?.sizes || ['One Size'];
  const careInstructions = specifications?.care_instructions || product.care_instructions || 'Easy to clean';
  const warranty = specifications?.warranty || product.warranty || '1 Year Warranty';
  const weight = specifications?.weight || 'Lightweight';

  const mainSpecs = [
    { label: 'Material', value: material, icon: Package },
    { label: 'Weight', value: weight, icon: Ruler },
    { label: 'Care Instructions', value: careInstructions, icon: Package },
    { label: 'Warranty', value: warranty, icon: Package }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
      <h3 className="font-bold text-xl mb-6">Product Specifications</h3>
      
      <div className="space-y-6">
        {/* Main Specifications */}
        <div className="grid md:grid-cols-2 gap-4">
          {mainSpecs.map((spec, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-furco-yellow/20 rounded-lg text-furco-brown">
                <spec.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-black/60 uppercase tracking-wider mb-1">
                  {spec.label}
                </h4>
                <p className="font-medium">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Color Variants */}
        {colors && colors.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-furco-brown" />
              <h4 className="font-semibold text-sm text-black/60 uppercase tracking-wider">
                Available Colors
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, i) => (
                <div key={i} className="px-4 py-2 bg-white border border-black/10 rounded-full text-sm font-medium">
                  {color}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Size Options */}
        {sizes && sizes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-furco-brown" />
              <h4 className="font-semibold text-sm text-black/60 uppercase tracking-wider">
                Available Sizes
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size, i) => (
                <div key={i} className="px-4 py-2 bg-white border border-black/10 rounded-full text-sm font-medium">
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {product.usage_instructions && (
        <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
          <h4 className="font-bold text-lg mb-3 text-green-800">
            Usage Instructions
          </h4>
          <p className="text-green-700 leading-relaxed">
            {product.usage_instructions}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessorySpecs;