import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="bg-gray-900 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm">SE</span>
            ShopEase
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-gray-50 rounded-full px-4 py-2 w-80 border border-gray-100">
            <Search size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Search products...</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-5">
            <Link to="/cart" className="text-gray-700 hover:text-gray-900 transition-colors">
              <ShoppingCart size={22} strokeWidth={1.8} />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold text-white bg-gray-900 px-3 py-1.5 rounded-full">
                    ADMIN
                  </Link>
                )}
                <Link to="/orders" className="text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  <User size={20} strokeWidth={1.8} />
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 text-sm font-semibold transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;