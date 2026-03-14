import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { productImages } from '@/store/images';
import { Star, ShoppingCart, Bell, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import CountdownTimer from '@/components/CountdownTimer';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useStore(s => s.products);
  const addToCart = useStore(s => s.addToCart);
  const notifyMe = useStore(s => s.notifyMe);
  const notifyMeProducts = useStore(s => s.notifyMeProducts);
  const flashSaleBuyerCount = useStore(s => s.flashSaleBuyerCount);
  const product = products.find(p => p.id === id);
  const [restockDate] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    </div>
  );

  const image = productImages[product.id] || '/placeholder.svg';
  const flashDiscountActive = product.isFlashSale && flashSaleBuyerCount < (product.flashDiscountLimit || 0);
  const spotsLeft = product.isFlashSale ? Math.max(0, (product.flashDiscountLimit || 0) - flashSaleBuyerCount) : 0;

  const handleBuy = () => {
    if (product.stock <= 0) {
      toast.error('This product is sold out!');
      return;
    }
    const success = addToCart(product);
    if (success) {
      toast.success('Added to cart!');
      navigate('/cart');
    } else {
      toast.error('Could not add to cart');
    }
  };

  const handleNotifyMe = () => {
    notifyMe(product.id);
    toast.success("We'll notify you when this product is back in stock!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-card rounded-2xl overflow-hidden shadow-card">
            <img src={image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category} / {product.subCategory}</p>
            <h1 className="font-display font-extrabold text-3xl text-foreground">{product.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-3xl text-foreground">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="gradient-sale px-3 py-1 rounded-full text-sm font-bold text-primary-foreground">
                {product.discount}% OFF
              </span>
            </div>

            {product.isFlashSale && flashDiscountActive && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-display font-bold text-foreground">Flash Sale Bonus!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  First {product.flashDiscountLimit} buyers get an extra {product.flashDiscountExtra}% off!
                  <span className="font-bold text-primary ml-1">{spotsLeft} spots left</span>
                </p>
              </div>
            )}

            {product.stock > 0 ? (
              <>
                <p className="text-sm">
                  <span className="text-muted-foreground">Stock: </span>
                  <span className={`font-bold ${product.stock <= 5 ? 'text-destructive' : 'text-foreground'}`}>
                    {product.stock} available
                  </span>
                </p>
                <button
                  onClick={handleBuy}
                  className="gradient-sale text-primary-foreground font-display font-bold py-3 px-6 rounded-full shadow-hero hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-destructive/10 px-6 py-3 rounded-lg text-center">
                  <span className="font-display font-bold text-xl text-destructive">SOLD OUT</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Restock expected in:</p>
                  <CountdownTimer targetDate={restockDate} label="Restocking in" />
                </div>
                {!notifyMeProducts.includes(product.id) ? (
                  <button
                    onClick={handleNotifyMe}
                    className="w-full border-2 border-primary text-primary font-display font-bold py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Bell className="h-5 w-5" />
                    Notify Me When Available
                  </button>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">✓ You'll be notified when back in stock</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
