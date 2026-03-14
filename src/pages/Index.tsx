import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';

const Index = () => {
  const products = useStore(s => s.products);
  const trending = products.filter(p => p.rating >= 4.5);
  const deals = products.filter(p => p.discount >= 40);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <CategoryGrid />

      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">🔥 Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">⚡ Featured Deals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 pb-16">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">💫 Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display font-semibold text-foreground mb-2">FlashDrop</p>
          <p>© 2026 FlashDrop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
