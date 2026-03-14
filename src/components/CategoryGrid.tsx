import { categories } from '@/store/products';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-display font-bold text-2xl text-foreground mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/category/${cat.name}`}
              className="block bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
            >
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.subcategories.map(sub => (
                  <Link
                    key={sub}
                    to={`/category/${cat.name}/${sub}`}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
