import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, Plus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        axiosClient.get('/stats'),
        axiosClient.get('/products'),
        axiosClient.get('/orders')
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
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
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition">Edit</button>
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
                    <p className="text-sm font-bold text-slate-900">${order.totalPrice.toFixed(2)}</p>
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
    </div>
  );
};

export default AdminDashboard;
