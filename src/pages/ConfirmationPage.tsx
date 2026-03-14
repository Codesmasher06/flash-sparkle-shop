import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfirmationPage = () => {
  const { orderId } = useParams();
  const orders = useStore(s => s.orders);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-8 shadow-card text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-success mx-auto flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">Your order has been placed successfully</p>

          <div className="text-left space-y-3 bg-muted rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-foreground">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-semibold text-foreground capitalize">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold text-foreground capitalize">{order.paymentMethod}</span>
            </div>
            {order.items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.product.name}</span>
                <span className="font-semibold text-foreground">× {item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-border pt-2">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-foreground">₹{Math.round(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-semibold text-foreground">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/dashboard" className="flex-1 border-2 border-primary text-primary font-bold py-2.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              View Orders
            </Link>
            <Link to="/" className="flex-1 gradient-sale text-primary-foreground font-bold py-2.5 rounded-full text-sm">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
