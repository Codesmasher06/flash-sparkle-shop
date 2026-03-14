import Navbar from '@/components/Navbar';
import DeliveryTimeline from '@/components/DeliveryTimeline';
import { useStore } from '@/store/useStore';
import { productImages } from '@/store/images';
import { toast } from 'sonner';

const CustomerDashboard = () => {
  const orders = useStore(s => s.orders);
  const requestRefund = useStore(s => s.requestRefund);

  const handleRefund = (orderId: string) => {
    requestRefund(orderId);
    toast.success('Refund request submitted');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.slice().reverse().map(order => (
              <div key={order.id} className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-display font-bold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{Math.round(order.total)}</p>
                    <p className={`text-xs font-semibold ${order.paymentStatus === 'refunded' ? 'text-secondary' : 'text-foreground'}`}>
                      {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={productImages[item.product.id] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Delivery Status</p>
                  <DeliveryTimeline status={order.status} />
                </div>

                {order.paymentStatus !== 'refunded' && (
                  <div>
                    {!order.refundRequested ? (
                      <button
                        onClick={() => handleRefund(order.id)}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        Request Refund
                      </button>
                    ) : (
                      <p className="text-xs font-semibold">
                        Refund: <span className={
                          order.refundStatus === 'approved' ? 'text-secondary' :
                          order.refundStatus === 'rejected' ? 'text-destructive' :
                          'text-muted-foreground'
                        }>{order.refundStatus?.toUpperCase()}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
