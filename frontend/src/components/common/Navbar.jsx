import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { ShoppingCart, User, LogOut, Package, Search, Heart } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import luxeCartLogo from '../../assets/LuxeCart.png';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

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
              <img src={luxeCartLogo} alt="LuxeCart" className="h-16 w-auto object-contain scale-[2.5] origin-left ml-6" />
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center px-4 lg:ml-6">
            <div className="max-w-lg w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <form onSubmit={handleSearch}>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="Search products..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link to="/wishlist" className="text-slate-500 hover:text-red-500 transition-colors" title="My Wishlist">
                <Heart className="h-6 w-6" />
              </Link>
            )}
            <Link to="/cart" className="text-slate-500 hover:text-slate-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                  Hi, {user.name}
                </Link>
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
