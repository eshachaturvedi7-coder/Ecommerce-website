import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

      {/* Category filter pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setSearchParams({})}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            !selectedCategory ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const hasDiscount = product.discountPrice > 0;
            return (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}>
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-bold text-indigo-600">₹{product.discountPrice}</span>
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;