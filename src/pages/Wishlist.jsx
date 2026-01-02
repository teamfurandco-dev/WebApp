import { useEffect, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import { Loader2, Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistLoading) return;
      
      setLoading(true);
      try {
        // In a real app, you'd have an API endpoint to fetch multiple products by ID
        // For now, we'll fetch all and filter (inefficient but works for mock)
        const allProducts = await api.getProducts();
        const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Failed to fetch wishlist products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, wishlistLoading]);

  if (loading || wishlistLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-furco-yellow" />
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-screen bg-[#FDFBF7]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 rounded-full text-red-500">
            <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-4xl font-serif font-bold">My Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-black/5">
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground">Save items you love to find them easily later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="h-[400px]">
                <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
