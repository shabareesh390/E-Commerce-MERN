import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axiosClient.get('/users/wishlist');
      setWishlist(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axiosClient.delete(`/users/wishlist/${id}`);
      setWishlist(wishlist.filter((item) => item._id !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        My Wishlist
      </h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Explore products and add them to your wishlist.</p>
          <Link to="/" className="inline-flex bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/product/${product._id}`} className="block">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-200 xl:aspect-w-7 xl:aspect-h-8">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mt-1 text-sm text-slate-700 line-clamp-2 h-10">{product.name}</h3>
                  <p className="mt-2 text-lg font-semibold text-slate-900">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
