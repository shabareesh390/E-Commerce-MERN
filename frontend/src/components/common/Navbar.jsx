import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
      logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                LuxeCart
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-slate-500 hover:text-slate-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-700">Hi, {user.name}</span>
                <Link to="/orders" className="text-slate-500 hover:text-indigo-600 transition-colors" title="My Orders">
                  <Package className="h-5 w-5" />
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
