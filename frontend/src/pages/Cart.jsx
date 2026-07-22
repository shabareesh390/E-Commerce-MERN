import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const totalAmount = items.reduce((acc, item) => acc + (item.product.price * item.qty), 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our latest products and start shopping.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
          <ul role="list" className="border-t border-b border-slate-200 divide-y divide-slate-200">
            {items.map((item) => (
              <li key={item.product._id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 sm:w-32 sm:h-32 shadow-sm">
                      No img
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                          <Link to={`/product/${item.product._id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.product.description}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">${item.product.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex flex-col items-end sm:items-center sm:flex-row sm:justify-end">
                      <div className="flex items-center border border-slate-300 rounded-md bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.qty - 1)}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-md transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 text-slate-900 font-medium border-x border-slate-300">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.qty + 1)}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-md transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4">
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          type="button" 
                          className="p-2 inline-flex text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 sticky top-6">
          <h2 className="text-xl font-bold text-slate-900">Order summary</h2>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-slate-600">Subtotal</dt>
              <dd className="text-sm font-medium text-slate-900">${totalAmount.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <dt className="flex items-center text-sm text-slate-600">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-medium text-slate-900">$5.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <dt className="flex items-center text-sm text-slate-600">
                <span>Tax estimate</span>
              </dt>
              <dd className="text-sm font-medium text-slate-900">${(totalAmount * 0.08).toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <dt className="text-lg font-bold text-slate-900">Order total</dt>
              <dd className="text-lg font-bold text-indigo-600">${(totalAmount + 5 + totalAmount * 0.08).toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <Link
              to="/checkout"
              className="w-full bg-indigo-600 border border-transparent rounded-full shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
