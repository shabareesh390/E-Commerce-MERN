import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosClient.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !order) return (
    <div className="text-center mt-20 text-xl text-red-500 bg-red-50 p-6 rounded-lg max-w-2xl mx-auto border border-red-200">
      {error || 'Order not found'}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Order Details</h1>
      
      <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-slate-200 mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-slate-900">Order #{order._id}</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {order.isPaid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        <div className="border-t border-slate-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-slate-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500">Shipping Address</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500">Payment Method</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{order.paymentMethod}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500">Items ({order.orderItems.length})</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-slate-200 rounded-md divide-y divide-slate-200">
                  {order.orderItems.map((item) => (
                    <li key={item._id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Link to={`/product/${item.product}`} className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                          {item.name}
                        </Link>
                        <span className="ml-2 text-slate-500">x {item.qty}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-slate-50">
              <dt className="text-base font-bold text-slate-900">Total Price</dt>
              <dd className="mt-1 text-base font-bold text-indigo-600 sm:mt-0 sm:col-span-2">
                ${order.totalPrice.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          &larr; Back to Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
