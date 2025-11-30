import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow border-border/50">
      <div className="relative aspect-square overflow-hidden bg-secondary/20">
        {product.isNew && (
          <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground hover:bg-primary">New</Badge>
        )}
        {product.isBestSeller && !product.isNew && (
          <Badge className="absolute top-2 left-2 z-10 bg-furco-gold text-white hover:bg-furco-gold">Best Seller</Badge>
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">{product.category}</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
          </div>
        </div>
        <Link to={`/product/${product.id}`} className="group-hover:underline">
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 bg-furco-black text-white hover:bg-furco-brown-dark">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
