import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Bell, Zap } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const cart = useStore(s => s.cart);
  const notifications = useStore(s => s.notifications);
  const markNotificationRead = useStore(s => s.markNotificationRead);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-xl text-foreground">FlashDrop</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-sale text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-border font-display font-semibold text-sm">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      notifications.slice().reverse().map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 border-b border-border text-sm cursor-pointer hover:bg-muted transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                        >
                          {n.message}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/dashboard" className="p-2 rounded-full hover:bg-muted transition-colors">
            <User className="h-5 w-5 text-foreground" />
          </Link>

          <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-sale text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
