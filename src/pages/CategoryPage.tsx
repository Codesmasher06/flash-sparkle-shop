import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';

const CategoryPage = () => {
  const { category, sub } = useParams();
  const getProductsByCategory = useStore(s => s.getProductsByCategory);
  const results = getProductsByCategory(category || '', sub);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-2">
          {sub || category}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">{results.length} products</p>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">No products in this category yet</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
