import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[150px] w-full rounded-xl" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4 md:px-6 py-12 bg-furco-cream/30 rounded-3xl my-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-furco-black">Shop by Category</h2>
        <p className="text-muted-foreground mt-2">Find exactly what your pet needs.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/products?category=${category.name}`} className="group">
            <Card className="border-none shadow-none bg-transparent hover:bg-white transition-colors duration-300">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg text-furco-brown-dark group-hover:text-primary transition-colors">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
