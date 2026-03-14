import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const cart = useStore(s => s.cart);
  const placeOrder = useStore(s => s.placeOrder);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  const total = cart.reduce((sum, item) => {
    const price = item.flashDiscount
      ? item.product.price * (1 - (item.product.flashDiscountExtra || 0) / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    const order = placeOrder(paymentMethod);
    if (order) {
      navigate(`/confirmation/${order.id}`);
    } else {
      toast.error('Order failed — item may be sold out!');
    }
  };

  const methods = [
    { id: 'phonepe', label: 'PhonePe', icon: '📱' },
    { id: 'googlepay', label: 'Google Pay', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6">Checkout</h1>

        <div className="bg-card rounded-xl p-6 shadow-card mb-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-foreground">{item.product.name} × {item.quantity}</span>
              <span className="font-semibold text-foreground">
                ₹{Math.round((item.flashDiscount ? item.product.price * (1 - (item.product.flashDiscountExtra || 0) / 100) : item.product.price) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-2">
            <span className="font-display font-bold text-foreground">Total</span>
            <span className="font-display font-extrabold text-xl text-foreground">₹{Math.round(total)}</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card mb-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Payment Method</h2>
          <div className="space-y-3">
            {methods.map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="font-semibold text-foreground">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!paymentMethod}
          className="w-full gradient-sale text-primary-foreground font-display font-bold py-3 rounded-full shadow-hero hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Pay ₹{Math.round(total)}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
