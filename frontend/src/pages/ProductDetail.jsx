import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await api.post('/cart', { productId: product._id, quantity });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center overflow-hidden">
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

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category} • {product.brand}</p>

          <div className="flex items-center gap-3 mb-4">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-3xl font-bold text-indigo-600">₹{product.discountPrice}</span>
                <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-indigo-600">₹{product.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;