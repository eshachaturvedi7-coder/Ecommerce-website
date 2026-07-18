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
    <nav className="bg-ink sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold text-cream">
            <span className="bg-accent text-ink w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">SE</span>
            ShopEase
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-surface rounded-full px-4 py-2 w-80 border border-white/5">
            <Search size={16} className="text-muted" />
            <span className="text-sm text-muted">Search products...</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-muted hover:text-accent font-medium text-sm transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-muted hover:text-accent font-medium text-sm transition-colors">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-5">
            <Link to="/cart" className="text-cream hover:text-accent transition-colors">
              <ShoppingCart size={22} strokeWidth={1.8} />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold text-ink bg-accent px-3 py-1.5 rounded-full">
                    ADMIN
                  </Link>
                )}
                <Link to="/orders" className="text-cream hover:text-accent flex items-center gap-1 transition-colors">
                  <User size={20} strokeWidth={1.8} />
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-muted hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-accent text-ink px-6 py-2.5 rounded-full hover:brightness-110 text-sm font-bold transition-all"
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