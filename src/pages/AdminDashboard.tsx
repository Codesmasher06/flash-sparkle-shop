import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { DeliveryStatus } from '@/store/types';
import { useState } from 'react';
import { toast } from 'sonner';

const statusOptions: DeliveryStatus[] = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const AdminDashboard = () => {
  const orders = useStore(s => s.orders);
  const products = useStore(s => s.products);
  const approveRefund = useStore(s => s.approveRefund);
  const rejectRefund = useStore(s => s.rejectRefund);
  const updateOrderStatus = useStore(s => s.updateOrderStatus);
  const updateStock = useStore(s => s.updateStock);
  const [tab, setTab] = useState<'orders' | 'inventory' | 'analytics'>('orders');

  const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const pendingRefunds = orders.filter(o => o.refundStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6">
          {(['orders', 'inventory', 'analytics'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t ? 'gradient-sale text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="font-display font-extrabold text-2xl text-foreground">₹{Math.round(totalRevenue)}</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="font-display font-extrabold text-2xl text-foreground">{totalOrders}</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Pending Refunds</p>
              <p className="font-display font-extrabold text-2xl text-primary">{pendingRefunds}</p>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-20">No orders yet</p>
            ) : (
              orders.slice().reverse().map(order => (
                <div key={order.id} className="bg-card rounded-xl p-6 shadow-card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold text-foreground">₹{Math.round(order.total)}</p>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <label className="text-xs text-muted-foreground">Status:</label>
                    <select
                      value={order.status}
                      onChange={e => {
                        updateOrderStatus(order.id, e.target.value as DeliveryStatus);
                        toast.success('Order status updated');
                      }}
                      className="text-sm bg-muted rounded-lg px-3 py-1.5 text-foreground border-none"
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {order.refundRequested && order.refundStatus === 'pending' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Refund requested</span>
                      <button
                        onClick={() => { approveRefund(order.id); toast.success('Refund approved'); }}
                        className="text-xs gradient-success text-primary-foreground px-3 py-1 rounded-full font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { rejectRefund(order.id); toast.info('Refund rejected'); }}
                        className="text-xs bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'inventory' && (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category} / {p.subCategory}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-destructive' : 'text-foreground'}`}>
                    Stock: {p.stock}
                  </span>
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={e => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val !== p.stock) {
                        updateStock(p.id, val);
                        toast.success(`Stock updated for ${p.name}`);
                      }
                    }}
                    className="w-20 bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground text-center border-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
