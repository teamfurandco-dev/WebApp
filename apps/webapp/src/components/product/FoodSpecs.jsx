import { Check } from 'lucide-react';

const FoodSpecs = ({ product }) => {
  const { nutritional_info, ingredients } = product;

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
      {nutritional_info && nutritional_info.length > 0 ? (
        <div>
          <h3 className="font-bold text-xl mb-6">Nutritional Information</h3>
          <div className="overflow-hidden rounded-xl border border-black/10">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-black/60">Nutrient</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-black/60">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {nutritional_info.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium">{item.nutrient}</td>
                    <td className="p-4 text-muted-foreground">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {ingredients && ingredients.length > 0 && (
        <div className={nutritional_info?.length > 0 ? "mt-8" : ""}>
          <h3 className="font-bold text-xl mb-4">Ingredients</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {ingredients.map((ingredient, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Check className="w-4 h-4 text-furco-yellow flex-shrink-0" />
                <span className="font-medium text-sm">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!nutritional_info || nutritional_info.length === 0) && (!ingredients || ingredients.length === 0) && (
        <p className="text-muted-foreground text-center py-8">
          Detailed nutritional information will be available soon.
        </p>
      )}
    </div>
  );
};

export default FoodSpecs;