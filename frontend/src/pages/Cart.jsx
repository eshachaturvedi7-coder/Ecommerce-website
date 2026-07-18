import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your cart');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity: newQuantity });
      setCart(data.cart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <Link to="/products" className="text-indigo-600 font-medium hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {item.product.images?.[0]?.url ? (
                <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No image</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
              <p className="text-indigo-600 font-medium">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemoveItem(item.product._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">Total: ₹{cart.totalAmount}</span>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;