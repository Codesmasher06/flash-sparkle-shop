import { useStore } from '@/store/useStore';
import { productImages } from '@/store/images';
import CountdownTimer from './CountdownTimer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroBanner = () => {
  const products = useStore(s => s.products);
  const flashProduct = products.find(p => p.isFlashSale);
  const [saleStarted, setSaleStarted] = useState(true); // demo: sale is live

  // For demo, sale starts "now" so it's always live
  const saleDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hrs from now for countdown demo

  if (!flashProduct) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div
        className="relative min-h-[400px] md:min-h-[500px] flex items-center"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-85" />
        <div className="relative z-10 container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 gradient-sale px-4 py-1.5 rounded-full mb-4">
                <Zap className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground animate-pulse-sale">MIDNIGHT DROP</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight mb-4">
                {flashProduct.name}
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-4 max-w-lg">{flashProduct.description}</p>
              <div className="flex items-baseline gap-3 justify-center md:justify-start mb-6">
                <span className="font-display font-extrabold text-3xl text-primary-foreground">₹{flashProduct.price}</span>
                <span className="text-lg text-primary-foreground/60 line-through">₹{flashProduct.originalPrice}</span>
                <span className="gradient-sale px-3 py-1 rounded-full text-sm font-bold text-primary-foreground">
                  {flashProduct.discount}% OFF
                </span>
              </div>

              {flashProduct.stock > 0 ? (
                <>
                  <div className="mb-6">
                    <CountdownTimer targetDate={saleDate} onComplete={() => setSaleStarted(true)} label="Sale ends in" />
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <span className="text-sm text-primary-foreground/80">Only</span>
                    <span className="font-display font-bold text-2xl text-primary-foreground">{flashProduct.stock}</span>
                    <span className="text-sm text-primary-foreground/80">left in stock</span>
                  </div>
                  <Link
                    to={`/product/${flashProduct.id}`}
                    className="inline-block gradient-sale px-8 py-3 rounded-full font-display font-bold text-primary-foreground shadow-hero hover:opacity-90 transition-opacity"
                  >
                    Buy Now →
                  </Link>
                </>
              ) : (
                <div className="bg-destructive/20 px-6 py-3 rounded-lg inline-block">
                  <span className="font-display font-bold text-xl text-destructive">SOLD OUT</span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-hero"
          >
            <img
              src={productImages[flashProduct.id]}
              alt={flashProduct.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
