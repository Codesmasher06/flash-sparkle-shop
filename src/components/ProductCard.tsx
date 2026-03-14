import { Product } from '@/store/types';
import { productImages } from '@/store/images';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const addToCart = useStore(s => s.addToCart);
  const image = productImages[product.id] || '/placeholder.svg';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('This product is out of stock!');
      return;
    }
    const success = addToCart(product);
    if (success) toast.success(`${product.name} added to cart!`);
    else toast.error('Could not add to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
          {product.isFlashSale && (
            <div className="absolute top-3 left-3 z-10 gradient-sale px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary-foreground" />
              <span className="text-[11px] font-bold text-primary-foreground">FLASH SALE</span>
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-3 right-3 z-10 bg-secondary px-2 py-1 rounded-full">
              <span className="text-[11px] font-bold text-secondary-foreground">{product.discount}% OFF</span>
            </div>
          )}

          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.subCategory}</p>
            <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-foreground">₹{product.price}</span>
                <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="p-2 rounded-full gradient-sale text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
            {product.stock <= 0 && (
              <p className="text-xs font-bold text-destructive mt-1">SOLD OUT</p>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs font-bold text-secondary mt-1">Only {product.stock} left!</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
