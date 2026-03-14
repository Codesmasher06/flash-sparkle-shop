import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { productImages } from '@/store/images';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartPage = () => {
  const cart = useStore(s => s.cart);
  const updateQuantity = useStore(s => s.updateQuantity);
  const removeFromCart = useStore(s => s.removeFromCart);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const price = item.flashDiscount
      ? item.product.price * (1 - (item.product.flashDiscountExtra || 0) / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link to="/" className="gradient-sale text-primary-foreground font-bold px-6 py-3 rounded-full inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6">Shopping Cart ({cart.length})</h1>
        <div className="space-y-4">
          {cart.map(item => {
            const effectivePrice = item.flashDiscount
              ? item.product.price * (1 - (item.product.flashDiscountExtra || 0) / 100)
              : item.product.price;
            return (
              <motion.div
                key={item.product.id}
                layout
                className="bg-card rounded-xl p-4 shadow-card flex gap-4 items-center"
              >
                <img
                  src={productImages[item.product.id] || '/placeholder.svg'}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate">{item.product.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-foreground">₹{Math.round(effectivePrice)}</span>
                    {item.flashDiscount && (
                      <span className="text-xs text-primary font-bold">Flash Deal!</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full bg-muted hover:bg-primary/10">
                    <Minus className="h-4 w-4 text-foreground" />
                  </button>
                  <span className="font-bold text-foreground w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full bg-muted hover:bg-primary/10">
                    <Plus className="h-4 w-4 text-foreground" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 bg-card rounded-xl p-6 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display font-extrabold text-2xl text-foreground">₹{Math.round(total)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full gradient-sale text-primary-foreground font-display font-bold py-3 rounded-full shadow-hero hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
