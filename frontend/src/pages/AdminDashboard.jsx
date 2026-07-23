import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, Plus, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: 0, description: '', brand: '', stock: 0, category: '', image: '' });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        axiosClient.get('/stats'),
        axiosClient.get('/products'),
        axiosClient.get('/orders'),
        axiosClient.get('/categories')
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        brand: product.brand || '',
        stock: product.stock || 0,
        category: product.category?._id || '',
        image: product.images?.[0] || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: 0, description: '', brand: '', stock: 0, category: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, images: formData.image ? [formData.image] : [] };
      if (editingProduct) {
        await axiosClient.put(`/products/${editingProduct._id}`, payload);
      } else {
        await axiosClient.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
        fetchData(); // Refresh list
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <div className="mb-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Orders</dt>
                    <dd className="text-lg font-bold text-slate-900">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Products</dt>
                    <dd className="text-lg font-bold text-slate-900">{stats.totalProducts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-50 rounded-md p-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Users</dt>
                    <dd className="text-lg font-bold text-slate-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Manage Products</h3>
            <button onClick={() => openModal()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add Product
            </button>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
            <ul className="divide-y divide-slate-200">
              {products.map((product) => (
                <li key={product._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => openModal(product)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition">Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 text-sm font-medium transition">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">All Orders</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
            <ul className="divide-y divide-slate-200">
              {orders.map((order) => (
                <li key={order._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">Order #{order._id}</p>
                    <p className="text-sm text-slate-500 mt-1">User: {order.user?.name || 'Unknown User'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">${order.totalPrice?.toFixed(2)}</p>
                    <p className={`mt-1 text-xs px-2 py-1 inline-flex leading-5 font-semibold rounded-full ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                    <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500">
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                    <input type="text" required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500" placeholder="https://example.com/image.jpg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
