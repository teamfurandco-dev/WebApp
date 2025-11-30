import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, Minus, Plus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        if (data && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].options[0]);
        }
        
        // Fetch related products (mock logic: same category)
        const allProducts = await api.getProducts({ category: data?.category });
        setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="container py-12 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-12 text-center">Product not found</div>;
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-secondary/20">
             <img 
               src={product.images[activeImage]} 
               alt={product.name} 
               className="h-full w-full object-cover"
             />
             {product.isNew && <Badge className="absolute top-4 left-4">New</Badge>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-auto pb-2">
              {product.images.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square w-20 flex-none rounded-lg overflow-hidden border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-furco-black">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">{product.brand}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
            {product.originalPrice > product.price && (
              <Badge variant="destructive">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator />

          {/* Variants */}
          {product.variants.map((variant) => (
            <div key={variant.type} className="space-y-3">
              <Label className="text-base">{variant.type}</Label>
              <RadioGroup 
                value={selectedVariant} 
                onValueChange={setSelectedVariant}
                className="flex flex-wrap gap-3"
              >
                {variant.options.map((option) => (
                  <div key={option}>
                    <RadioGroupItem value={option} id={option} className="peer sr-only" />
                    <Label
                      htmlFor={option}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer min-w-[3rem]"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center border rounded-md w-fit">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button size="lg" className="flex-1 gap-2 bg-furco-black text-white hover:bg-furco-brown-dark" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>

            <Button variant="outline" size="icon" className="h-11 w-11">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Delivery Info Mock */}
          <div className="bg-secondary/30 p-4 rounded-lg text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Free Delivery</span>
              <span className="text-muted-foreground">on orders above ₹499</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Easy Returns</span>
              <span className="text-muted-foreground">7-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Description</TabsTrigger>
          <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Ingredients</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Reviews ({product.reviewsCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none text-muted-foreground">
            <p>{product.description}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </TabsContent>
        <TabsContent value="ingredients" className="pt-6">
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Real Chicken</li>
            <li>Whole Grain Rice</li>
            <li>Vegetables (Carrots, Peas)</li>
            <li>Essential Vitamins & Minerals</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="font-semibold">Great Product!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Reviewed by User on Oct 12, 2023</p>
                <p className="text-foreground">My dog absolutely loves this food. His coat is shinier and he has so much energy.</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
