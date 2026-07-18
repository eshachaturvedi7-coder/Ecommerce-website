import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-20 text-gray-500">You haven't placed any orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {order.paymentMethod} • {order.isPaid ? 'Paid' : 'Not Paid'}
              </span>
              <span className="font-bold text-gray-800">Total: ₹{order.totalPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;