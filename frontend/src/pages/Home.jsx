import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Sparkles, Headphones, ArrowRight } from 'lucide-react';
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-orange-50 rounded-3xl overflow-hidden relative">
          <div className="grid md:grid-cols-2 items-center gap-8 px-8 sm:px-14 py-14">
            <div>
              <span className="inline-block bg-white text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 shadow-sm">
                ✨ Big Fashion Sale
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Limited Time Offer!<br />
                <span className="text-orange-500">Up to 50% OFF</span>
              </h1>
              <p className="text-gray-500 mb-8">
                Redefine your everyday style with our curated collection.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="w-64 h-64 bg-orange-200 rounded-full flex items-center justify-center text-7xl">
                🛍️
              </div>
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
              className="shrink-0 flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 hover:shadow-md hover:border-gray-200 transition-all"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
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
          <div key={label} className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 border border-gray-100">
            <div className="bg-gray-50 p-3 rounded-full">
              <Icon className="text-gray-700" size={22} strokeWidth={1.8} />
            </div>
            <p className="text-sm font-semibold text-gray-600 text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-400 text-sm mt-1">Handpicked products just for you</p>
          </div>
          <Link to="/products" className="text-gray-900 font-semibold text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No products available yet.</p>
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
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
                >
                  <div className="relative h-44 sm:h-52 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                        -{discountPercent}%
                      </span>
                    )}
                    <button className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      ♡
                    </button>
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">No image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-gray-800 truncate mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">₹{product.discountPrice}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
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