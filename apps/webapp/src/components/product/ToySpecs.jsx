import { Shield, Wrench, Baby } from 'lucide-react';

const ToySpecs = ({ product }) => {
  const { specifications } = product;
  
  // Extract toy-specific specs from the specifications object
  const material = specifications?.material || 'Premium Quality Material';
  const durabilityLevel = specifications?.durability_level || 'High';
  const safetyRating = specifications?.safety_rating || 'Pet Safe';
  const ageGroup = specifications?.age_group || 'All Ages';
  const dimensions = specifications?.dimensions || 'Standard Size';
  const weight = specifications?.weight || 'Lightweight';

  const specs = [
    { label: 'Material', value: material, icon: Wrench },
    { label: 'Durability Level', value: durabilityLevel, icon: Shield },
    { label: 'Safety Rating', value: safetyRating, icon: Baby },
    { label: 'Suitable Age', value: ageGroup, icon: Baby },
    { label: 'Dimensions', value: dimensions, icon: Wrench },
    { label: 'Weight', value: weight, icon: Wrench }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
      <h3 className="font-bold text-xl mb-6">Product Specifications</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {specs.map((spec, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-furco-yellow/20 rounded-lg text-furco-brown">
              <spec.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-black/60 uppercase tracking-wider mb-1">
                {spec.label}
              </h4>
              <p className="font-medium text-lg">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {product.safety_notes && product.safety_notes.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800">
            <Shield className="w-5 h-5" />
            Safety Information
          </h4>
          <ul className="space-y-2 text-blue-700">
            {product.safety_notes.map((note, i) => (
              <li key={i} className="text-sm">• {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ToySpecs;