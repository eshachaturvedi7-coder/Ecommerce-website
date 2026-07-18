import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Sparkles, Headphones, ArrowRight, Heart } from 'lucide-react';
import api from '../utils/api';

const categories = [
  { name: 'Electronics', emoji: '🎧' },
  { name: 'Footwear', emoji: '👟' },
  { name: 'Fashion', emoji: '👕' },
  { name: 'Home', emoji: '🏠' },
  { name: 'Beauty', emoji: '💄' },
  { name: 'Sports', emoji: '⚽' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products.slice(0, 8));
      } catch (error) {
        console.log('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-ink min-h-screen font-body">
      {/* Marquee Strip */}
      <div className="bg-accent text-ink overflow-hidden py-2.5 border-b border-ink/10">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {['BIG FASHION SALE', 'UP TO 50% OFF', 'NEW ARRIVALS DAILY', 'FREE SHIPPING'].map((text, j) => (
                <span key={j} className="text-xs font-bold tracking-widest mx-6 flex items-center gap-6">
                  {text} <span className="text-ink/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-4">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-stretch">
          {/* Left: Big typographic statement */}
          <div className="relative bg-surface rounded-3xl border border-white/5 px-8 sm:px-12 py-12 sm:py-16 flex flex-col justify-center overflow-hidden">
            <span className="text-muted text-xs font-bold tracking-[0.3em] uppercase mb-6">
              Season Drop — 2026
            </span>
            <h1 className="font-display font-bold text-cream leading-[0.95] text-5xl sm:text-6xl lg:text-7xl mb-6">
              STYLE
              <br />
              WITHOUT
              <br />
              <span className="text-accent">LIMITS.</span>
            </h1>
            <p className="text-muted max-w-sm mb-8">
              Redefine your everyday style with our curated collection — up to 50% off, for a limited time only.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-accent text-ink px-8 py-3.5 rounded-full font-bold w-fit hover:brightness-110 transition-all"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <span className="absolute -bottom-10 -right-6 font-display font-bold text-[120px] text-white/[0.03] leading-none select-none pointer-events-none">
              SALE
            </span>
          </div>

          {/* Right: Stat block + accent panel */}
          <div className="flex flex-col gap-6">
            <div className="bg-accent rounded-3xl flex-1 flex flex-col justify-center px-8 py-10">
              <span className="font-display font-bold text-ink text-6xl leading-none">50%</span>
              <span className="text-ink font-bold text-sm tracking-wide mt-2">MAX DISCOUNT</span>
            </div>
            <div className="bg-surface rounded-3xl border border-white/5 flex-1 flex flex-col justify-center px-8 py-10">
              <span className="font-display font-bold text-cream text-6xl leading-none">6</span>
              <span className="text-muted font-semibold text-sm tracking-wide mt-2">CURATED CATEGORIES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="shrink-0 flex flex-col items-center gap-2 bg-surface border border-white/5 rounded-2xl px-6 py-4 hover:border-accent/50 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-cream">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, label: 'Fast Delivery' },
          { icon: ShieldCheck, label: 'Secure Payments' },
          { icon: Sparkles, label: 'Quality Products' },
          { icon: Headphones, label: '24/7 Support' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="bg-surface rounded-2xl p-5 flex flex-col items-center gap-2 border border-white/5">
            <div className="bg-surface-light p-3 rounded-full">
              <Icon className="text-accent" size={22} strokeWidth={1.8} />
            </div>
            <p className="text-sm font-semibold text-muted text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">Trending Now</h2>
            <p className="text-muted text-sm mt-1">Handpicked products just for you</p>
          </div>
          <Link to="/products" className="text-accent font-semibold text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-muted text-center py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted text-center py-10">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
           {products.map((product, index) => {
              const hasDiscount = product.discountPrice > 0;
              const discountPercent = hasDiscount
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;

              return (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="group bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-accent/50 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
                >
                  <div className="relative h-44 sm:h-52 bg-surface-light flex items-center justify-center overflow-hidden">
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-accent text-ink text-xs font-bold px-2.5 py-1 rounded-full z-10">
                        -{discountPercent}%
                      </span>
                    )}
                    <button className="absolute top-3 right-3 bg-ink/60 backdrop-blur w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={14} className="text-cream" />
                    </button>
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-muted text-sm">No image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted font-medium uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-cream truncate mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-accent">₹{product.discountPrice}</span>
                          <span className="text-sm text-muted line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-cream">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;