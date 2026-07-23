import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import useAuthStore from '../store/useAuthStore';

const Home = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const categoryQuery = queryParams.get('category') || '';
  const minPriceQuery = queryParams.get('minPrice') || '';
  const maxPriceQuery = queryParams.get('maxPrice') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [minPrice, setMinPrice] = useState(minPriceQuery);
  const [maxPrice, setMaxPrice] = useState(maxPriceQuery);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosClient.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoryQuery) params.category = categoryQuery;
        if (minPriceQuery) params.minPrice = minPriceQuery;
        if (maxPriceQuery) params.maxPrice = maxPriceQuery;

        const { data } = await axiosClient.get('/products', { params });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, categoryQuery, minPriceQuery, maxPriceQuery]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    navigate(`/?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    navigate('/');
  };

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault(); // Prevent navigating to product detail
    if (!user) {
      toast.error('Please log in to add items to your wishlist');
      return;
    }
    try {
      await axiosClient.post('/users/wishlist', { productId });
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Filters</h2>
            <form onSubmit={handleFilterSubmit}>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Category</h3>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition">
                  Apply
                </button>
                <button type="button" onClick={handleClearFilters} className="w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 text-sm font-medium transition">
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <p className="text-lg text-slate-500">No products found matching your criteria.</p>
              <button onClick={handleClearFilters} className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-200 xl:aspect-w-7 xl:aspect-h-8 relative">
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
                    <button 
                      onClick={(e) => handleAddToWishlist(e, product._id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-50 shadow-md transition-all z-10"
                      title="Add to Wishlist"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="mt-1 text-sm text-slate-700 line-clamp-2 h-10">{product.name}</h3>
                    <p className="mt-2 text-lg font-semibold text-slate-900">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
